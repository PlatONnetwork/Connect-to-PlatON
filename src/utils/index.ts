import { message } from 'antd'

export const getAddress = (str: string) => {
  if (str) {
    return str.substring(0, 6) + `...` + str.substring(str.length - 4, str.length)
  }
  return str
}

export const copyFn = (content: string) => {
  if (!content) return
  if (navigator.clipboard) {
    navigator.clipboard.writeText(content)
    message.success('Copied to clipboard successfully')
  } else {
    let textArea = document.createElement('textarea')
    textArea.value = content
    textArea.style.position = 'absolute'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
    message.success('Copied to clipboard successfully')
  }
}

export const isIOS = () => !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
