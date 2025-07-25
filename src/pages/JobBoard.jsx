import React, { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import JobCardList from "../components/JobCardList";
import JobDetails from "../components/JobDetails";
import { jwtDecode } from "jwt-decode";
import nodata from "../assets/cuate.svg";
import { Funnel, Locate, Search } from "lucide-react";

const filterOptions = {
  jobType: ["Full Time", "Freelance", "Internship", "Volunteer"],
  remote: ["On-site", "Remote", "Hybrid"],
  datePosted: ["Anytime", "Last 24 hours", "Last 7 days", "Last 30 days"],
};

const parseMinSalary = (salaryRange) => {
  if (!salaryRange) return 0;
  const parts = salaryRange.replace(/[$,]/g, "").split("-");
  return parseInt(parts[0].trim(), 10) || 0;
};

const getDateFilterRange = (datePostedOption) => {
  const now = new Date();
  switch (datePostedOption) {
    case "Last 24 hours":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "Last 7 days":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "Last 30 days":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(0);
  }
};

const JobBoard = () => {
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobType: [],
    remote: [],
    datePosted: "Anytime",
  });
  const [salaryRange, setSalaryRange] = useState([0, 5000000]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [jobFilter, setJobFilter] = useState("all");
  const [jobsLoading, setJobsLoading] = useState(false);
  const [appliedLoading, setAppliedLoading] = useState(false);
  const [hasInteractedWithSalarySlider, setHasInteractedWithSalarySlider] =
    useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showJobDetailFull, setShowJobDetailFull] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    setAppliedLoading(true);
    const token = localStorage.getItem("token");
    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/api/applications/${userId}/applied-jobs`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => setAppliedJobIds(data.appliedJobs || []))
      .catch((err) => console.error("Error fetching applied jobs:", err))
      .finally(() => setAppliedLoading(false));
  }, [userId]);

  useEffect(() => {
    setJobsLoading(true);
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setJobs)
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setJobsLoading(false));
  }, []);

  useEffect(() => {
    const filterDate = getDateFilterRange(filters.datePosted);

    setFilteredJobs(
      jobs.filter((job) => {
        const matchPosition =
          !position ||
          job.position?.toLowerCase().includes(position.toLowerCase());
        const matchLocation =
          !location ||
          job.location?.toLowerCase().includes(location.toLowerCase());
        // Extract job type from job.location text
        // Extract Job Type (e.g. "Full Time") from workplace
        const jobTypeFromWorkplace = job.workplace
          ? job.workplace
              .split(",")
              .map((s) => s.trim())
              .find((type) => filterOptions.jobType.includes(type))
          : null;

        const matchJobType =
          filters.jobType.length === 0 ||
          (jobTypeFromWorkplace &&
            filters.jobType.includes(jobTypeFromWorkplace));

        // Extract Work Place (e.g. "Remote") from workplace
        const workplaceType = job.workplace
          ? filterOptions.remote.find((opt) =>
              job.workplace
                .toLowerCase()
                .split(",")
                .some((val) => val.trim() === opt.toLowerCase())
            )
          : null;

        const matchRemote =
          filters.remote.length === 0 ||
          (workplaceType && filters.remote.includes(workplaceType));

        const jobDate = new Date(job.postedAt);
        const matchDatePosted =
          filters.datePosted === "Anytime" || jobDate >= filterDate;
        const jobMinSalary = parseMinSalary(job.salaryRange);
        const matchSalary =
          !hasInteractedWithSalarySlider ||
          (jobMinSalary >= salaryRange[0] && jobMinSalary <= salaryRange[1]);
        const applied = appliedJobIds.includes(job._id);
       

        return (
          matchPosition &&
          matchLocation &&
          matchJobType &&
          matchRemote &&
          matchDatePosted &&
          matchSalary
        );
      })
    );
  }, [
    jobs,
    position,
    location,
    filters,
    salaryRange,
    appliedJobIds,
    jobFilter,
    hasInteractedWithSalarySlider,
  ]);

  const handleCheckbox = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }));
  };

  const handleSelect = (e) => {
    setFilters((prev) => ({ ...prev, datePosted: e.target.value }));
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    if (isMobile) setShowJobDetailFull(true);
  };
  const handleCloseJobDetail = () => {
    setShowJobDetailFull(false);
    setTimeout(() => setSelectedJob(null), 250);
  };

  return (
    <>
      {isMobile && !showMobileFilter && (
        <button
          onClick={() => setShowMobileFilter(true)}
          className="flex items-center  gap-2 fixed z-50 top-37 right-6 p-2 px-3 bg-white text-blue-600 rounded-full border "
        >
          <Funnel className="w-5" />
          Filter
        </button>
      )}

      <div className="w-[98vw] mx-auto grid grid-cols-12 mt-4 h-[88vh] overflow-auto">
        {!isMobile ? (
          <div className="left-container col-span-3">
            <div className="bg-white border border-gray-300 rounded-lg p-6 sticky top-10">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">Filter</span>
                <button
                  className="rounded-lg bg-red-100 text-red-600 font-semibold text-sm p-2"
                  onClick={() => {
                    setFilters({
                      jobType: [],
                      remote: [],
                      datePosted: "Anytime",
                    });
                    setSalaryRange([0, 5000000]);
                    setJobFilter("all");
                    setHasInteractedWithSalarySlider(false);
                  }}
                >
                  Clear all
                </button>
              </div>
              <FilterForm
                filters={filters}
                salaryRange={salaryRange}
                setSalaryRange={setSalaryRange}
                setHasInteractedWithSalarySlider={
                  setHasInteractedWithSalarySlider
                }
                jobFilter={jobFilter}
                setJobFilter={setJobFilter}
                handleCheckbox={handleCheckbox}
                handleSelect={handleSelect}
              />
            </div>
          </div>
        ) : showMobileFilter ? (
          <>
            <div className="fixed z-50 inset-0 bg-white flex flex-col p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">Filter</span>
                <button
                  className="rounded-lg bg-red-100 text-red-600 font-semibold text-sm px-3 py-1"
                  onClick={() => {
                    setFilters({
                      jobType: [],
                      remote: [],
                      datePosted: "Anytime",
                    });
                    setSalaryRange([0, 5000000]);
                    setJobFilter("all");
                    setHasInteractedWithSalarySlider(false);
                  }}
                >
                  Clear all
                </button>
                <button
                  className="ml-2 rounded px-2 py-1 bg-gray-200 text-gray-700 font-semibold"
                  onClick={() => setShowMobileFilter(false)}
                >
                  Close
                </button>
              </div>
              <FilterForm
                filters={filters}
                salaryRange={salaryRange}
                setSalaryRange={setSalaryRange}
                setHasInteractedWithSalarySlider={
                  setHasInteractedWithSalarySlider
                }
                jobFilter={jobFilter}
                setJobFilter={setJobFilter}
                handleCheckbox={handleCheckbox}
                handleSelect={handleSelect}
              />
            </div>
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-30"
              onClick={() => setShowMobileFilter(false)}
            />
          </>
        ) : null}

        <div
          className={`right-container ${
            isMobile ? "col-span-12" : "col-span-9"
          } relative`}
        >
          <div className="search-container sticky top-0 z-10 bg-white px-2 w-full">
            <div className="max-w-4xl mx-auto ">
              <div className="flex items-center bg-white border border-gray-200 rounded-full px-6 py-2 shadow-sm">
                <div className="flex items-center flex-1 gap-2">
                  <Search className="w-5 text-gray-400 hidden md:block " />
                  <input
                    type="text"
                    placeholder="Search job title or keyword"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="bg-transparent outline-none text-gray-600 placeholder-gray-400 w-full  truncate"
                  />
                </div>
                <div className="h-8 border-l border-gray-200 mx-4"></div>
                <div className="flex items-center flex-1 gap-2">
                  <Locate className="w-5 text-gray-400 hidden md:block " />
                  <input
                    type="text"
                    placeholder="Country or timezone"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-transparent outline-none text-gray-600 placeholder-gray-400 w-full truncate"
                  />
                </div>
                <button
                  type="button"
                  className=" ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 transition"
                >
                  <Search className="w-5 text-gray-400 " />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 mb-4 font-semibold text-gray-700 px-4">
            {jobsLoading || appliedLoading ? (
              <span>Loading jobs...</span>
            ) : (
              <p className="text-xl text-blue-500">
                <span className="text-blue-600">
                  {
                    filteredJobs.filter(
                      (job) => !appliedJobIds.includes(job._id)
                    ).length
                  }
                </span>{" "}
                Jobs results
              </p>
            )}
          </div>

          {jobsLoading || appliedLoading ? (
            <div className="text-center py-10 text-gray-500">
              Loading jobs...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <img src={nodata} className="w-100 m-auto" />
              <p className="text-xl font-semibold">No Data Found</p>
            </div>
          ) : (
            <div
              className={`${
                isMobile ? "h-[75vh]" : "md:h-[75vh] lg:h-[500px]"
              } overflow-y-auto`}
            >
              <JobCardList
                jobs={filteredJobs}
                onSelectJob={handleSelectJob}
                selectedJob={selectedJob}
              />
            </div>
          )}
          {selectedJob && (
            <>
              {!isMobile && (
                <div
                  className="fixed inset-0 z-40 bg-black/50"
                  onClick={handleCloseJobDetail}
                />
              )}
              {isMobile && showJobDetailFull && (
                <div
                  className="fixed inset-0 z-40 bg-black/20"
                  onClick={handleCloseJobDetail}
                />
              )}
              <div
                className={`fixed ${
                  isMobile && showJobDetailFull
                    ? "inset-0 z-50 bg-white animate-fadeIn"
                    : "top-0 right-0 h-full z-50"
                } transition-transform duration-300`}
                style={
                  isMobile
                    ? { width: "100vw", height: "100vh" }
                    : {
                        width: "50vw",
                        maxWidth: "700px",
                        boxShadow: "-2px 0 16px rgba(0,0,0,0.08)",
                        transition: "transform 0.4s cubic-bezier(.4,0,.2,1)",
                        transform:
                          selectedJob && !showJobDetailFull
                            ? "translateX(0)"
                            : "translateX(110%)",
                      }
                }
              >
                <JobDetails
                  job={selectedJob}
                  onClose={handleCloseJobDetail}
                  isExpanded={isMobile ? true : false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

function FilterForm({
  filters,
  salaryRange,
  setSalaryRange,
  setHasInteractedWithSalarySlider,
  jobFilter,
  setJobFilter,
  handleCheckbox,
  handleSelect,
}) {
  return (
    <>
      <div className="mb-4 text-gray-600">
        <label className="block text-sm font-medium mb-1">Date Posted</label>
        <select
          value={filters.datePosted}
          onChange={handleSelect}
          className="w-full border rounded px-2 py-1 outline-none"
        >
          {filterOptions.datePosted.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 text-gray-600">
        <label className="block text-md font-medium mb-1">Job type</label>
        {filterOptions.jobType.map((type) => (
          <div key={type} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={filters.jobType.includes(type)}
              onChange={() => handleCheckbox("jobType", type)}
              className="mr-2"
            />
            <span>{type}</span>
          </div>
        ))}
      </div>
      <div className="mb-4 text-gray-600">
        <label className="block text-md font-medium mb-1">Work Place</label>
        {filterOptions.remote.map((type) => (
          <div key={type} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={filters.remote.includes(type)}
              onChange={() => handleCheckbox("remote", type)}
              className="mr-2"
            />
            <span>{type}</span>
          </div>
        ))}
      </div>
      <div className="mb-4 text-gray-600">
        <label className="block text-md font-medium mb-3">Salary Range</label>
        <RangeSlider
          min={0}
          max={5000000}
          step={10000}
          value={salaryRange}
          onInput={(value) => {
            setSalaryRange(value);
            setHasInteractedWithSalarySlider(true);
          }}
        />
        <div className="flex justify-between mt-2 text-sm">
          <span>₹{salaryRange[0].toLocaleString()}</span>
          <span>₹{salaryRange[1].toLocaleString()}</span>
        </div>
      </div>
      
    </>
  );
}

export default JobBoard;
