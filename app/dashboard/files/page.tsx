"use client";
import FileBrowser from "@/app/components/file_related/FileBrowser";
import FileCard from "@/app/components/file_related/FileCard";
import FolderCard from "@/app/components/file_related/FolderCard";
import NewFile from "@/app/components/file_related/NewFile";
import React, { useState } from "react";

const FolderBrowser: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["/"]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [folders, setFolders] = useState([
    { id: "1", name: "Documents", type: "folder", path: "/Documents" },
    { id: "2", name: "Images", type: "folder", path: "/Images" },
    { id: "3", name: "report.pdf", type: "file", path: "/report.pdf" },
    { id: "4", name: "notes.txt", type: "file", path: "/notes.txt" },
  ]);

  const navigateTo = (path: string) => {
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(path);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const handleRename = (id: string, newName: string) => {
    setFolders(
      folders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder
      )
    );
  };

  const handleDelete = (id: string) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };

  return (
    <div className="w-full bg-sidebarcolor h-full pb-2 relative mx-auto overflow-auto scrollbar-hide">
      <FileBrowser
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        navigationHistory={navigationHistory}
        navigateTo={navigateTo}
      />
      <div className="p-2 flex flex-wrap">
        {folders.map((folder) =>
          folder.type === "folder" ? (
            <FolderCard
              key={folder.id}
              file={folder}
              onRename={(newName) => handleRename(folder.id, newName)}
              onDelete={() => handleDelete(folder.id)}
              onNavigation={navigateTo}
            />
          ) : (
            <FileCard
              key={folder.id}
              file={folder}
              onRename={(newName) => handleRename(folder.id, newName)}
              onDelete={() => handleDelete(folder.id)}
              onNavigation={navigateTo}
            />
          )
        )}
        <NewFile/>
      </div>
    </div>
  );
};

export default FolderBrowser;
