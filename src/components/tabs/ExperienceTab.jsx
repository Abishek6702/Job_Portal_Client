import React from "react";
import { Briefcase } from "lucide-react";

const ExperienceTab = ({ experience }) => (
  <div className=" rounded-2xl p-8">
    <h3 className="font-bold text-2xl mb-8 flex items-center gap-3 text-green-800">
      <Briefcase size={28} /> Experience Timeline
    </h3>
    {(!experience || experience.length === 0) && (
      <div className="text-gray-500 text-center py-8">No experience details found.</div>
    )}
    <div className="relative">
      {/* Vertical timeline line */}
      <div
        className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200"
        style={{
          height: experience.length > 0 ? 'calc(100% - 2rem)' : '0',
          top: '1.5rem'
        }}
      ></div>
      <ol className="space-y-10">
        {experience.map((exp, idx) => (
          <li key={idx} className="relative pl-10">
            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ring-4 ring-white shadow">
              <Briefcase size={20} className="text-green-600" />
            </div>
            {/* Experience card */}
            <div className="bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-semibold text-green-700 text-lg">{exp.title}</span>
                <span className="text-sm text-gray-400 mt-1 md:mt-0">
                  {exp.yearFrom} – {exp.yearTo}
                </span>
              </div>
              <div className="text-gray-800 mt-2 font-medium">
                {exp.company}{exp.location ? `, ${exp.location}` : ""}
              </div>
              <div className="text-gray-500 text-sm mt-1">
                {exp.description}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

export default ExperienceTab;
