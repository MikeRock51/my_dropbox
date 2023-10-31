import React, { useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import {
  Collection,
  Card,
  useTheme,
  ThemeProvider,
} from "@aws-amplify/ui-react";
import theme from "./collectionTheme";
import getThumbnail from "../../utilities";
import { FiMoreVertical } from 'react-icons/fi';


function FileList({ upload }) {
  const [fileInfo, setFileInfo] = useState([]);
  const [files, setFiles] = useState([]);

  async function fetchAllFiles() {
    const { results } = await Storage.list("", { level: "private" });
    setFileInfo(results);
    const allFiles = await Promise.all(
      results.map(async (file) => {
        return await Storage.get(file.key, { level: "private" });
      })
    );
    setFiles(allFiles);
  }

  useEffect(() => {
    fetchAllFiles();
  }, [upload]);

  console.log(fileInfo);

  const { tokens } = useTheme();

  return (
    <div className="">
      <ThemeProvider theme={theme} colorMode="dark">
        <Collection
          type="list"
          items={files}
          padding="2rem"
          margin="0 auto"
          justifyContent="center"
          gap="small"
          direction="row"
          wrap="wrap"
          isPaginated
          itemsPerPage={5}
          isSearchable
          searchPlaceholder="Type to search file..."
        >
          {(file, index) => (
            <div className="relative">
              <Card
                key={index}
                lineHeight="small"
                backgroundColor="transparent"
                variation="elevated"
                width="300px"
                height="200px"
                className="group hover:opacity-75"
              >
                <img
                  src={getThumbnail(fileInfo[index]) || file}
                  alt={fileInfo[index].key}
                  className="h-full w-full object-contain"
                />
                <div className="absolute top-0 left-0 opacity-75 h-full w-full bg-lime-200 invisible group-hover:visible" />
                <div className="absolute top-0 left-0 ml-3 mt-4 w-3/5 text-left text-black invisible group-hover:visible">
                  <h4 className="font-bold">{fileInfo[index].key}</h4>
                  <p className="mt-1">{fileInfo[index].size/1000}kb</p>
                </div>
                <FiMoreVertical />
              </Card>
            </div>
          )}
        </Collection>
      </ThemeProvider>
    </div>
  );
}

export default FileList;
