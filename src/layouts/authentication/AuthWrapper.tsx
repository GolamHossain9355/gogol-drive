/* eslint-disable no-empty-pattern */
import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"

type Props = object

export default function AuthWrapper({}: Props) {
   return (
      <Container
         className="d-flex align-items-center justify-content-center"
         style={{ minHeight: "100vh" }}
      >
         <div className="w-100" style={{ maxWidth: "400px" }}>
            <Outlet />
         </div>
      </Container>
   )
}
