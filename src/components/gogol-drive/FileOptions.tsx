import React, { MouseEvent, useState } from "react"
import { Button, Modal } from "react-bootstrap" // Import Alert from react-bootstrap
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
   fileUrl: string
}

export default function FileOptions({ fileUrl }: Props) {
   const [open, setOpen] = useState(false)
   const [copied, setCopied] = useState(false) 

   const openModal = () => setOpen(true)

   const closeModal = () => {
      setOpen(false)

      setTimeout(() => setCopied(false), 500)
   }

   const handleOpenClick = (e: MouseEvent<SVGSVGElement>) => {
      e.stopPropagation()
      openModal()
   }

   const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
   }

   const handleShareClick = async () => {
      try {
         await navigator.clipboard.writeText(fileUrl)
         setCopied(true)
      } catch (error) {
         console.error("Error copying text to clipboard: ", error)
      }
   }

   return (
      <div onClick={handleDivClick}>
         <FontAwesomeIcon icon={faShareFromSquare} onClick={handleOpenClick} />

         <Modal show={open} onHide={closeModal}>
            <Modal.Header>
               <Modal.Title className="mx-auto">
                  Copy url to share with others
               </Modal.Title>
            </Modal.Header>
            <Modal.Body className="my-2 d-flex justify-content-center gap-4">
               <Button variant="secondary" onClick={closeModal}>
                  Close
               </Button>

               <Button
                  variant={copied ? "secondary" : "success"}
                  onClick={handleShareClick}
               >
                  {copied ? "Copied" : "Copy Url"}
               </Button>
            </Modal.Body>
         </Modal>
      </div>
   )
}
