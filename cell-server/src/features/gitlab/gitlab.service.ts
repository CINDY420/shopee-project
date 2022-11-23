import { Injectable, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Types } from '@gitbeaker/core'
import { Gitlab } from '@gitbeaker/node'
import {
  CreateProjectBranchParams,
  CreateProjectBranchQuery,
  CreateProjectBranchResponse,
  DeleteProjectBranchParams,
  GetProjectBranchParams,
  GetProjectBranchResponse,
  ListProjectBranchesParams,
  ListProjectBranchesResponse,
} from '@/features/gitlab/dtos/gitlab.branch.dto'
import {
  GitlabFileSchema,
  ListProjectRepositoryFilesParams,
  ListProjectRepositoryFilesResponse,
} from '@/features/gitlab/dtos/gitlab.repository.dto'
import { tryCatch } from '@/common/utils/try-catch'
import { throwError } from '@/common/utils/throw-error'
import { ERROR } from '@/common/constants/error'
import crypto from 'crypto'
import tar from 'tar'
import path from 'path'
import { existsSync, rmSync } from 'fs'
import { readdir, readFile, mkdir, writeFile } from 'fs/promises'
import rimraf from 'rimraf'
import {
  CreateGitlabCommitBodyDto,
  CreateGitlabCommitParamsDto,
} from '@/features/gitlab/dtos/gitlab.commit.dto'
import { IJwtBody } from '@/features/auth/strategies/jwt.strategy'
import { differenceWith, intersectionWith } from 'lodash'
import { CommitAction } from '@gitbeaker/core/dist/types/types'
import { ApplicationEntity } from '@/entities/application.entity'
import { ISpaceUser } from '@infra-node-kit/space-auth'
import { execSync } from 'child_process'
import { logger } from '@infra-node-kit/logger'
import { createApp } from 'inix'

const TEMPORARY_FOLDER_PATH = `${process.cwd()}/temp`
const TAR_FILE_NAME = 'temp.tar.gz'

@Injectable({ scope: Scope.REQUEST })
export class GitlabService {
  private readonly gitlabNamespaceId: number
  constructor(private configService: ConfigService) {
    this.gitlabNamespaceId = this.configService.get('gitlabNamespaceId')!
  }

  private getClient(token: string) {
    return new Gitlab({
      oauthToken: token,
      host: this.configService.get('gitlabBaseUrl'),
    })
  }

