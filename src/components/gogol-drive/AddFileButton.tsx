/* eslint-disable no-empty-pattern */
import { ChangeEvent, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FolderData, ROOT_FOLDER } from "../../hooks/useFolder"
import { faFileUpload } from "@fortawesome/free-solid-svg-icons"
import { databaseCollections, storage } from "../../firebase"
import { useAuth } from "../../contexts/AuthContext"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import {
   addDoc,
   query,
   where,
   updateDoc,
   getDocs,
   doc,
} from "firebase/firestore"
import { v4 as uuidV4 } from "uuid"
import ReactDOM from "react-dom"
import { ProgressBar, Toast } from "react-bootstrap"

type Props = {
   currentFolder: FolderData
}

type Uploading = {
   id: string
   name: string
   progress: number
   error: boolean
}

export default function AddFileButton({ currentFolder }: Props) {
   const [uploadingFiles, setUploadingFiles] = useState<Uploading[]>([])
   const { currentUser } = useAuth()

   const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target || !event.target.files) {
         throw new Error("Cannot find file to upload or current folder")
      }
      if (!currentUser) {
         throw new Error("Cannot find current user")
      }
      if (!currentFolder) {
         throw new Error("Cannot find current folder")
      }

      const id = uuidV4()
      setUploadingFiles((prev) => {
         return [
            ...prev,
            {
               id,
               name: file.name,
               progress: 0,
               error: false,
            },
         ]
      })

      const file: File = event.target.files[0]

      const joinedPath = currentFolder.path.map((path) => path.name).join("/")

      const filePath =
         currentFolder === ROOT_FOLDER
            ? `${joinedPath}/${file.name}`
            : `${joinedPath}/${currentFolder.name}/${file.name}`

      const storageRef = ref(storage, filePath)

      const uploadTask = uploadBytesResumable(storageRef, file, {
         contentType: file.type,
      })

      // Attach an event listener to track progress
      uploadTask.on(
         "state_changed",
         (snapshot) => {
            // Get the upload progress
            const progress = snapshot.bytesTransferred / snapshot.totalBytes

            setUploadingFiles((prev) => {
               return prev.map((uploadFile) => {
                  if (uploadFile.id === id) {
                     return { ...uploadFile, progress }
                  }

                  return uploadFile
               })
            })
         },
         (error) => {
            console.error("Error uploading: ", error)

            setUploadingFiles((prev) => {
               return prev.map((uploadFile) => {
                  if (uploadFile.id === id) {
                     return { ...uploadFile, error: true }
                  }

                  return uploadFile
               })
            })
         },
         async () => {
            // Handle completion (this function is optional)
            setUploadingFiles((prev) =>
               prev.filter((uploadFile) => uploadFile.id !== id)
            )

            // Get the download URL
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)

            const fileExistsQuery = query(
               databaseCollections.files,
               where("name", "==", file.name),
               where("userId", "==", currentUser.uid),
               where("folderId", "==", currentFolder.id)
            )

            const querySnapshot = await getDocs(fileExistsQuery)

            if (!querySnapshot.empty) {
               const fileId = querySnapshot.docs[0].id

               const documentRef = doc(databaseCollections.files, fileId)

               await updateDoc(documentRef, {
                  url: downloadUrl,
                  createdAt: databaseCollections.currentTimeStamp,
               })
            } else {
               // Add document to the files collection
               await addDoc(databaseCollections.files, {
                  url: downloadUrl,
                  name: file.name,
                  createdAt: databaseCollections.currentTimeStamp,
                  folderId: currentFolder.id,
                  userId: currentUser.uid,
               })
            }
         }
      )
   }

   return (
      <>
         <label className="btn btn-outline-success btn-sm m-2 my-0 ml-0">
            <FontAwesomeIcon icon={faFileUpload} />

            <input
               type="file"
               onChange={handleChange}
               style={{ opacity: 0, position: "absolute", left: "-9999px" }}
            />
         </label>

         {uploadingFiles.length > 0 &&
            ReactDOM.createPortal(
               <div
                  style={{
                     position: "absolute",
                     bottom: "1rem",
                     right: "1rem",
                     maxWidth: "250px",
                  }}
               >
                  {uploadingFiles.map((file) => (
                     <Toast
                        key={file.id}
                        onClose={() => {
                           setUploadingFiles((prev) => {
                              return prev.filter(
                                 (uploadFile) => uploadFile.id !== file.id
                              )
                           })
                        }}
                     >
                        <Toast.Header
                           closeButton={file.error}
                           className="w-100 d-flex"
                        >
                           <div className="text-truncate w-75">{file.name}</div>
                        </Toast.Header>

                        <Toast.Body>
                           <ProgressBar
                              animated={!file.error}
                              variant={file.error ? "danger" : "primary"}
                              now={file.error ? 100 : file.progress * 100}
                              label={
                                 file.error
                                    ? "Error"
                                    : `${Math.round(file.progress * 100)}%`
                              }
                           />
                        </Toast.Body>
                     </Toast>
                  ))}
               </div>,
               document.body
            )}
      </>
   )
}
