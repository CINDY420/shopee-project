interface IProps {
  fn: () => void
  validate: (data) => boolean
  interval?: number
  maxAttempts?: number
}

export const poll = async ({ fn, validate, interval = 500, maxAttempts = 20 }: IProps) => {
  let attempts = 0

  const executePoll = async (resolve, reject) => {
    const result = await fn()
    attempts++

    if (validate(result)) {
      return resolve(result)
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'))
    } else {
      setTimeout(executePoll, interval, resolve, reject)
    }
  }

  return await new Promise(executePoll)
}
