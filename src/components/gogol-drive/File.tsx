import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FileData } from "../../hooks/useFolder"
import { faFile } from "@fortawesome/free-solid-svg-icons"

type Props = {
   file: FileData
}

export default function File({ file }: Props) {
   return (
      <a
         className="btn btn-outline-dark text-truncate w-100 d-flex align-items-center gap-2"
         href={file.url}
         target="_blank"
      >
         <FontAwesomeIcon icon={faFile} />
         {file.name}
      </a>
   )
}
