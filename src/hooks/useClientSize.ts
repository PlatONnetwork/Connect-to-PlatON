import { useEffect, useState } from 'react'
import { debounce } from 'lodash'

const useClientSize = () => {
  const [clientWidth, setClientWidth] = useState(document.documentElement.clientWidth)

  const onResize = debounce(() => {
    setClientWidth(document.documentElement.clientWidth)
  }, 400)

  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  return {
    clientWidth,
  }
}

export default useClientSize
