/* eslint-disable react-refresh/only-export-components */
import {
   ReactNode,
   createContext,
   useContext,
   useEffect,
   useState,
} from "react"
import { auth } from "../firebase"
import {
   User,
   createUserWithEmailAndPassword,
   sendPasswordResetEmail,
   signInWithEmailAndPassword,
   signOut,
   updateEmail,
   updatePassword,
} from "firebase/auth"

type Props = {
   children: ReactNode
}

type EmailPassword = (email: string, password: string) => Promise<void>
type Email = (email: string) => Promise<void>
type Password = (password: string) => Promise<void>

type ContextValues = {
   currentUser: User | null | undefined
   currentPassword: string | undefined
   register: EmailPassword
   login: EmailPassword
   logout: () => Promise<void>
   resetPassword: Email
   updateUserEmail: Email
   updateUserPassword: Password
}

const AuthContext = createContext({})

export const useAuth = () => {
   return useContext(AuthContext) as ContextValues
}

export function AuthProvider({ children }: Props) {
   const [currentUser, setCurrentUser] = useState<User | null>()
   const [currentPassword, setCurrentPassword] = useState<string>()
   const [pending, setPending] = useState(true)

   const register: EmailPassword = async (email, password) => {
      setCurrentPassword(password)
      await createUserWithEmailAndPassword(auth, email, password)
   }

   const login: EmailPassword = async (email, password) => {
      setCurrentPassword(password)
      await signInWithEmailAndPassword(auth, email, password)
   }

   const logout = async () => {
      await signOut(auth)
   }

   const resetPassword: Email = async (email) => {
      await sendPasswordResetEmail(auth, email)
   }

   const updateUserEmail: Email = async (email) => {
      if (!currentUser) throw new Error("Current user was not found")

      await updateEmail(currentUser, email)
   }

   const updateUserPassword: Password = async (password) => {
      if (!currentUser) throw new Error("Current user was not found")

      setCurrentPassword(password)

      await updatePassword(currentUser, password)
   }

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
         setCurrentUser(user)
         setPending(false)
      })

      return unsubscribe
   }, [])

   const value: ContextValues = {
      currentUser,
      currentPassword,
      register,
      login,
      logout,
      resetPassword,
      updateUserEmail,
      updateUserPassword,
   }

   if (pending) {
      return <h1>Loading...</h1>
   }

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
