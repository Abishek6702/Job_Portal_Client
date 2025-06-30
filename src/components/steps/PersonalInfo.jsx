import React from "react";

export default function PersonalInfo({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
      <div className=" ">
        <div className="mb-4">
        <label>First Name</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="border p-2 border-gray-300 rounded-lg w-full outline-none"
          placeholder="Enter Your First Name"
        />
      </div>
      <div className="mb-4">
        <label>Last Name</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="border p-2 w-full border-gray-300 rounded-lg outline-none"
          placeholder="Enter Your Last Name"
        />
      </div>
      <div className="mb-4">
        <label>Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="border p-2 w-full border-gray-300 rounded-lg outline-none"
          placeholder="Enter Your Location"
        />
      </div>
      </div>
    </div>
  );
}
