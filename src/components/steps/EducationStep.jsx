import { X } from "lucide-react";
import React, { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal"; // Adjust path as needed

export default function EducationStep({ formData, setFormData }) {
  const [showModal, setShowModal] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);

  const handleArrayChange = (idx, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const arr = [...prev.education];
      arr[idx][name] = value;
      return { ...prev, education: arr };
    });
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          level: "",
          institution: "",
          university: "",
          branch: "",
          yearFrom: "",
          yearTo: "",
          marks: "",
        },
      ],
    }));
  };

  // Show modal and remember which index to delete
  const handleDeleteClick = (idx) => {
    setDeleteIdx(idx);
    setShowModal(true);
  };

  // Confirm deletion
  const handleConfirmDelete = () => {
    setFormData((prev) => {
      const arr = [...prev.education];
      arr.splice(deleteIdx, 1);
      return { ...prev, education: arr };
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
      <h2 className="text-xl font-bold mb-4">Education</h2>
      {formData.education.map((edu, idx) => (
        <div
          key={idx}
          className="relative shadow p-2 mb-4 rounded flex flex-wrap"
        >
          <input
            name="level"
            placeholder="Level"
            value={edu.level}
            onChange={(e) => handleArrayChange(idx, e)}
            className="border p-1 m-1 border-gray-300 rounded-lg outline-none"
          />
          <input
            name="institution"
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) => handleArrayChange(idx, e)}
            className="border p-1 m-1 border-gray-300 rounded-lg outline-none"
          />
          <input
            name="university"
            placeholder="University"
            value={edu.university}
            onChange={(e) => handleArrayChange(idx, e)}
            className="border p-1 m-1 border-gray-300 rounded-lg outline-none"
          />
          <input
            name="branch"
            placeholder="Branch"
            value={edu.branch}
            onChange={(e) => handleArrayChange(idx, e)}
            className="border p-1 m-1 border-gray-300 rounded-lg outline-none"
          />
          <input
            name="yearFrom"
            placeholder="Year From"
            value={edu.yearFrom}
            onChange={(e) => handleArrayChange(idx, e)}
            className="border p-1 m-1 border-gray-300 rounded-lg outline-none"
          />
          <input
            name="yearTo"
            placeholder="Year To"
            value={edu.yearTo}
            onChange={(e) => handleArrayChange(idx, e)}
            className="border p-1 m-1 border-gray-300 rounded-lg outline-none"
          />
          <input
            name="marks"
            placeholder="Marks"
            value={edu.marks}
            onChange={(e) => handleArrayChange(idx, e)}
            className="border p-1 m-1 border-gray-300 rounded-lg outline-none"
          />
          {formData.education.length > 1 && (
            <button
              type="button"
              onClick={() => handleDeleteClick(idx)}
              className="text-red-500 ml-2 flex absolute right-2 top-2 cursor-pointer"
            >
              <X />
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addItem} className="text-blue-500 mb-2">
        Add Education
      </button>

      {showModal && (
        <ConfirmModal
          title="Delete Education Entry"
          message="Are you sure you want to delete this education entry? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmLabel="Delete"
        />
      )}
    </div>
  );
}
