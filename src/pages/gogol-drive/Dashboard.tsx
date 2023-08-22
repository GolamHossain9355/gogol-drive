/* eslint-disable no-empty-pattern */

import { useLocation, useParams } from "react-router-dom"
import { AddFolderButton, Folder } from "../../components"
import { useFolder } from "../../hooks/useFolder"
import FolderBreadcrumbs from "../../components/gogol-drive/FolderBreadcrumbs"
import AddFileButton from "../../components/gogol-drive/AddFileButton"
import File from "../../components/gogol-drive/File"

type Props = object

export default function Dashboard({}: Props) {
   const { folderId } = useParams()
   const { state = {} } = useLocation()
   const { folder, childFolders, childFiles } = useFolder(folderId, state)

   if (!folder) {
      return <div>Loading current folder...</div>
   }

   return (
      <>
         <div className="d-flex align-items-center mt-2 mb-4">
            <FolderBreadcrumbs currentFolder={folder} />
            <AddFileButton currentFolder={folder} />
            <AddFolderButton currentFolder={folder} />
         </div>

         {childFolders && childFolders.length > 0 && (
            <div className="d-flex flex-wrap">
               {childFolders.map((childFolder) => (
                  <div
                     className="p-2"
                     style={{ maxWidth: "250px" }}
                     key={childFolder.id}
                  >
                     <Folder folder={childFolder} />
                  </div>
               ))}
            </div>
         )}

         {childFolders &&
            childFolders.length > 0 &&
            childFiles &&
            childFiles.length > 0 && <hr />}

         {childFiles && childFiles.length > 0 && (
            <div className="d-flex flex-wrap">
               {childFiles.map((childFile) => (
                  <div
                     className="p-2"
                     style={{ maxWidth: "250px" }}
                     key={childFile.id}
                  >
                     <File file={childFile} />
                  </div>
               ))}
            </div>
         )}
      </>
   )
}
