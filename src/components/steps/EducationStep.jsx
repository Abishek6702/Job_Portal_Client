import { X } from "lucide-react";
import React, { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal"; 

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

  const handleDeleteClick = (idx) => {
    setDeleteIdx(idx);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setFormData((prev) => {
      const arr = [...prev.education];
      arr.splice(deleteIdx, 1);
      return { ...prev, education: arr };
    });
    setShowModal(false);
    setDeleteIdx(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setDeleteIdx(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-1">Education</h2>
      <p className="mb-4 text-gray-700">Add your higher educational background</p>

      <div className="main-container max-h-[400px] overflow-y-auto pr-2">
        {formData.education.map((edu, idx) => (
          <div
            key={idx}
            className="relative p-4 mb-6 rounded   border-gray-200 bg-white "
          >
            {formData.education.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteClick(idx)}
                className="absolute right-2 top-2 text-red-500"
              >
                <X />
              </button>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold">Education Level</label>
                <input
                  name="level"
                  placeholder="Level"
                  value={edu.level}
                  onChange={(e) => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold">Institution</label>
                <input
                  name="institution"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold">University</label>
                <input
                  name="university"
                  placeholder="University"
                  value={edu.university}
                  onChange={(e) => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold">Branch</label>
                <input
                  name="branch"
                  placeholder="Branch"
                  value={edu.branch}
                  onChange={(e) => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold">Year From</label>
                <input
                  name="yearFrom"
                  type="date"
                  placeholder="Year From"
                  value={edu.yearFrom}
                  onChange={(e) => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold">Year To</label>
                <input
                  name="yearTo"
                  type="date"
                  placeholder="Year To"
                  value={edu.yearTo}
                  onChange={(e) => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold">Marks</label>
                <input
                  name="marks"
                  placeholder="Marks"
                  value={edu.marks}
                  onChange={(e) => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <button type="button" onClick={addItem} className="text-blue-500 mb-2">
        Add Education
      </button> */}

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
