import React, { useState } from "react";
import ConfirmModal from "../ConfirmModal"; 
import { X } from "lucide-react";

export default function ExperienceStep({ formData, setFormData }) {
  const [showModal, setShowModal] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);

  const handleArrayChange = (idx, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const arr = [...prev.experience];
      arr[idx][name] = value;
      return { ...prev, experience: arr };
    });
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", yearFrom: "", yearTo: "", title: "", location: "", description: "" }
      ]
    }));
  };

  // Show modal and remember which index to delete
  const handleDeleteClick = idx => {
    setDeleteIdx(idx);
    setShowModal(true);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    setFormData(prev => {
      const arr = [...prev.experience];
      arr.splice(deleteIdx, 1);
      return { ...prev, experience: arr };
    });
    setShowModal(false);
    setDeleteIdx(null);
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowModal(false);
    setDeleteIdx(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Experience</h2>
      {formData.experience.map((exp, idx) => (
        <div key={idx} className="shadow bg-gray-50 p-2 mb-4 rounded relative">
          <input name="company" placeholder="Company" value={exp.company} onChange={e => handleArrayChange(idx, e)} className="border p-1 m-1 border-gray-300 outline-none rounded-lg" />
          <input name="yearFrom" placeholder="Year From" value={exp.yearFrom} onChange={e => handleArrayChange(idx, e)} className="border p-1 m-1 border-gray-300 outline-none rounded-lg" />
          <input name="yearTo" placeholder="Year To" value={exp.yearTo} onChange={e => handleArrayChange(idx, e)} className="border p-1 m-1 border-gray-300 outline-none rounded-lg" />
          <input name="title" placeholder="Title" value={exp.title} onChange={e => handleArrayChange(idx, e)} className="border p-1 m-1 border-gray-300 outline-none rounded-lg" />
          <input name="location" placeholder="Location" value={exp.location} onChange={e => handleArrayChange(idx, e)} className="border p-1 m-1 border-gray-300 outline-none rounded-lg" />
          <input name="description" placeholder="Description" value={exp.description} onChange={e => handleArrayChange(idx, e)} className="border p-1 m-1 border-gray-300 outline-none rounded-lg" />
          {formData.experience.length > 1 && (
            <button
              type="button"
              onClick={() => handleDeleteClick(idx)}
              className="text-red-500 ml-2 absolute right-2 top-2"
            >
              <X/>
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addItem} className="text-blue-500 mb-2">Add Experience</button>

      {showModal && (
        <ConfirmModal
          title="Delete Experience Entry"
          message="Are you sure you want to delete this experience entry? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
