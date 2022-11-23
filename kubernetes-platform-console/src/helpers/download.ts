export const forceDownload = (url: string, fileName: string) => {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = () => {
    const urlCreator = window.URL || window.webkitURL
    const imageUrl = urlCreator.createObjectURL(xhr.response)
    const tag = document.createElement('a')
    tag.href = imageUrl
    tag.download = fileName
    document.body.appendChild(tag)
    tag.click()
    document.body.removeChild(tag)
  }
  xhr.send()
}

export const downloadData = (data: string, filename: string, type = 'text/plain') => {
  const element = document.createElement('a')
  const file = new Blob([data], { type })
  element.href = URL.createObjectURL(file)
  element.download = filename
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
