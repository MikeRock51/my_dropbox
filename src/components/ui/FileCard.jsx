import React, { useContext } from "react";
import { Card, Menu, MenuItem } from "@aws-amplify/ui-react";
import getThumbnail, {
  calculateFileSize,
  getFileExtension,
  getFileName,
  isFolder,
} from "../../utilities";
import { FiMoreHorizontal } from "react-icons/fi";
import { deleteFile, fetchAllFiles, shareFile } from "../storage";
import { FileContexts } from "../../contexts/FileContexts";
import { Storage } from "aws-amplify";

function FileCard({ index, file }) {
  const {
    fileInfos,
    setFileInfos,
    files,
    setFiles,
    folders,
    setFolders,
    shareLink,
    setShareLink,
    setTabIndex,
    tabIndex,
    setFolder,
  } = useContext(FileContexts);

  return (
    <div className="relative">
      <Card
        key={index}
        lineHeight="small"
        backgroundColor="transparent"
        variation="elevated"
        width="280px"
        height="200px"
        className="group hover:opacity-75"
      >
        {!isFolder(fileInfos[index].key) ? (
          <a href={file} target="_blank" rel="noreferrer noopener">
            <img
              src={getThumbnail(fileInfos[index]) || file}
              alt={fileInfos[index].key}
              className="h-full w-full object-contain"
            />
            <div className="absolute top-0 left-0 opacity-75 h-full w-full bg-lime-200 invisible group-hover:visible" />
            <div className="absolute bottom-0 left-0 ml-3 mb-4 w-fit text-left text-black invisible group-hover:visible">
              <h4 className="font-bold mr-2">
                {getFileName(fileInfos[index].key)}
              </h4>
              <p className="mt-1">
                {getFileExtension(
                  isFolder(fileInfos[index].key)
                    ? "FOLDER"
                    : fileInfos[index].key
                ).toUpperCase()}
                {!isFolder(fileInfos[index].key) &&
                  ` ~ ${calculateFileSize(fileInfos[index].size)}`}
              </p>
            </div>
          </a>
        ) : (
          <div
            className="cursor-pointer inline"
            key={index}
            onClick={() => {
              setTabIndex(index + 1);
              // console.log(index)
              // console.log(tabIndex);
              // console.log(folders[index].key)
              setFolder(folders[index].key)
            }}
          >
            <img
              src={getThumbnail(fileInfos[index]) || file}
              alt={fileInfos[index].key}
              className="h-full w-full object-contain"
            />
            <div className="absolute top-0 left-0 opacity-75 h-full w-full bg-lime-200 invisible group-hover:visible" />
            <div className="absolute bottom-0 left-0 ml-3 mb-4 w-fit text-left text-black invisible group-hover:visible">
              <h4 className="font-bold mr-2">
                {getFileName(fileInfos[index].key)}
              </h4>
              <p className="mt-1">
                {getFileExtension(
                  isFolder(fileInfos[index].key)
                    ? "FOLDER"
                    : fileInfos[index].key
                ).toUpperCase()}
                {!isFolder(fileInfos[index].key) &&
                  ` ~ ${calculateFileSize(fileInfos[index].size)}`}
              </p>
            </div>
          </div>
        )}
        <div className="absolute top-0 left-0 ml-3 mt-4 text-black">
          <Menu
            trigger={
              <button className="">
                <FiMoreHorizontal fontSize="24" />
              </button>
            }
            backgroundColor="#fff"
          >
            <MenuItem>Rename</MenuItem>
            {!isFolder(fileInfos[index].key) && (
              <MenuItem
                onClick={async () => {
                  setShareLink(await shareFile(fileInfos[index].key));
                }}
              >
                Share
              </MenuItem>
            )}
            <MenuItem
              onClick={async () => {
                const key = fileInfos[index].key;
                let fileIndex;
                console.log(key);

                if (isFolder(key)) {
                  const { results } = await Storage.list(key, {level: "private"});
                  for (const file of results) {
                    await Storage.remove(file.key, { level: "private" });
                    const fileIndex = fileInfos.findIndex((f) => f.key === file.key);
                    setFileInfos(fileInfos.filter((f, idx) => idx !== fileIndex));
                    setFiles(files.filter((f, idx) => idx !== fileIndex));
                  }
                  fileIndex = fileInfos.findIndex((f) => f.key === key);
                  setFolders(folders.filter((f) => f.key !== fileInfos[fileIndex].key));
                }
                deleteFile(fileInfos[fileIndex].key);
                isFolder(fileInfos[fileIndex].key) && setFolders(folders.filter((f) => f.key !== fileInfos[fileIndex].key));
                setFiles(files.filter((f) => f !== file));
                setFileInfos(fileInfos.filter((f) => f.key !== fileInfos[fileIndex].key));
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      </Card>
    </div>
  );
}

export default FileCard;
