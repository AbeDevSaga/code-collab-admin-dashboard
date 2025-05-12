"use client";
import FileBrowser from "@/app/components/file_related/FileBrowser";
import FileCard from "@/app/components/file_related/FileCard";
import FolderCard from "@/app/components/file_related/FolderCard";
import NewFile from "@/app/components/file_related/NewFile";
import { TFile } from "@/app/constants/type";
import { fetchAllFiles } from "@/app/redux/slices/fileSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FolderBrowser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { files, loading, error } = useSelector((state: RootState) => state.file);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [navigationHistory, setNavigationHistory] = useState<string[]>(["/"]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);


  useEffect(() => {
    dispatch(fetchAllFiles());
  }, [dispatch]);

  // Get current directory contents
  const getCurrentContents = (): TFile[] => {
    if (!files || files.length === 0) return [];
    
    const findFolder = (items: TFile[], targetPath: string): TFile | null => {
      for (const item of items) {
        if (item.path === targetPath) return item;
        if (item.children) {
          const found = findFolder(item.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    const currentFolder = findFolder(files, currentPath);
    return currentFolder?.children || files;
  };

  const navigateTo = (path: string) => {
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(path);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const handleRename = (id: string, newName: string) => {
    
  };

  const handleDelete = (id: string) => {

  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(navigationHistory[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(navigationHistory[historyIndex + 1]);
    }
  };

  return (
    <div className="w-full bg-sidebarcolor h-full pb-2 relative mx-auto overflow-auto scrollbar-hide">
      <FileBrowser
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        navigationHistory={navigationHistory}
        navigateTo={navigateTo}
        historyIndex={historyIndex}
        onBack={goBack}
        onForward={goForward}
      />
      <div className="p-2 flex flex-wrap">
        {getCurrentContents().map((file) =>
          file.type === "folder" ? (
            <FolderCard
              key={file._id}
              file={file}
              onRename={(newName) => handleRename(file._id||"", newName)}
              onDelete={() => handleDelete(file._id||"")}
              onNavigation={navigateTo}
            />
          ) : (
            <FileCard
              key={file._id}
              file={file}
              onRename={(newName) => handleRename(file._id||"", newName)}
              onDelete={() => handleDelete(file._id||"")}
              onNavigation={navigateTo}
            />
          )
        )}
        <NewFile currentPath={currentPath}/>
      </div>
    </div>
  );
};

export default FolderBrowser;
