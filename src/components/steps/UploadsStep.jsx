import React from "react";

export default function UploadsStep({ formData, setFormData }) {
  const handleFileChange = e => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Uploads</h2>
      <div className="mb-4">
        <label>Profile Image</label>
        <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} className="block" />
      </div>
      <div className="mb-4">
        <label>Resume</label>
        <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="block" />
      </div>
    </div>
  );
}
