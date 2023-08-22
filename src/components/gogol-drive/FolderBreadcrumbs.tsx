import { FolderData, Path, ROOT_FOLDER } from "../../hooks/useFolder"
import { Link } from "react-router-dom"

type Props = {
   currentFolder: FolderData
}

export default function FolderBreadcrumbs({ currentFolder }: Props) {
   let path: Path[] =
      currentFolder === ROOT_FOLDER
         ? []
         : [{ id: ROOT_FOLDER.id, name: ROOT_FOLDER.name }]

   if (currentFolder) {
      path = [...path, ...currentFolder.path]
   }

   return (
      <nav className="breadcrumb flex-grow-1 m-0">
         {path.map((folderPath, index) => (
            <li
               className="breadcrumb-item text-truncate"
               key={`${folderPath.id}-${index}`}
               style={{ maxWidth: "150px" }}
            >
               <Link
                  to={{
                     pathname: folderPath.id ? `/folder/${folderPath.id}` : "/",
                  }}
                  state={{
                     ...folderPath,
                     path: path.slice(1, index),
                  }}
               >
                  {folderPath.name}
               </Link>
            </li>
         ))}

         <li
            className="breadcrumb-item active text-truncate"
            aria-current="page"
            style={{ maxWidth: "200px" }}
         >
            {currentFolder && currentFolder.name}
         </li>
      </nav>
   )
}
