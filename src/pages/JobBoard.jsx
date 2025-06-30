import React, { useState, useEffect } from "react";
import JobCardList from "../components/JobCardList";
import JobDetails from "../components/JobDetails";
import Navbar from "../components/Navbar";
import { Funnel, MapPin, Search, X } from "lucide-react";
import nodata from "../assets/cuate.svg"; // For filter and close icons

const filterOptions = {
  jobType: ["Full-time", "Freelance", "Internship", "Volunteer"],
  remote: ["On-site", "Remote", "Hybrid"],
  datePosted: ["Anytime", "Last 24 hours", "Last 7 days", "Last 30 days"],
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    // Fetch jobs from API
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/jobs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    // Filtering logic
    setFilteredJobs(
      jobs.filter((job) => {
        const matchPosition =
          !position ||
          job.position?.toLowerCase().includes(position.toLowerCase());
        const matchLocation =
          !location ||
          job.location?.toLowerCase().includes(location.toLowerCase());
        const matchJobType =
          filters.jobType.length === 0 ||
          filters.jobType.includes(job.workplace);
        const matchRemote =
          filters.remote.length === 0 || filters.remote.includes(job.workplace);
        // Date posted filter logic as needed
        return matchPosition && matchLocation && matchJobType && matchRemote;
      })
    );
  }, [jobs, position, location, filters]);

  // Filter checkbox handler
  const handleCheckbox = (name, value) => {
    setFilters((prev) => {
      const arr = prev[name];
      return {
        ...prev,
        [name]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  // Date posted select handler
  const handleSelect = (e) => {
    setFilters((prev) => ({ ...prev, datePosted: e.target.value }));
  };

  // Filter panel JSX (for reuse in sidebar and drawer)
  const FilterPanel = (
    <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-xs mx-auto shadow-md h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg">Filter</span>
        <button
          className="text-red-500 text-sm cursor-pointer hover:underline"
          onClick={() =>
            setFilters({
              jobType: [],
              remote: [],
              datePosted: "Anytime",
            })
          }
        >
          Clear all
        </button>
      </div>
      {/* Date Posted */}
      <div className="mb-4">
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
      {/* Job Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Job Type</label>
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
      {/* On-site/Remote */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">On-site/Remote</label>
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
      {/* Range Salary (placeholder, implement as needed) */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Range Salary</label>
        <input
          type="range"
          min="1000"
          max="5000"
          step="500"
          className="w-full"
          // Implement salary filter logic as needed
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$1,000</span>
          <span>$5,000+</span>
        </div>
      </div>
    </div>
  );

  // Sliding Job Details Panel styles
  const slidingPanelStyles = {
    position: "fixed",
    top: 0,
    right: 0,
    width: "50%",
    maxWidth: "95vw",
    height: "100vh",
    background: "#fff",
    boxShadow: "-2px 0 16px rgba(0,0,0,0.08)",
    zIndex: 50,
    transform: selectedJob ? "translateX(0)" : "translateX(110%)",
    transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
    overflowY: "auto",
  };

  return (
    <>
      {/* <Navbar /> */}
      {/* Fixed Search Bar */}
      <div className="sticky mt-2 top-0 left-0 w-full z-30 bg-white px-2 py-3 ">
        <div className="flex items-center justify-between max-w-5xl mx-auto gap-2">
          {/* Filter button on mobile/tablet */}
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
            onClick={() => setFilterDrawerOpen(true)}
          >
            <Funnel className="w-5 h-5" />
            Filters
          </button>
          {/* Search bar */}
          <form className="flex w-[60%] m-auto items-center border border-gray-300 rounded-full px-4 py-2 gap-4 mb-4">
            <Search className="text-gray-400" />

            <input
              type="text"
              placeholder="Search job title or keyword"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="flex-1 outline-none"
            />

            <div className="w-px h-6 bg-gray-300" />

            <div className="flex items-center flex-1">
              <MapPin className="text-gray-400" />

              <input
                type="text"
                placeholder="Country or timezone"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none ml-4"
              />
            </div>

            <div className="ml-auto">
              <button type="submit" className="rounded-full bg-green-100 p-2">
                <Search className="text-gray-400" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className=" max-w-7xl m-auto mt-6 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          {/* Sidebar filter: only visible on desktop */}
          <div className="hidden lg:block lg:col-span-3">{FilterPanel}</div>
          {/* Job Cards List */}
          <div className="col-span-1 lg:col-span-9">
            <div className="mb-2 font-semibold text-gray-700">
              {filteredJobs.length} Job{filteredJobs.length !== 1 && "s"} result
            </div>

            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <img
                  src={nodata} // Replace with your image path or URL
                  alt="No Results"
                  className="w-68 h-68 "
                />
                <p className="text-lg font-medium">No matching jobs found</p>
                <p className="text-sm mt-1 text-gray-400">
                  Try adjusting your filters or search keywords.
                </p>
              </div>
            ) : (
              <JobCardList
                jobs={filteredJobs}
                onSelectJob={setSelectedJob}
                selectedJob={selectedJob}
              />
            )}
          </div>

          {/* Sliding Job Details Panel */}
          <div style={slidingPanelStyles}>
            {selectedJob && (
              <JobDetails
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
              />
            )}
          </div>
        </div>
        {/* Overlay when job details panel is open */}
        {selectedJob && (
          <div
            className="fixed inset-0 tint z-40"
            onClick={() => setSelectedJob(null)}
          />
        )}
      </div>

      {/* Mobile/Tablet Filter Drawer */}
      {filterDrawerOpen && (
        <>
          <div
            className="fixed inset-0 tint z-50"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <aside
            className={`
              fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-white z-50 transition-transform duration-300 ease-in-out
              ${filterDrawerOpen ? "translate-x-0" : "-translate-x-full"}
              lg:hidden
            `}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <span className="font-semibold text-lg">Filter</span>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">{FilterPanel}</div>
          </aside>
        </>
      )}
    </>
  );
};

export default JobBoard;
