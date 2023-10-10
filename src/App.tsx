import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { GlobalProvider } from '@/context/GlobalProvider'
import Loading from '@/components/Loading'

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <GlobalProvider>
        <RouterProvider router={router}></RouterProvider>
      </GlobalProvider>
    </Suspense>
  )
}
