import { createContext, useContext, useEffect, useState } from 'react'

const LangContext = createContext<any>([])

const LangProvider = ({ children }: { children: any }) => {
  const [lang, setLang] = useState(localStorage.getItem('langToken' || 'en'))

  const setLangToken = event => {
    if (event && event?.origin === 'https://scan.platon.network/') {
      setLang(event.data)
    }
  }

  useEffect(() => {
    window.addEventListener('message', setLangToken)
    return () => {
      window.removeEventListener('message', setLangToken)
    }
  }, [])

  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

const useLang = () => useContext(LangContext)

export { LangContext, LangProvider, useLang }
