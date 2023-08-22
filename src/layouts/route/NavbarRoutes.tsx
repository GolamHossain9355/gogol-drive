/* eslint-disable no-empty-pattern */
import { Container, Nav, Navbar } from "react-bootstrap"
import { Link, Outlet } from "react-router-dom"

type Props = object

export default function NavbarRoutes({}: Props) {
   return (
      <Container fluid>
         <Navbar bg="light" expanded={true} expand="xg">
            <Navbar.Brand to="/" as={Link}>
               WDS Drive
            </Navbar.Brand>

            <Nav>
               <Nav.Link to="/profile" as={Link}>
                  Profile
               </Nav.Link>
            </Nav>
         </Navbar>

         <Outlet />
      </Container>
   )
}
