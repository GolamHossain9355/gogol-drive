import { FormEvent, useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"

export default function ResetPassword() {
   const [error, setError] = useState<string>("")
   const [message, setMessage] = useState<string>("")
   const [loading, setLoading] = useState(false)
   const emailRef = useRef<HTMLInputElement>(null)
   const { resetPassword } = useAuth()

   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()

      const emailValue = emailRef?.current?.value

      if (!emailValue) {
         return setError("Please enter all fields")
      }

      try {
         setMessage("")
         setError("")
         setLoading(true)
         await resetPassword(emailValue)
         setMessage("Check your email for further instructions")
      } catch {
         setError("Failed to reset password")
      }
      setLoading(false)
   }

   return (
      <>
         <Card>
            <Card.Body>
               <h2 className="text-center mb-2">Reset Password</h2>
               {error && <Alert variant="danger">{error}</Alert>}
               {message && <Alert variant="success">{message}</Alert>}
               <Form onSubmit={handleSubmit}>
                  <Form.Group id="email">
                     <Form.Label>Email:</Form.Label>
                     <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>
                  <Button
                     className="w-100 mt-3"
                     type="submit"
                     disabled={loading}
                  >
                     Reset Password
                  </Button>
               </Form>
               <div className="w-100 text-center mt-2">
                  <Link to="/login">Log In</Link>
               </div>
            </Card.Body>
         </Card>

         <div className="w-100 text-center mt-2">
            Need an account? <Link to="/register">Register</Link>
         </div>
      </>
   )
}
