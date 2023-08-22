import { useState } from "react"
import { Card, Alert, Button } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Profile() {
   const [error, setError] = useState<string>()
   const { currentUser, logout } = useAuth()
   const navigate = useNavigate()

   const handleLogout = async () => {
      setError("")

      try {
         await logout()
         navigate("/login", { replace: true })
      } catch {
         setError("Failed to log out")
      }
   }

   const handleDashboardNavigation = () => {
      navigate("/")
   }

   if (!currentUser) {
      throw new Error(`User is not logged in`)
   }

   return (
      <>
         <Card>
            <Card.Body>
               <h2 className="text-center mb-2">Profile</h2>
               {error && <Alert variant="danger">{error}</Alert>}
               <strong>Email:</strong> {currentUser.email}
               <Link
                  to="/update-profile"
                  className="btn btn-primary w-100 mt-3"
               >
                  Update Profile
               </Link>
            </Card.Body>

            <Button variant="link" onClick={handleLogout}>
               Log Out
            </Button>

            <Button variant="link" onClick={handleDashboardNavigation}>
               Dashboard
            </Button>
         </Card>
      </>
   )
}
