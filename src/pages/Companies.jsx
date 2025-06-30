import React, { useEffect, useState, useTransition, useMemo } from "react";
import Navbar from "../components/Navbar";
import CompanyListing from "../components/CompanyListing";
import CompanyDetails from "../components/CompanyDetails";
import JobApplicationForm from "./JobApplicationForm";
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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/companies`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        const data = await response.json();
        setCompany(data);
        if (data.length > 0) {
          setCompanyDetails(data[0]);
        }
      } catch (error) {
        console.error("Error fetching companies:", error.message);
      }
    };

    fetchCompanies();
  }, []);
  console.log("fetched company:", company);

  const filteredCompanies = company.filter((c) => {
    const matchesName = c.company_name
      ?.toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchesLocation = c.location
      ?.toLowerCase()
      .includes(locationFilter.toLowerCase());

    return matchesName && matchesLocation;
  });

  const isCompanySelected = Object.keys(companyDetails).length > 0;

  return (
    <>
      {/* <Navbar /> */}

      <div className="w-[90%] m-auto mt-4 ">
        <div className=" flex w-[60%] m-auto items-center border border-gray-300   rounded-full px-4 py-2 gap-4 mb-4 ">
          <Building2 className="text-gray-400"/>
          <input
            type="text"
            placeholder="Company Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="flex-1 outline-none "
          />
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center flex-1">
            <MapPin className="text-gray-400"/>

            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full outline-none ml-4"
            />
          </div>
          <div className="ml-auto">
            <button className="rounded-full bg-green-100 p-2">
              <Search className="text-gray-400"/>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {!fullScreen && (
            <CompanyListing
              company_props={filteredCompanies}
              setCompanyDetails={setCompanyDetails}
              activeCompany={companyDetails}
            />
          )}
          <CompanyDetails companyDetails={companyDetails} />
        </div>
      </div>
    </>
  );
};

export default Companies;
