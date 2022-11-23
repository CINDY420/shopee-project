import { Controller, Get, Res } from '@nestjs/common'
import * as inspector from 'inspector'
import { Response } from 'express'
import { createReadStream, statSync } from 'fs'
import { resolve } from 'path'
import { InspectorService } from './inspector.service'

const session = new inspector.Session()

session.connect()

@Controller('inspector')
export class InspectorController {
  constructor(private readonly inpectorService: InspectorService) {}

  @Get('/cpu')
  inspectCPU() {
    return new Promise((resolve, reject) => {
      session.post('Profiler.enable', () => {
        session.post('Profiler.start', () => {
          setTimeout(() => {
            session.post('Profiler.stop', (err, { profile }) => {
              if (err) {
                reject(err.message)
                return
              }

              resolve(JSON.stringify(profile))
            })
          }, 10000)
        })
      })
    })
  }

  @Get('/heapdump')
  async getHeapdump(@Res() res: Response) {
    const FILE_PATH = './heapdump/'
    const filePath = resolve(__dirname, FILE_PATH)
    const filename = await this.inpectorService.saveHeapdump(FILE_PATH)
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + filename,
      'Content-Length': statSync(resolve(__dirname, filePath, filename)).size
    })
    createReadStream(resolve(__dirname, filePath, filename)).pipe(res)
  }
}
