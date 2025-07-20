import React, { useEffect, useState } from "react";
import CompanyListing from "../components/CompanyListing";
import CompanyDetails from "../components/CompanyDetails";
import { Building2, MapPin, Search } from "lucide-react";

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
      <div className="md:sticky top-0 z-10 md:flex w-[60%] m-auto items-center md:border border-gray-300 bg-white rounded-full px-4 py-2 gap-4 mb-4">
        <Building2 className="text-gray-400 hidden md:block" />
        <input
          type="text"
          placeholder="Company Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="flex-1 outline-none bg-transparent md:border-none border border-gray-300 rounded-lg md:p-0 md:w-0 p-1 w-[200px]  "
        />
        <div className="w-px h-6 bg-gray-300 hidden md:block" />
        <div className="flex items-center flex-1  w-[400px] md:max-w-none ">
          <MapPin className="text-gray-400 hidden md:block" />
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="md:w-full outline-none md:ml-4 mt-4 md:mt-0 bg-transparent md:border-none border border-gray-300 rounded-lg md:p-0 w-[200px] p-1"
          />
        </div>
        <div className="ml-auto hidden md:block">
          <button className="rounded-full bg-green-100 p-2">
            <Search className="text-gray-400" />
          </button>
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
