import React from 'react';

const SkillsTab = ({ onboarding }) => {
  const skills = Array.isArray(onboarding?.skills)
    ? onboarding.skills
    : typeof onboarding?.skills === "string"
    ? onboarding.skills.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Skills</h2>
      {skills.length === 0 ? (
        <p className="text-gray-500">No skills added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsTab;
