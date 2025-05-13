import React, { ChangeEvent, useRef, useState } from "react";
import { TFile, TOrganization, TProject, TUser } from "../../constants/type";

interface AddProjectProps {
  closeAddProject: () => void;
  onAddProject: (newProject: TProject) => void;
  organization?: TOrganization;
}

const AddProject: React.FC<AddProjectProps> = ({
  closeAddProject,
  onAddProject,
  organization
}) => {
  const [newProject, setNewProject] = useState<TProject>({
    name: "",
    description: "",
    status: "active",
    createdBy: {} as TUser,
    organization: organization || ({} as TOrganization),
    files: []
  });

  const [files, setFiles] = useState<TFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        type: file.type,
        path: URL.createObjectURL(file), // In a real app, you'd upload to a server
        extension: file.name.split('.').pop(),
        size: file.size
      } as TFile));

      setFiles(prev => [...prev, ...newFiles]);
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectToSubmit = {
      ...newProject,
      files: files.length > 0 ? files : undefined
    };
    onAddProject(projectToSubmit);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newProject.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* File Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Files
            </label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, XLS, JPG, PNG up to 10MB
              </p>
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Attached Files</h4>
                <ul className="divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <li key={index} className="py-2 flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          {file.type?.startsWith('image/') ? (
                            <img 
                              src={file.path} 
                              alt={file.name} 
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <span className="text-gray-500 text-xs">
                              {file.extension?.toUpperCase() || 'FILE'}
                            </span>
                          )}
                        </div>
                        <div className="ml-3 overflow-hidden">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size ? file.size / 1024 : 0).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeAddProject}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;