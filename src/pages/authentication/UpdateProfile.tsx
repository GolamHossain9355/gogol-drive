import { FormEvent, useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { ModularForm } from "../../components"

export default function UpdateProfile() {
   const emailRef = useRef<HTMLInputElement>(null)
   const oldPasswordRef = useRef<HTMLInputElement>(null)
   const newPasswordRef = useRef<HTMLInputElement>(null)
   const newPasswordConfirmRef = useRef<HTMLInputElement>(null)
   const navigate = useNavigate()
   const { currentUser, currentPassword, updateUserEmail, updateUserPassword } =
      useAuth()
   const [error, setError] = useState("")
   const [loading, setLoading] = useState(false)

   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()

      const emailValue = emailRef?.current?.value
      const oldPasswordValue = oldPasswordRef?.current?.value
      const newPasswordValue = newPasswordRef?.current?.value
      const newPasswordConfirmValue = newPasswordConfirmRef?.current?.value

      if (
         !emailValue ||
         !oldPasswordValue ||
         !newPasswordValue ||
         !newPasswordConfirmValue
      ) {
         return setError("Please fill out all fields")
      }

      if (newPasswordValue && oldPasswordValue !== currentPassword) {
         return setError("Current password is incorrect")
      }

      if (newPasswordValue !== newPasswordConfirmValue) {
         return setError("Passwords do not match")
      }

      if (!currentUser) {
         return setError("User was not found")
      }

      const promises = []

      if (emailValue !== currentUser.email) {
         promises.push(updateUserEmail(emailValue))
      }

      if (newPasswordValue) {
         promises.push(updateUserPassword(newPasswordValue))
      }

      try {
         setError("")
         setLoading(true)
         await Promise.allSettled(promises)
         navigate("/profile", { replace: true })
      } catch {
         setError("Failed to update profile")
      } finally {
         setLoading(false)
      }
   }

   if (!currentUser || !currentUser.email) {
      throw new Error("User was not found")
   }

   return (
      <>
         <ModularForm
            title="Update Profile"
            emailRef={emailRef}
            error={error}
            currentEmail={currentUser.email}
            oldPasswordRef={oldPasswordRef}
            newPasswordRef={newPasswordRef}
            newPasswordConfirmRef={newPasswordConfirmRef}
            loading={loading}
            handleSubmit={handleSubmit}
         />
         <div className="w-100 text-center mt-2">
            <Link to="/profile">Cancel</Link>
         </div>
      </>
   )
}
