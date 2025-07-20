import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Eye,
  Mail,
  Phone,
  ArrowLeft,
  Search,
  ChevronDown,
  ArrowDownToLine,
} from "lucide-react";
import { useParams } from "react-router-dom";
import ApplicationDetailsModal from "../components/ApplicationDetailsModal";
import ApplicationStatusChange from "../components/ApplicationStatusChange";

const CandidatesApplication = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusEditApplication, setStatusEditApplication] = useState(null);
  const [isBulkMode, setIsBulkMode] = useState(false);

  const [selectedApplications, setSelectedApplications] = useState([]);

  const [searchLocation, setSearchLocation] = useState("");
  const [experienceRange, setExperienceRange] = useState({ min: 0, max: 100 });
  const [dateSortOrder, setDateSortOrder] = useState("");
  const [originalApplications, setOriginalApplications] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const experienceOptions = [
    { label: "0 to 1 Years", min: 0, max: 1 },
    { label: "1 to 3 Years", min: 1, max: 3 },
    { label: "3 to 7 Years", min: 3, max: 7 },
    { label: "7 & Above", min: 7, max: 100 },
  ];

  const selectAllRef = useRef(null);

  // Fetch applications on mount or jobId change
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const decoded = jwtDecode(token);
        const employerId = decoded?.userId || decoded?.id;
        if (!employerId) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allApplications = await res.json();
        console.log("hi", applications);
        const filteredApplications = allApplications.filter(
          (app) => app.jobId && app.jobId._id === jobId
        );

        setApplications(filteredApplications);
        setOriginalApplications(filteredApplications);
        if (filteredApplications.length > 0 && filteredApplications[0].jobId) {
          setCompanyInfo({
            logo: filteredApplications[0].jobId.companyId.company_logo,
            name: filteredApplications[0].jobId.companyId.company_name,
            position: filteredApplications[0].jobId.position,
          });
        } else {
          setCompanyInfo(null);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchApplications();
    }
  }, [jobId]);

  // Filtering and sorting
  const getFilteredAndSortedApplications = () => {
    let result = [...applications];

    // Always exclude "In Progress" applications
    result = result.filter(
      (app) =>
        app.status?.toLowerCase() === "pending" ||
        app.status?.toLowerCase() === "rejected"
    );

    if (searchLocation) {
      result = result.filter((app) =>
        app.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    result = result.filter(
      (app) =>
        app.experience >= experienceRange.min &&
        app.experience <= experienceRange.max
    );

    if (selectedStatus) {
      result = result.filter(
        (app) => app.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    if (dateSortOrder === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (dateSortOrder === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return result;
  };

  const filteredAndSortedApplications = getFilteredAndSortedApplications();

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentApplications = filteredAndSortedApplications.slice(
    indexOfFirstRow,
    indexOfLastRow
  );
  const totalPages = Math.ceil(
    filteredAndSortedApplications.length / rowsPerPage
  );

  useEffect(() => {
    if (!selectAllRef.current) return;

    if (
      selectedApplications.length > 0 &&
      selectedApplications.length < currentApplications.length
    ) {
      selectAllRef.current.indeterminate = true;
    } else {
      selectAllRef.current.indeterminate = false;
    }
  }, [selectedApplications, currentApplications]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const openDetailsModal = (application) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setSelectedApplication(null);
    setIsDetailsModalOpen(false);
  };

  const openStatusModal = (application) => {
    setStatusEditApplication(application);
    setIsBulkMode(false);
    setIsStatusModalOpen(true);
  };

  const openBulkStatusModal = () => {
    setStatusEditApplication(null);
    setIsBulkMode(true);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setStatusEditApplication(null);
    setIsBulkMode(false);
    setIsStatusModalOpen(false);
  };

  const clearFilters = () => {
    setSearchLocation("");
    setExperienceRange({ min: 0, max: 100 });
    setDateSortOrder("");
    setSelectedStatus("");
    setApplications(originalApplications);
    setSelectedExperience("");
  };

  const handleExperienceChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedExperience(selectedValue);

    const selectedOption = experienceOptions.find(
      (opt) => opt.label === selectedValue
    );
    if (selectedOption) {
      setExperienceRange({ min: selectedOption.min, max: selectedOption.max });
    } else {
      setExperienceRange({ min: 0, max: 100 });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const handleSelectApplication = (appId) => {
    setSelectedApplications((prev) =>
      prev.includes(appId)
        ? prev.filter((id) => id !== appId)
        : [...prev, appId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApplications(currentApplications.map((app) => app._id));
    } else {
      setSelectedApplications([]);
    }
  };

  // Download all selected resumes with delay to avoid popup blocking
  const downloadSelectedResumes = () => {
    selectedApplications.forEach((appId, index) => {
      setTimeout(() => {
        window.open(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/applications/download/${appId}`,
          "_blank"
        );
      }, index * 500);
    });
  };

  const handleStatusChange = async () => {
    closeStatusModal();
    setSelectedApplications([]);
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/applications`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const allApplications = await res.json();
    const filteredApplications = allApplications.filter(
      (app) => app.jobId && app.jobId._id === jobId
    );
    setApplications(filteredApplications);
    setOriginalApplications(filteredApplications);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading applications...</div>;
  }
  console.log(companyInfo);
  return (
    <div className="container mx-auto px-4">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="w-5 h-5 cursor-pointer" />
        {companyInfo && (
          <>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/${companyInfo.logo}`}
              alt={`${companyInfo.name} Logo`}
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-xl font-semibold">{companyInfo.name}</h2>
          </>
        )}
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Active Applicants{" "}
        <span className="text-blue-600">
          (
          {
            applications.filter(
              (app) =>
                app.status?.toLowerCase() === "pending" ||
                app.status?.toLowerCase() === "rejected"
            ).length
          }
          )
        </span>
      </h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search Location"
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 outline-none"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
        </div>

        <div className="relative">
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 appearance-none pr-10 placeholder-gray-400 outline-none"
            onChange={handleExperienceChange}
            value={selectedExperience}
          >
            <option value="">Filter by Experience</option>
            {experienceOptions.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <ChevronDown />
          </div>
        </div>

        <div className="relative">
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 appearance-none pr-10 placeholder-gray-400 outline-none"
            value={dateSortOrder}
            onChange={(e) => setDateSortOrder(e.target.value)}
          >
            <option value="">Sort by Date</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <ChevronDown />
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 appearance-none pr-10 placeholder-gray-400 outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="in progress">In Progress</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <ChevronDown />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex justify-center lg:justify-start">
          <button
            className="p-2 bg-blue-600 text-white font-semibold rounded-lg border border-gray-300 cursor-pointer"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        {/* Bulk Change Status Button */}
        <div className="flex justify-center lg:justify-end">
          <button
            onClick={openBulkStatusModal}
            disabled={selectedApplications.length === 0}
            className={`px-4 py-2 rounded-lg ${
              selectedApplications.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Change Status ({selectedApplications.length})
          </button>
        </div>

        {/* Download Selected Resumes Button */}
        <div className="flex justify-center lg:justify-end">
          <button
            onClick={downloadSelectedResumes}
            disabled={selectedApplications.length === 0}
            className={`px-4 py-2 rounded-lg ${
              selectedApplications.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Download ({selectedApplications.length})
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-center">
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  ref={selectAllRef}
                  onChange={handleSelectAll}
                  checked={
                    selectedApplications.length ===
                      currentApplications.length &&
                    currentApplications.length > 0
                  }
                />
              </th>
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-2.5 font-bold uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentApplications.map((app) => (
              <tr key={app._id} className="text-center">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectedApplications.includes(app._id)}
                    onChange={() => handleSelectApplication(app._id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{app.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {companyInfo ? companyInfo.position : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(app.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{app.location}</td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                  <a
                    href={`tel:${app.phone}`}
                    className="text-blue-500 hover:text-blue-400"
                  >
                    <p className="bg-blue-100 p-1.5 rounded-full">
                      <Phone className="w-4 h-4" />
                    </p>
                  </a>
                  <a href={`mailto:${app.email}`} className="text-blue-500">
                    <p className="bg-blue-100 p-1.5 rounded-full">
                      <Mail className="w-4 h-4" />
                    </p>
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {app.experience}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p
                    className={`font-semibold p-1 rounded-lg px-2  ${
                      app.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : app.status === "rejected"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {app.status}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center gap-2">
                  <button
                    onClick={() => openDetailsModal(app)}
                    className="text-blue-500 hover:underline bg-blue-100 p-1.5 rounded-full flex items-center justify-center"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        `${
                          import.meta.env.VITE_API_BASE_URL
                        }/api/applications/download/${app._id}`,
                        "_blank"
                      )
                    }
                    className="text-green-600 hover:text-green-800 bg-green-100 p-1.5 rounded-full flex items-center justify-center"
                    title="Download Resume"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isStatusModalOpen && (
        <ApplicationStatusChange
          application={isBulkMode ? null : statusEditApplication}
          applicationIds={isBulkMode ? selectedApplications : undefined}
          isBulk={isBulkMode}
          onClose={closeStatusModal}
          onStatusUpdated={handleStatusChange}
        />
      )}

      {isDetailsModalOpen && selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={closeDetailsModal}
          onEditStatus={(app) => {
            closeDetailsModal();
            openStatusModal(app);
          }}
        />
      )}

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CandidatesApplication;
