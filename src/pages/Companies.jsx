import React, { useEffect, useState } from "react";
import CompanyListing from "../components/CompanyListing";
import CompanyDetails from "../components/CompanyDetails";
import { Building2, LocateIcon, MapPin, Search } from "lucide-react";

const Companies = () => {
  const [fullScreen, setFullScreeen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [nameFilter, setNameFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [company, setCompany] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/companies`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await response.json();
        setCompany(data);
        if (data.length > 0 && window.innerWidth >= 768) {
          setCompanyDetails(data[0]);
        } else {
          setCompanyDetails({});
        }
      } catch (error) {
        console.error("Error fetching companies:", error.message);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = company.filter((c) => {
    const matchesName = c.company_name
      ?.toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesLocation = c.location
      ?.toLowerCase()
      .includes(locationFilter.toLowerCase());

    return matchesName && matchesLocation;
  });

  useEffect(() => {
    if (filteredCompanies.length === 0) {
      setCompanyDetails({}); // no results, clear detail
    } else {
      // If previously selected company isn't in filtered list, or if empty, select first from filtered
      if (
        !companyDetails ||
        !filteredCompanies.some((c) => c.id === companyDetails.id)
      ) {
        setCompanyDetails(filteredCompanies[0]);
      }
    }
    // eslint-disable-next-line
  }, [nameFilter, locationFilter, company.length]);

  return (
    <div className="w-[90%] m-auto mt-4 h-[88vh] flex flex-col bg-white rounded-lg">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-white px-2 w-full mb-4 ">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-6 py-2 shadow-sm">
            <div className="flex items-center flex-1 gap-2">
              <Building2 className="w-5 text-gray-400 hidden md:block" />
              <input
                type="text"
                placeholder="Search by Company Name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="bg-transparent outline-none text-gray-600 placeholder-gray-400 w-full truncate"
              />
            </div>
            <div className="h-8 border-l border-gray-200 mx-4"></div>
            <div className="flex items-center flex-1 gap-2">
              <LocateIcon className="w-5 text-gray-400 hidden md:block" />
              <input
                type="text"
                placeholder="Search by  Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-transparent outline-none text-gray-600 placeholder-gray-400 w-full truncate"
              />
            </div>
            <button
              type="button"
              className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 transition"
            >
              <Search className="w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="block md:hidden">
          {companyDetails && (companyDetails.id || companyDetails._id) ? (
            <div>
              <button
                onClick={() => setCompanyDetails({})}
                className="text-blue-500 font-medium mb-2"
              >
                ← Back to list
              </button>
              <CompanyDetails companyDetails={companyDetails} />
            </div>
          ) : (
            <CompanyListing
              company_props={filteredCompanies}
              setCompanyDetails={setCompanyDetails}
              activeCompany={companyDetails}
            />
          )}
        </div>

        <div className="hidden md:grid md:grid-cols-12 gap-6 flex-1 md:min-h-0">
          <div className="md:col-span-4 h-full min-h-0 overflow-auto">
            <CompanyListing
              company_props={filteredCompanies}
              setCompanyDetails={setCompanyDetails}
              activeCompany={companyDetails}
            />
          </div>
          <div className="md:col-span-8 h-full min-h-0 overflow-auto">
            <CompanyDetails
              companyDetails={filteredCompanies.length ? companyDetails : {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
