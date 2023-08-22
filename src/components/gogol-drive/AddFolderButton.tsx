/* eslint-disable no-empty-pattern */
import { FormEvent, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolderPlus } from "@fortawesome/free-solid-svg-icons"
import { databaseCollections } from "../../firebase"
import { addDoc } from "firebase/firestore"
import { useAuth } from "../../contexts/AuthContext"
import { FolderData, ROOT_FOLDER } from "../../hooks/useFolder"

type Props = {
   currentFolder: FolderData
}

export default function AddFolderButton({ currentFolder }: Props) {
   const [name, setName] = useState("")
   const [open, setOpen] = useState(false)
   const { currentUser } = useAuth()

   const openModal = () => setOpen(true)

   const closeModal = () => setOpen(false)

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!currentUser) {
         throw new Error("You must be logged in")
      }

      if (!currentFolder) return

      const path = [...currentFolder.path]

      if (currentFolder !== ROOT_FOLDER && currentFolder.id) {
         path.push({
            id: currentFolder.id,
            name: currentFolder.name,
         })
      }

      addDoc(databaseCollections.folders, {
         name,
         userId: currentUser.uid,
         createdAt: databaseCollections.currentTimeStamp,
         parentId: currentFolder.id,
         path,
      })

      setName("")
      closeModal()
   }

   return (
      <>
         <Button onClick={openModal} variant="outline-success" size="sm">
            <FontAwesomeIcon icon={faFolderPlus} />
         </Button>

         <Modal show={open} onHide={closeModal}>
            <Form onSubmit={handleSubmit}>
               <Modal.Body className="my-2">
                  <Form.Group>
                     <Form.Label>Folder Name</Form.Label>
                     <Form.Control
                        className="my-2"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                     />
                  </Form.Group>
               </Modal.Body>

               <Modal.Footer>
                  <Button variant="secondary" onClick={closeModal}>
                     Close
                  </Button>

                  <Button variant="success" type="submit">
                     Add Folder
                  </Button>
               </Modal.Footer>
            </Form>
         </Modal>
      </>
   )
}
