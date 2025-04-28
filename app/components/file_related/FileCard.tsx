import { TFile } from "@/app/constants/type";
import React, { useState, useRef } from "react";
import { FiFile, FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

interface FileCardProps {
  file: TFile;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onNavigation?: (path: string) => void; // Optional navigation function
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  onRename,
  onDelete,
  onNavigation,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(file.name);
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

  const handleRenameClick = () => {
    setIsRenaming(true);
    setShowMenu(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName !== file.name) {
      onRename(newName);
    }
    setIsRenaming(false);
  };

  return (
    <div className="w-32 h-32 m-2 relative rounded-md hover:bg-gray-100 shadow-lg transition-colors duration-200">
      <div className="flex flex-col items-center justify-center p-2 h-full relative">
        <FiFile
          className="text-yellow-400 mb-2"
          size={50}
          onClick={() => onNavigation && onNavigation(file.path)}
        />

        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} className="w-full mt-1">
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameSubmit}
              className="w-full px-1 py-0.5 text-xs border border-gray-300 rounded text-center focus:outline-none focus:border-blue-400"
              autoFocus
            />
          </form>
        ) : (
          <div className="text-xs text-center break-words w-full px-1 overflow-hidden text-ellipsis line-clamp-2">
            {file.name}
          </div>
        )}

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-1 right-1  cursor-pointer"
        >
          <FiMoreVertical size={18} />
        </button>

        {showMenu && (
          <div
            ref={menuRef}
            className="absolute top-7 right-1 bg-white border border-gray-200 rounded shadow-md z-10 min-w-[120px]"
          >
            <div
              onClick={handleRenameClick}
              className="px-3 py-2 text-sm flex items-center hover:bg-gray-100 cursor-pointer"
            >
              <FiEdit2 className="mr-2" size={14} /> Rename
            </div>
            <div
              onClick={onDelete}
              className="px-3 py-2 text-sm flex items-center hover:bg-gray-100 cursor-pointer"
            >
              <FiTrash2 className="mr-2" size={14} /> Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileCard;
