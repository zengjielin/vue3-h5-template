// 下载文件
export function downloadFile(
  { data, filename, type, headers } = { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
) {
  function splitDisposition(str) {
    const arr = str.split('"')
    str = arr[1]
    return decodeURIComponent(str)
  }
  if (headers) {
    filename = splitDisposition(headers['content-disposition'])
  }
  // const filename = splitDisposition(headers['content-disposition'])
  // const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  // const Base64 = require('js-base64').Base64
  // data = Base64.toUint8Array(data)
  // 兼容IE浏览器下载内容
  const blob =
    typeof File === 'function' ? new File([data], filename, { type: type }) : new Blob([data], { type: type })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const URL = window.URL || window.webkitURL
    // eslint-disable-next-line
    const downloadUrl = URL.createObjectURL(blob)

    if (filename) {
      // use HTML5 a[download] attribute to specify filename
      const a = document.createElement('a')
      // safari doesn't support this yet
      if (typeof a.download === 'undefined') {
        window.location = downloadUrl
      } else {
        a.href = downloadUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a) // 下载完成移除元素
        window.URL.revokeObjectURL(downloadUrl) // 释放掉blob对象
      }
    } else {
      window.location = downloadUrl
      window.URL.revokeObjectURL(downloadUrl) // 释放掉blob对象
    }
  }
}

export function downloadImage(imgSrc, imgName) {
  const a = document.createElement('a') // 生成一个a元素
  const event = new MouseEvent('click') // 创建一个单击事件
  a.download = imgName || 'photo' // 设置图片名称
  const img = new Image()
  img.crossOrigin = 'Anonymous' // 注意存放顺序
  img.onload = function () {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    const ext = imgSrc.substring(imgSrc.lastIndexOf('.') + 1).toLowerCase()
    const url = canvas.toDataURL('image/' + ext)
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  img.onerror = function () {
    // 获取图片失败尝试直接打开
    a.target = '_blank'
    a.href = imgSrc
    a.dispatchEvent(event) // 触发a的单击事件
  }
  img.src = imgSrc
}
