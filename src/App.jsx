
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Component/Home/Home'

import NotFound from './Component/Notfound/NotFound'
import Register from './Component/register/Register'
import Login from './Component/Login/Login'
import { Toaster } from 'react-hot-toast'
import AuthContextProvider from './Context/AuthContext'
import ProtectRoute from './Component/ProtectRoute/ProtectRoute'
import Profile from './Component/Profile/Profile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostDetails from './Component/PostDetails/PostDetails'

export default function App() {


  let router = createBrowserRouter([
    { path: "", element: <ProtectRoute><Home /></ProtectRoute>},
    { path: "home", element:<ProtectRoute><Home /></ProtectRoute>  },
    { path: "profile", element:<ProtectRoute><Profile /></ProtectRoute>  },
    { path:"/PostDetails/:id", element:<ProtectRoute><PostDetails /></ProtectRoute>  },
    { path: "Register", element: <Register /> },
    { path: "Login", element: <Login /> },
    { path: "*", element: <NotFound /> },




  ])

  let queryClient = new QueryClient()

  return <>

  <AuthContextProvider>
    <QueryClientProvider client={queryClient}> 
    <Toaster />
    <RouterProvider router={router} />
  </QueryClientProvider>
  </AuthContextProvider>
  </>
}

