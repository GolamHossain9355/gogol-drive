/* eslint-disable no-empty-pattern */
import { Container, Nav, Navbar } from "react-bootstrap"
import { Link, Outlet } from "react-router-dom"

type Props = object

export default function NavbarRoutes({}: Props) {
   return (
      <Container fluid className="p-0">
         <Navbar bg="light" expanded={true} expand="xg">
            <div className="d-flex container">
               <Navbar.Brand className="m-2 my-0 mr-0" to="/" as={Link}>
                  WDS Drive
               </Navbar.Brand>

               <Nav>
                  <Nav.Link to="/profile" as={Link}>
                     Profile
                  </Nav.Link>
               </Nav>
            </div>
         </Navbar>

         <div className="container">
            <Outlet />
         </div>
      </Container>
   )
}
