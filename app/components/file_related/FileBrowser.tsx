import React, { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiFolder,
  FiFile,
} from "react-icons/fi";

interface FileItemProps {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  navigationHistory: string[];
  navigateTo: (path: string) => void;
}

const FileBrowser: React.FC<FileItemProps> = ({
  currentPath,
  setCurrentPath,
  navigationHistory,
  navigateTo,
}) => {
  const [historyIndex, setHistoryIndex] = useState<number>(0);

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

  const refresh = () => {
    // Implement your refresh logic here
    console.log("Refreshing...");
  };

  const getBreadcrumbs = () => {
    const parts = currentPath.split("/").filter((part) => part !== "");
    const breadcrumbs = [];

    for (let i = 0; i < parts.length; i++) {
      const path = "/" + parts.slice(0, i + 1).join("/");
      breadcrumbs.push({
        name: parts[i],
        path: path,
      });
    }

    return breadcrumbs;
  };

  return (
    <div className="flex items-center p-2 bg-sidebarcolor shadow-bottom-sm border-b border-gray-200">
      <div className="flex space-x-1 mr-4">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className={`p-1 rounded ${
            historyIndex === 0
              ? "text-gray-400"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex === navigationHistory.length - 1}
          className={`p-1 rounded ${
            historyIndex === navigationHistory.length - 1
              ? "text-gray-400"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FiChevronRight size={20} />
        </button>
        <button
          onClick={refresh}
          className="p-1 rounded text-gray-700 hover:bg-gray-200"
        >
          <FiRefreshCw size={18} />
        </button>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-md px-3 py-1 overflow-x-auto">
        <button
          onClick={() => navigateTo("/")}
          className="text-blue-600 hover:underline text-sm"
        >
          This PC
        </button>
        {getBreadcrumbs().map((crumb, index) => (
          <React.Fragment key={index}>
            <span className="mx-2 text-gray-400">/</span>
            <button
              onClick={() => navigateTo(crumb.path)}
              className="text-blue-600 hover:underline text-sm truncate max-w-xs"
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FileBrowser;
