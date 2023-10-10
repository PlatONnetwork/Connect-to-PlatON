import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { GlobalProvider } from '@/context/GlobalProvider'

export default function App() {
  return (
    <Suspense fallback={<>...</>}>
      <GlobalProvider>
        <RouterProvider router={router}></RouterProvider>
      </GlobalProvider>
    </Suspense>
  )
}
