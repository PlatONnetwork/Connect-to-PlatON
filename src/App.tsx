import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { LangProvider } from '@/context/LangProvider'

export default function App() {
  return (
    <Suspense fallback={<>...</>}>
      <LangProvider>
        <RouterProvider router={router}></RouterProvider>
      </LangProvider>
    </Suspense>
  )
}
