import { FormEvent, useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { ModularForm } from "../../components"

export default function Login() {
   const { currentUser } = useAuth()
   const { pathname } = useLocation()
   const [error, setError] = useState<string>("")
   const [loading, setLoading] = useState(false)
   const emailRef = useRef<HTMLInputElement>(null)
   const passwordRef = useRef<HTMLInputElement>(null)
   const { login } = useAuth()
   const navigate = useNavigate()

   if (currentUser && pathname.includes("login")) {
      return <Navigate to={"/"} replace={true} />
   }

   async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()

      const emailValue = emailRef?.current?.value
      const passwordValue = passwordRef?.current?.value

      if (!passwordValue || !emailValue) {
         return setError("Please enter all fields")
      }

      try {
         setError("")
         setLoading(true)
         await login(emailValue, passwordValue)
         navigate("/", { replace: true })
      } catch {
         setError("Failed to sign in")
      }
      setLoading(false)
   }

   return (
      <>
         <ModularForm
            emailRef={emailRef}
            passwordRef={passwordRef}
            loading={loading}
            error={error}
            handleSubmit={handleSubmit}
            title="Log In"
         />
         <div className="w-100 text-center mt-2">
            Need an account? <Link to="/register">Register</Link>
         </div>
      </>
   )
}
