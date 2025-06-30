import React from "react";

export default function PreviewStep({ formData }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Preview Your Details</h2>
      <div className="mb-2"><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
      <div className="mb-2"><strong>Location:</strong> {formData.location}</div>
      <div className="mb-2"><strong>Salary Expectation:</strong> {formData.salaryExpectation}</div>
      <div className="mb-2"><strong>Preferred Roles:</strong> {formData.preferredRoles.join(", ")}</div>
      <div className="mb-2"><strong>Education:</strong>
        <ul>
          {formData.education.map((edu, i) => (
            <li key={i}>
              {edu.level}, {edu.institution}, {edu.university}, {edu.branch}, {edu.yearFrom}-{edu.yearTo}, Marks: {edu.marks}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-2"><strong>Experience:</strong>
        <ul>
          {formData.experience.map((exp, i) => (
            <li key={i}>
              {exp.title} at {exp.company}, {exp.location}, {exp.yearFrom}-{exp.yearTo} <br />
              {exp.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-2"><strong>Profile Image:</strong> {formData.profileImage ? formData.profileImage.name : "Not uploaded"}</div>
      <div className="mb-2"><strong>Resume:</strong> {formData.resume ? formData.resume.name : "Not uploaded"}</div>
      <div className="text-sm text-gray-500 mt-4">Please review all details before submitting. Use Back to edit any section.</div>
    </div>
  );
}
