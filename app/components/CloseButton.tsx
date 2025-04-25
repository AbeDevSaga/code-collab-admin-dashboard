import React from "react";
interface CloseButtonProps {
  closeModal: () => void; 
}

const CloseButton: React.FC<CloseButtonProps> = ({ closeModal }) => {
  return (
    <button
      onClick={closeModal}
      className="absolute top-0 right-0 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Close modal"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default CloseButton;
