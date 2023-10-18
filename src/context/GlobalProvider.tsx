import { createContext, useContext, useEffect, useState } from 'react'

const GlobalContext = createContext<any>([])

const GlobalProvider = ({ children }: { children: any }) => {
  const [address, setAddress] = useState('')
  const [lang, setLang] = useState(localStorage.getItem('langToken') || 'en')

  const setLangToken = event => {
    if (event && event?.origin == import.meta.env.VITE_ORIGIN_URL && ['zh', 'en'].includes(event.data)) {
      setLang(event.data)
    }
  }

  useEffect(() => {
    window.addEventListener('message', setLangToken)
    return () => {
      window.removeEventListener('message', setLangToken)
    }
  }, [])
  const value = {
    lang,
    address,
    setAddress,
  }

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

const useGlobal = () => useContext(GlobalContext)

export { GlobalContext, GlobalProvider, useGlobal }
