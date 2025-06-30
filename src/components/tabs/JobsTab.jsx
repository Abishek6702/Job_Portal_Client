import React from "react";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobsTab = ({
  jobs = [],
  savedJobs = [],
  appliedJobs = [],
  toggleSaveJob,
  onApply,
}) => {
  const navigate = useNavigate(); // ✅ Add this line
  // console.log("mt",jobs)

  return (
    <div className="">
      <h3 className="font-bold text-2xl mb-8 flex items-center gap-3 text-blue-800">
        <Bookmark size={26} /> Saved Jobs
      </h3>

      {!jobs || jobs.length === 0 ? (
        <div className="text-gray-500 text-center py-12">
          No saved jobs yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => {
            const isApplied = appliedJobs.includes(job._id);

            return (
              <div
                key={job._id}
                className="relative flex flex-col justify-between gap-4 bg-gradient-to-br from-blue-50 via-white to-white border border-blue-100 rounded-xl shadow hover:shadow-md transition p-6"
              >
                {/* Bookmark Toggle */}
                <div className="absolute top-5 right-5">
                  <button
                    type="button"
                    aria-label={
                      savedJobs.includes(job._id) ? "Unsave Job" : "Save Job"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveJob(job._id);
                    }}
                    className="focus:outline-none"
                  >
                    <Bookmark
                      size={24}
                      className={
                        savedJobs.includes(job._id)
                          ? "text-blue-600 fill-blue-600"
                          : "text-gray-300"
                      }
                      fill={
                        savedJobs.includes(job._id) ? "currentColor" : "none"
                      }
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">
                    {job.position}
                  </h4>
                  <p className="text-gray-500 text-sm truncate">
                    {job.location}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  {isApplied ? (
                    <span className="border border-blue-300 text-blue-600 py-1 px-4 rounded-full text-xs font-semibold bg-blue-50">
                      Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => navigate("/jobs")}
                      className="text-blue-600 border border-blue-600 py-1 px-4 rounded-full hover:bg-blue-50 transition text-xs font-semibold"
                    >
                      Go to Jobs
                    </button>
                  )}

                  <span className="text-gray-400 text-xs ml-4 whitespace-nowrap">
                    {job.postedAt
                      ? new Date(job.postedAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobsTab;
