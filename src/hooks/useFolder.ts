/* eslint-disable no-extra-semi */
import { useEffect, useReducer } from "react"
import {
   getDoc,
   doc,
   DocumentReference,
   DocumentData,
   where,
   query,
   orderBy,
   onSnapshot,
} from "firebase/firestore"
import { databaseCollections } from "../firebase"
import { useAuth } from "../contexts/AuthContext"

const ACTIONS = {
   SELECT_FOLDER: "select_folder",
   UPDATE_FOLDER: "update_folder",
   SET_CHILD_FOLDERS: "set_child_folders",
   SET_CHILD_FILES: "set_child_files",
} as const

type ObjectValues<T> = T[keyof T]
type Actions = ObjectValues<typeof ACTIONS>

export type Path = {
   id: string | null
   name: string
}

export type FolderData = {
   name: string
   id: string | null
   userId: string | null
   path: Path[] | []
   createdAt: Date | null
}

type FolderDataWithoutId = Omit<FolderData, "id">

export type FileData = {
   id: string | null
   name: string
   folderId?: string | null
   userId: string | null
   url: string
   createdAt: Date | null
}

type FolderState = {
   folderId?: string | null
   folder?: FolderData | null
   childFolders?: FolderData[]
   childFiles?: FileData[]
}

type FolderAction = {
   type: Actions
   payload: FolderState
}

type UseFolderFunction = (
   folderId?: string | null,
   folder?: Required<FolderData | null>
) => FolderState

function reducer(
   state: FolderState,
   { type, payload }: FolderAction
): FolderState {
   switch (type) {
      case "select_folder":
         return {
            folderId: payload?.folderId,
            folder: payload.folder,
            childFolders: [],
            childFiles: [],
         }

      case "update_folder":
         return {
            ...state,
            folder: payload.folder,
         }

      case "set_child_folders":
         return {
            ...state,
            childFolders: payload.childFolders,
         }

      case "set_child_files":
         return {
            ...state,
            childFiles: payload.childFiles,
         }

      default:
         return state
   }
}

export const ROOT_FOLDER = {
   id: null,
   userId: null,
   name: "Root",
   path: [],
   createdAt: null,
}

export const useFolder: UseFolderFunction = (
   folderId = null,
   folder = null
) => {
   const { currentUser } = useAuth()
   const initialState: FolderState = {
      folderId,
      folder,
      childFolders: [],
      childFiles: [],
   }

   const [state, dispatch] = useReducer(reducer, initialState)

   useEffect(() => {
      // basically whenever either folder or folderId changes, reset the values to match the current state
      dispatch({ type: "select_folder", payload: { folderId, folder } })
   }, [folderId, folder])

   useEffect(() => {
      if (!folderId) {
         return dispatch({
            type: "update_folder",
            payload: { folder: ROOT_FOLDER },
         })
      }

      ;(async () => {
         try {
            const folderRef: DocumentReference<DocumentData> = doc(
               databaseCollections.folders,
               folderId
            )
            const foundDoc = await getDoc(folderRef)

            dispatch({
               type: "update_folder",
               payload: {
                  folder:
                     databaseCollections.formatDoc<FolderDataWithoutId>(
                        foundDoc
                     ),
               },
            })
         } catch (err) {
            console.error(err)
            dispatch({
               type: "update_folder",
               payload: { folder: ROOT_FOLDER },
            })
         }
      })()
   }, [folderId])

   useEffect(() => {
      if (!currentUser) throw new Error("You must be logged in")

      const newQuery = query(
         databaseCollections.folders,
         where("parentId", "==", folderId),
         where("userId", "==", currentUser.uid),
         orderBy("createdAt")
      )

      const unsubscribe = onSnapshot(newQuery, (resp) => {
         const allDocsFormatted = resp.docs.map((doc) =>
            databaseCollections.formatDoc<FolderDataWithoutId>(doc)
         )

         dispatch({
            type: "set_child_folders",
            payload: {
               childFolders: allDocsFormatted,
            },
         })
      })

      return () => unsubscribe()
   }, [currentUser, folderId])

   useEffect(() => {
      if (!currentUser) throw new Error("You must be logged in")

      const newQuery = query(
         databaseCollections.files,
         where("folderId", "==", folderId),
         where("userId", "==", currentUser.uid),
         orderBy("createdAt")
      )

      const unsubscribe = onSnapshot(newQuery, (resp) => {
         const allDocsFormatted = resp.docs.map((doc) =>
            databaseCollections.formatDoc<FileData>(doc)
         )

         dispatch({
            type: "set_child_files",
            payload: { childFiles: allDocsFormatted },
         })
      })

      return () => unsubscribe()
   }, [currentUser, folderId])

   return state
}