  async listProjectBranches(
    params: ListProjectBranchesParams,
    token: string,
  ): Promise<ListProjectBranchesResponse> {
    const { projectId } = params
    const [items, error] = await tryCatch(this.getClient(token).Branches.all(projectId))
    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.GITLAB.REQUEST_ERROR,
        `list project ${projectId} all branches error: ${error.message}`,
      )
    }

    return {
      branches: items.map((item) => {
        const { name, merged, web_url: url, commit } = item
        const { id, title, message, web_url: commitUrl } = commit as Types.CommitSchema

        return {
          name,
          merged,
          url,
          commit: {
            id,
            title,
            message,
            url: commitUrl,
          },
        }
      }),
    }
  }

  async getProjectBranch(
    params: GetProjectBranchParams,
    token: string,
  ): Promise<GetProjectBranchResponse> {
    const { projectId, branchName } = params

    const [branch, error] = await tryCatch(
      this.getClient(token).Branches.show(projectId, branchName),
    )
    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.GITLAB.REQUEST_ERROR,
        `get project ${projectId} branch ${branchName} error: ${error.message}`,
      )
    }
    const { name, merged, web_url: url, commit } = branch
    const { id, title, message, web_url: commitUrl } = commit as Types.CommitSchema

    return {
      name,
      merged,
      url,
      commit: {
        id,
        title,
        message,
        url: commitUrl,
      },
    }
  }

  async createProjectBranch(
    params: CreateProjectBranchParams,
    query: CreateProjectBranchQuery,
    token: string,
  ): Promise<CreateProjectBranchResponse> {
    const { projectId } = params
    const { branchName, ref } = query

    const [branch, error] = await tryCatch(
      this.getClient(token).Branches.create(projectId, branchName, ref),
    )
    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.GITLAB.REQUEST_ERROR,
        `create project ${projectId} branch ${branchName} error: ${error.message}`,
      )
    }
    const { name, merged, web_url: url, commit } = branch
    const { id, title, message, web_url: commitUrl } = commit as Types.CommitSchema

    return {
      name,
      merged,
      url,
      commit: {
        id,
        title,
        message,
        url: commitUrl,
      },
    }
  }

  async deleteProjectBranch(params: DeleteProjectBranchParams, token: string): Promise<void> {
    const { projectId, branchName } = params

    return await this.getClient(token).Branches.remove(projectId, branchName)
  }

  async listProjectRepositoryFiles(
    params: ListProjectRepositoryFilesParams,
    token: string,
  ): Promise<ListProjectRepositoryFilesResponse> {
    const { projectId, branchName } = params

    const [result, error] = await tryCatch(
      (
        this.getClient(token).Repositories.showArchive as (
          projectId: string | number,
          options: { sha: string },
        ) => Promise<string>
      )(projectId, { sha: branchName }),
    )

    if (error) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.GITLAB.REQUEST_ERROR,
        `list project ${projectId} files error: ${error.message}`,
      )
    }

    const randomId = crypto.randomBytes(16).toString('hex')
    const tarFilePath = path.resolve(TEMPORARY_FOLDER_PATH, randomId, TAR_FILE_NAME)

    if (!existsSync(TEMPORARY_FOLDER_PATH)) {
      await mkdir(TEMPORARY_FOLDER_PATH)
    }

    const workspacePath = path.resolve(TEMPORARY_FOLDER_PATH, randomId)
    await mkdir(workspacePath)

    const targetPath = path.resolve(workspacePath, 'files')
    await mkdir(targetPath)

    await writeFile(tarFilePath, result)

    const extractOptions = { f: tarFilePath, C: targetPath, strip: 1 }
    let files: GitlabFileSchema[] = []
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await tar.x(extractOptions)

      const filePaths = await this.getFilePathList(targetPath)
      files = await Promise.all(
        filePaths.map(async (path: string) => {
          const content = await readFile(path, { encoding: 'utf-8' })

          return {
            path: path.replace(`${targetPath}/`, ''),
            code: content,
          }
        }),
      )
    } catch {
      return {
        files: [],
      }
    } finally {
      rimraf(workspacePath, (error: Error | null | undefined) => {
        if (error) {
          throwError(ERROR.SYSTEM_ERROR.GITLAB_SERVICE.EXECUTE_ERROR, error.message)
        }
      })
    }

    const filesWithoutDeploy = files.filter((file) => {
      const { path } = file
      return !path.startsWith('deploy')
    })

    return {
      files: filesWithoutDeploy,
    }
  }

  async createCommit(
    params: CreateGitlabCommitParamsDto,
    body: CreateGitlabCommitBodyDto,
    user: IJwtBody,
  ) {
    const { projectId, branchName } = params
    const { sourceCommitId, commitMessage, files } = body
    const { username, email, gitlabToken } = user

    // list all file from last commit
    const { files: currentFiles } = await this.listProjectRepositoryFiles(
      { projectId, branchName: sourceCommitId },
      gitlabToken,
    )

    // todo: code diff to remove files which no changed
    const newFiles = differenceWith(
      files,
      currentFiles,
      (currentFile: GitlabFileSchema, file: GitlabFileSchema) => currentFile.path === file.path,
    )

    const updateFiles = intersectionWith(
      files,
      currentFiles,
      (currentFile: GitlabFileSchema, file: GitlabFileSchema) => currentFile.path === file.path,
    )

    const deleteFiles = differenceWith(
      currentFiles,
      files,
      (file: GitlabFileSchema, currentFile: GitlabFileSchema) => currentFile.path === file.path,
    )

    const commitActions = [
      ...newFiles.map((file: GitlabFileSchema): CommitAction => {
        const { code, path } = file
        return {
          action: 'create',
          filePath: path,
          content: code,
        }
      }),
      ...updateFiles.map((file: GitlabFileSchema): CommitAction => {
        const { code, path } = file
        return {
          action: 'update',
          filePath: path,
          content: code,
        }
      }),
      ...deleteFiles.map((file: GitlabFileSchema): CommitAction => {
        const { code, path } = file
        return {
          action: 'delete',
          filePath: path,
          content: code,
        }
      }),
    ]

    const result = await this.getClient(gitlabToken).Commits.create(
      projectId,
      branchName,
      commitMessage,
      commitActions,
      {
        author_email: email,
        author_name: username,
        force: true,
      },
    )

    const { id, title, message, web_url: url } = result

    return {
      id,
      title,
      message,
      url,
    }
  }

  private async getFilePathList(dirName: string): Promise<string[]> {
    let filePaths: string[] = []
    const items = await readdir(dirName, { withFileTypes: true })

    for (const item of items) {
      if (item.isDirectory()) {
        filePaths = [...filePaths, ...(await this.getFilePathList(`${dirName}/${item.name}`))]
      } else {
        filePaths.push(`${dirName}/${item.name}`)
      }
    }

    return filePaths
  }

  async createRepo(repoName: string, gitlabToken: string) {
    const [newRepo, createRepoError] = await tryCatch(
      this.getClient(gitlabToken).Projects.create({
        namespace_id: this.gitlabNamespaceId,
        name: repoName,
        visibility: 'internal',
      }),
    )

    if (createRepoError) {
      throwError(
        ERROR.REMOTE_SERVICE_ERROR.GITLAB.REQUEST_ERROR,
        `failed to create gitlab repo ${repoName}: ${createRepoError.message}`,
      )
    }
    return newRepo
  }

  async initRepo(
    app: ApplicationEntity,
    sshURL: string,
    userInfo: ISpaceUser,
    gitlabToken: string,
  ) {
    const { cmdbProjectName, cmdbModuleName, appName } = app
    const repoPath = path.join(process.cwd(), appName)
    const templatePath = path.join(process.cwd(), 'cell-template-test')
    const cleanup = () => {
      rmSync(templatePath, {
        recursive: true,
        force: true,
      })
      rmSync(repoPath, {
        recursive: true,
        force: true,
      })
    }

    try {
      execSync(
        `git clone https://oauth2:${gitlabToken}@git.garena.com/shopee/sz-devops/fe/kubernetes/cell-bff-test/cell-template-test.git ${templatePath}`,
      )
      execSync(`rm -rf ${repoPath}/.git`)
      logger.info('[initRepo] succeed to clone template')

      await createApp({
        templatePath,
        data: {
          projectName: appName,
          cmdbProjectName,
          cmdbModuleName,
          gitRepo: sshURL,
        },
        done: () => {
          try {
            const git = `git --work-tree=${repoPath} --git-dir=${repoPath}/.git`
            const addConfigCommand = `${git} config init.defaultBranch master && ${git} config user.name "${userInfo.full_name}" && ${git} config user.email "${userInfo.email}"`
            const commitCommand = `${git} add . && ${git} commit -m "Init project. Updated by Cell Platform."`
            const pushCommand = `${git} push https://oauth2:${gitlabToken}@git.garena.com/shopee/sz-devops/fe/kubernetes/cell-bff-test/${appName}.git`

            execSync(addConfigCommand)
            logger.info(`[initRepo] succeed to add config by ${addConfigCommand}`)

            execSync(commitCommand)
            logger.info(`[initRepo] succeed to add commit by ${commitCommand}`)

            execSync(pushCommand)
            logger.info(`[initRepo] succeed to push commit by ${pushCommand}`)

            cleanup()
          } catch (err) {
            logger.error(`[initRepo done] error: ${JSON.stringify(err)}`)
            cleanup()
            return
          }
        },
      })
    } catch (err) {
      logger.error(`[initRepo] error: ${JSON.stringify(err)}`)
      cleanup()
      return
    }
  }
}
