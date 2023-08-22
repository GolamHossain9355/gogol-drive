import "bootstrap/dist/css/bootstrap.min.css"
import React from "react"
import ReactDOM from "react-dom/client"
import ErrorPage from "./errors/ErrorPage.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext.tsx"
import NotFound from "./errors/NotFound.tsx"
import {
   Dashboard,
   Login,
   Profile,
   Register,
   ResetPassword,
   UpdateProfile,
} from "./pages"
import { AuthWrapper, NavbarRoutes, PrivateRoutes, Root } from "./layouts"

import "./index.css"

const router = createBrowserRouter([
   {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
         {
            element: <PrivateRoutes />,
            children: [
               {
                  element: <NavbarRoutes />,
                  children: [
                     {
                        // Home page after login
                        index: true,
                        element: <Dashboard />,
                     },
                     {
                        path: "folder/:folderId",
                        element: <Dashboard />,
                     },
                  ],
               },
            ],
         },

         // Authentication Routes
         {
            element: <AuthWrapper />,
            children: [
               {
                  // Private Routes. (Cant access without logging in)
                  element: <PrivateRoutes />,
                  children: [
                     {
                        path: "profile",
                        element: <Profile />,
                     },
                     {
                        path: "update-profile",
                        element: <UpdateProfile />,
                     },
                  ],
               },
               {
                  path: "login",
                  element: <Login />,
               },
               {
                  path: "register",
                  element: <Register />,
               },
               {
                  path: "reset-password",
                  element: <ResetPassword />,
               },
            ],
         },

         // "Page Not Found" route
         {
            path: "*",
            element: <NotFound />,
         },
      ],
   },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <AuthProvider>
         <RouterProvider router={router} />
      </AuthProvider>
   </React.StrictMode>
)
