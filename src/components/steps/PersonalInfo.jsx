import React from "react";

export default function PersonalInfo({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Personal Information</h2>
      <p className="mb-4 text-gray-700">Fill in your personal details</p>
      <div className=" ">
        <div className="mb-6 text-md">
        <label className="font-bold ">First Name</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="border p-2 border-gray-300 rounded-xl w-full outline-none mt-2"
          placeholder="Enter Your First Name"
        />
      </div>
      <div className="mb-4">
        <label className="font-bold">Last Name</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="border p-2 w-full border-gray-300 rounded-xl outline-none mt-2"
          placeholder="Enter Your Last Name"
        />
      </div>
      <div className="mb-4">
        <label className="font-bold">Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="border p-2 w-full border-gray-300 rounded-xl outline-none mt-2"
          placeholder="Enter Your Location"
        />
      </div>
      </div>
    </div>
  );
}

