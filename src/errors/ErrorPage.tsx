/* eslint-disable no-empty-pattern */
import { useRouteError } from "react-router-dom"

type Props = object

type RouterError = {
   statusText?: string
   message?: string
}

export default function ErrorPage({}: Props) {
   const error = useRouteError() as RouterError
   const { statusText, message } = error
   console.error(error)

   return (
      <div
         className="flex text-2xl gap-10 flex-col justify-center text-red-500 items-center w-screen h-screen"
         id="error-page"
      >
         <h1 className="text-5xl font-bold ">Oops!</h1>
         <p>Sorry, an unexpected error has occurred.</p>
         <p className="text-gray-400">
            <i>
               {statusText
                  ? `Status Text: ${statusText}`
                  : `Message: ${message}`}
            </i>
         </p>
      </div>
   )
}
