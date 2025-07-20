import React, { useState } from "react";
import ConfirmModal from "../ConfirmModal";
import { Plus, X } from "lucide-react";

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

  const handleDeleteClick = idx => {
    setDeleteIdx(idx);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setFormData(prev => {
      const arr = [...prev.experience];
      arr.splice(deleteIdx, 1);
      return { ...prev, experience: arr };
    });
    setShowModal(false);
    setDeleteIdx(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setDeleteIdx(null);
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-1">Experience</h2>
      <div className="flex items-center justify-between">
      <p className="mb-4 text-gray-700">Add your work experience</p>
      <button type="button" onClick={addItem} className="flex items-center text-white font-semibold mb-2 bg-blue-500 p-1 rounded-lg px-2">
        <Plus className="w-5"/>
        Add Experience
      </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto pr-2 ">
        {formData.experience.map((exp, idx) => (
          <div key={idx} className="relative p-4 mb-6 rounded  border-gray-200 bg-white">
            {formData.experience.length > 1 && (
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
                <label className="font-bold">Company</label>
                <input
                  name="company"
                  placeholder="Company"
                  value={exp.company}
                  onChange={e => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">Title</label>
                <input
                  name="title"
                  placeholder="Title"
                  value={exp.title}
                  onChange={e => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">Location</label>
                <input
                  name="location"
                  placeholder="Location"
                  value={exp.location}
                  onChange={e => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">Year From</label>
                <input
                  name="yearFrom"
                  type="date"
                  placeholder="Year From"
                  value={exp.yearFrom}
                  onChange={e => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold">Year To</label>
                <input
                  name="yearTo"
                  type="date"
                  placeholder="Year To"
                  value={exp.yearTo}
                  onChange={e => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 ">
                <label className="font-bold">Description</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={exp.description}
                  onChange={e => handleArrayChange(idx, e)}
                  className="border p-2 border-gray-300 rounded-md outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      

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
