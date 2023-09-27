import { createBrowserRouter } from 'react-router-dom'

const Layout = lazy(() => import('@/layout/index'))
const Home = lazy(() => import('@/pages/home/index'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
])

export default router
