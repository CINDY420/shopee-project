/**
 * AsyncService is the base class for the services that needs to wait for sometime to come up, like ElasticSearch Service etc.
 */
export class AsyncService {
  protected ready = false

  async waitForReady() {
    if (this.ready) {
      return true
    }

    const checkIfReady = (callback) => {
      if (this.ready) {
        callback()
        return
      }

      setTimeout(() => checkIfReady(callback), 500)
    }

    return new Promise((resolve) => {
      checkIfReady(resolve)
    })
  }
}
