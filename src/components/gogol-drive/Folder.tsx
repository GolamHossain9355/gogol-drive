/* eslint-disable no-empty-pattern */
import { Link } from "react-router-dom"
import { FolderData } from "../../hooks/useFolder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolder } from "@fortawesome/free-solid-svg-icons"
import { Button } from "react-bootstrap"

type Props = {
   folder: FolderData
}

export default function Folder({ folder }: Props) {
   return (
      <Link
         style={{ textDecoration: "none" }}
         to={`/folder/${folder.id}`}
         state={folder}
      >
         <Button
            className="d-flex align-items-center gap-2 text-truncate w-100"
            variant="outline-dark"
         >
            <FontAwesomeIcon icon={faFolder} />
            {folder.name}
         </Button>
      </Link>
   )
}
