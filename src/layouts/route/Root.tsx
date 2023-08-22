/* eslint-disable no-empty-pattern */
import { Outlet } from "react-router-dom"

type Props = object

export default function Root({}: Props) {
   return (
      <>
         <Outlet />
      </>
   )
}
