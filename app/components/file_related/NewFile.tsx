import React, { useRef, useState } from "react";
import { FiFolder, FiFile, FiPlusCircle, FiX, FiCheck } from "react-icons/fi";

const NewFile: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentType, setCurrentType] = useState<"file" | "folder">("folder");
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateClick = (type: "file" | "folder") => {
    setCurrentType(type);
    setShowInput(true);
    setShowMenu(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log(`Creating ${currentType}: ${inputValue}`);
      // Here you would typically call an API or update state
    }
    setInputValue("");
    setShowInput(false);
  };

  return (
    <div className="w-32 h-32 m-2 shadow-lg relative rounded-md hover:bg-gray-100 transition-colors duration-200">
      <div className="flex flex-col items-center justify-center p-2 h-full relative">
        {showInput ? (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col items-center">
              {currentType === "folder" ? (
                <FiFolder className="text-yellow-400 mb-2" size={40} />
              ) : (
                <FiFile className="text-blue-400 mb-2" size={40} />
              )}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={`${
                  currentType === "folder" ? "Folder" : "File"
                } name`}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="p-1 text-green-500 hover:bg-green-50 rounded"
                  title="Create"
                >
                  <FiCheck size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowInput(false)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  title="Cancel"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <>
            <FiPlusCircle
              className="text-blue-400 mb-2 cursor-pointer hover:text-blue-500 transition-colors"
              size={50}
              onClick={() => setShowMenu(!showMenu)}
            />
            <span className="text-xs text-gray-600">New</span>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute left-full top-0 ml-2 bg-white shadow-lg rounded-md py-2 z-10 min-w-[180px]"
              >
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  onClick={() => handleCreateClick("folder")}
                >
                  <FiFolder className="mr-3 text-yellow-500" />
                  <span>New Folder</span>
                </button>
                <button
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                  onClick={() => handleCreateClick("file")}
                >
                  <FiFile className="mr-3 text-blue-500" />
                  <span>New File</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewFile;
