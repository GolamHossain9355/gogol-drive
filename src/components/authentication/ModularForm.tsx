import { FormEvent, RefObject } from "react"
import { Card, Button, Alert, Form } from "react-bootstrap"
import { Link } from "react-router-dom"

type Props = {
   title: string
   error: string
   loading: boolean
   currentEmail?: string
   handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
   emailRef: RefObject<HTMLInputElement>
   oldPasswordRef?: RefObject<HTMLInputElement>
   passwordRef?: RefObject<HTMLInputElement>
   newPasswordRef?: RefObject<HTMLInputElement>
   newPasswordConfirmRef?: RefObject<HTMLInputElement>
}

export default function ModularForm({
   title,
   error,
   loading,
   currentEmail,
   handleSubmit,
   emailRef,
   oldPasswordRef,
   passwordRef,
   newPasswordRef,
   newPasswordConfirmRef,
}: Props) {
   return (
      <Card>
         <Card.Body>
            <h2 className="text-center mb-2">{title}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
               <Form.Group id="email">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                     type="email"
                     ref={emailRef}
                     defaultValue={currentEmail || ""}
                  />
               </Form.Group>

               {oldPasswordRef && (
                  <Form.Group id="old-password">
                     <Form.Label>Old Password:</Form.Label>
                     <Form.Control
                        type="password"
                        ref={oldPasswordRef}
                        placeholder={"Enter current password"}
                     />
                  </Form.Group>
               )}

               {!newPasswordRef && (
                  <Form.Group id="password">
                     <Form.Label>Password:</Form.Label>
                     <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>
               )}

               {newPasswordConfirmRef && (
                  <>
                     <Form.Group id="new-password">
                        <Form.Label>New Password:</Form.Label>
                        <Form.Control
                           type="password"
                           ref={newPasswordRef}
                           placeholder={
                              title === "Update Profile"
                                 ? "Pass in the new password"
                                 : ""
                           }
                        />
                     </Form.Group>

                     <Form.Group id="new-password-confirm">
                        <Form.Label>Confirm New Password:</Form.Label>
                        <Form.Control
                           type="password"
                           ref={newPasswordConfirmRef}
                           placeholder={
                              title === "Update Profile"
                                 ? "Pass in the new password"
                                 : ""
                           }
                        />
                     </Form.Group>
                  </>
               )}

               <Button className="w-100 mt-3" type="submit" disabled={loading}>
                  {title}
               </Button>
            </Form>

            {title === "Log In" && (
               <div className="w-100 text-center mt-2">
                  <Link to="/reset-password">Forgot Password</Link>
               </div>
            )}
         </Card.Body>
      </Card>
   )
}
