/* eslint-disable no-empty-pattern */
import { FormEvent, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ModularForm from "../../components/authentication/ModularForm"
import { useAuth } from "../../contexts/AuthContext"

type Props = object

export default function Register({}: Props) {
   const [error, setError] = useState("")

   const [loading, setLoading] = useState(false)
   const emailRef = useRef<HTMLInputElement>(null)
   const passwordRef = useRef<HTMLInputElement>(null)
   const confirmPasswordRef = useRef<HTMLInputElement>(null)
   const { register } = useAuth()
   const navigate = useNavigate()

   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()

      const emailValue = emailRef?.current?.value
      const passwordValue = passwordRef?.current?.value
      const confirmPasswordValue = confirmPasswordRef?.current?.value

      if (!passwordRef || !emailValue || !confirmPasswordValue) {
         return setError("Please enter all fields")
      }

      if (passwordValue !== confirmPasswordValue) {
         return setError("Passwords do not match")
      }

      try {
         setError("")
         setLoading(true)
         await register(emailValue, passwordValue)
         navigate("/", { replace: true })
      } catch {
         setError("Failed to create an account")
      }
      setLoading(false)
   }

   return (
      <>
         <ModularForm
            title="Register"
            emailRef={emailRef}
            newPasswordRef={passwordRef}
            newPasswordConfirmRef={confirmPasswordRef}
            handleSubmit={handleSubmit}
            loading={loading}
            error={error}
         />

         <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/login">Login</Link>
         </div>
      </>
   )
}
