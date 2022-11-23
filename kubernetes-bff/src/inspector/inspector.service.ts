import { Injectable } from '@nestjs/common'
import { mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'
import * as heapdump from 'heapdump'

@Injectable()
export class InspectorService {
  async saveHeapdump(filePath: string) {
    const realPath = resolve(__dirname, filePath)
    if (!existsSync(realPath)) {
      mkdirSync(realPath, {
        recursive: true
      })
    }

    return new Promise<string>((resolve, reject) => {
      heapdump.writeSnapshot(realPath + '/' + Date.now() + '.heapsnapshot', (err, filename) => {
        if (err) {
          reject(err)
        } else {
          resolve(filename)
        }
      })
    })
  }
}
