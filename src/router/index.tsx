import { createHashRouter } from 'react-router-dom'

import AiChat from '../pages/Ailayout/modules/AiChat/index'
import AiLayout from '../pages/Ailayout/index'
import DefaultModule from '../pages/Ailayout/modules/default/index'

// import TestHome from '../pages/TestHome/testhome'
// import Layout from '../pages/Layout/layout'
// import Home from '../pages/Layout/Home/home'
// import Test from '../pages/Layout/Test/test'
// import Movie from '../pages/Movie/movie'
// import Todolist from '../pages/Todolist/todolist'
// import Login from '../pages/Login/login'
// import Users from '../pages/Layout/Users/Users'
// import PostPass from '../pages/Layout/Test/postpass'
// import PostCate from '../pages/Layout/Test/postcate'
// import Message from '../pages/Layout/Message/message'
// import AuthRoute from '../components/AuthRoute'
// export const router = createHashRouter([
//   {
//     path: '/',
//     element: (
//       <AuthRoute>
//         <Layout />
//       </AuthRoute>
//     ),
//     children: [
//       { index: true, element: <AiChat /> },
//       { path: '/test', element: <Test /> },
//       { path: '/users', element: <Users /> },
//       { path: '/postpass', element: <PostPass /> },
//       { path: '/postcate', element: <PostCate /> },
//       { path: '/message', element: <Message /> }
//     ]
//   },
//   { path: '/testhome', element: <TestHome /> },
//   { path: '/login', element: <Login /> },
//   { path: '/movie', element: <Movie /> },
//   { path: '/aichat', element: <AiChat /> },
//   { path: '/todolist', element: <Todolist /> }
// ])

export const router = createHashRouter([
  {
    path: '/',
    element: <AiLayout />,
    children: [
      { index: true, element: <DefaultModule /> },
      { path: '/aiChat/:id', element: <AiChat /> }
    ]
  }
])
