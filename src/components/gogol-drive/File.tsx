import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FileData } from "../../hooks/useFolder"
import { faFile } from "@fortawesome/free-solid-svg-icons"
import FileOptions from "./FileOptions"

type Props = {
   file: FileData
}

export default function File({ file }: Props) {
   const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()

      window.open(file.url, "_blank")
   }

   return (
      <div
         className="btn btn-outline-dark text-truncate w-100 h-100 d-flex align-items-center gap-2"
         onClick={handleClick}
      >
         <FontAwesomeIcon icon={faFile} />

         <span className="text-truncate w-100" style={{ maxWidth: "150px" }}>
            {file.name}
         </span>

         <FileOptions fileUrl={file.url} />
      </div>
   )
}
