import React, { useState, useRef } from "react";
import { CloudUpload, X } from "lucide-react";

export default function UploadsStep({ formData, setFormData }) {
  const profileImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [dragActiveProfile, setDragActiveProfile] = useState(false);
  const [dragActiveResume, setDragActiveResume] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);

  const handleFile = (name, file) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
    if (name === 'profileImage') {
      if(imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(file ? URL.createObjectURL(file) : null);
    }
  };

  const removeFile = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
    if (name === 'profileImage' && imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleDrag = (setDragActive) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (setDragActive, name, inputRef) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(name, e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = (inputRef) => {
    inputRef.current.click();
  };

  const handleInputChange = (name, inputRef) => (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(name, e.target.files[0]);
    }
  };

  const displayFileName = (file) => file ? file.name : "No file selected";

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Uploads</h2>
      <p className="mb-4 text-gray-700">Upload your profile image and resume</p>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-1">
          <label className="font-bold">Profile Image</label>
          <div
            onDragEnter={handleDrag(setDragActiveProfile)}
            onDragLeave={handleDrag(setDragActiveProfile)}
            onDragOver={handleDrag(setDragActiveProfile)}
            onDrop={handleDrop(setDragActiveProfile, "profileImage", profileImageInputRef)}
            onClick={() => triggerFileInput(profileImageInputRef)}
            className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-blue-400 transition cursor-pointer ${
              dragActiveProfile ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}
          >
            <CloudUpload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">
              Drag &amp; drop image or{" "}
              <span className="text-blue-600 underline">Browse</span>
            </p>
          </div>
          <input
            type="file"
            ref={profileImageInputRef}
            accept="image/*"
            onChange={handleInputChange("profileImage", profileImageInputRef)}
            className="hidden"
          />
          {formData.profileImage && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded border"
                />
              )}
              <span>Selected: {displayFileName(formData.profileImage)}</span>
              <button
                onClick={() => removeFile("profileImage")}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold">Resume</label>
          <div
            onDragEnter={handleDrag(setDragActiveResume)}
            onDragLeave={handleDrag(setDragActiveResume)}
            onDragOver={handleDrag(setDragActiveResume)}
            onDrop={handleDrop(setDragActiveResume, "resume", resumeInputRef)}
            onClick={() => triggerFileInput(resumeInputRef)}
            className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-gray-50 hover:border-blue-400 transition cursor-pointer ${
              dragActiveResume ? "border-blue-600 bg-blue-50" : "border-gray-300"
            }`}
          >
            <CloudUpload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">
              Drag &amp; drop resume or{" "}
              <span className="text-blue-600 underline">Browse</span>
            </p>
          </div>
          <input
            type="file"
            ref={resumeInputRef}
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange("resume", resumeInputRef)}
            className="hidden"
          />
          {formData.resume && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>Selected: {displayFileName(formData.resume)}</span>
              <button
                onClick={() => removeFile("resume")}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
