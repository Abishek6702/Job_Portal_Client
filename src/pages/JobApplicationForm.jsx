import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";

const JobApplicationForm = () => {
  const { state } = useLocation();
  
  const job = state?.job;
  console.log("job",job)
  const companyId = job.companyId._id;
  const jobId = job?._id;
  const navigate = useNavigate();

  const steps = ["Resume", "Additional Questions", "Preview"];
  const [step, setStep] = useState(0);

  const [profile, setProfile] = useState({});
  const [jobDetails, setJobDetails] = useState({});
  const [formData, setFormData] = useState({
    resume: null,
    additionalAnswers: {},
    experience: "",
    location: "",
  });
  const [showUpload, setShowUpload] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null);

  // Decode JWT and fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      return;
    }
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFormData((prev) => ({
          ...prev,
          resume: data.onboarding?.resume || null,
        }));
        const dob = data.onboarding?.dob;
        if (dob) {
          const birthDate = new Date(dob);
          const today = new Date();
          let userAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            userAge--;
          }
          setAge(userAge);
        }
      });
  }, []);

  // Handle resume file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, resume: file }));
    setShowUpload(false);
    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = (event) => setPreviewUrl(event.target.result);
      fileReader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle additional question answers
  const handleAdditionalAnswer = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalAnswers: { ...prev.additionalAnswers, [key]: value },
    }));
  };

  // Handle experience change
  const handleExperienceChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      experience: e.target.value,
    }));
  };

  // Handle location change
  const handleLocationChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      location: e.target.value,
    }));
  };

  // Validation
  const validateStep = () => {
    let newErrors = {};
    if (step === 0 && !formData.resume) newErrors.resume = "Resume is required";
    if (step === 1 && job?.additional3Info) {
      job.additionalInfo.forEach((q, idx) => {
        if (!formData.additionalAnswers[idx]) {
          newErrors[idx] = "This field is required";
        }
      });
      if (!formData.experience) newErrors.experience = "Experience is required";
      if (!formData.location) newErrors.location = "Location is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Submit handler
const handleSubmit = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to log in first!");
    navigate("/login");
    return;
  }

  // Prepare questions and answers
  const questionsAndAnswers = job?.additionalInfo?.map((q, idx) => ({
    question: q,
    answer: formData.additionalAnswers[idx] || "Not specified",
  })) || [];

  // Prepare FormData
  const data = new FormData();
  data.append("jobId", job?._id);
  data.append("companyId", job?.companyId?._id);
  data.append("name", 
    profile.onboarding?.firstName
      ? `${profile.onboarding.firstName} ${profile.onboarding.lastName || ""}`
      : profile.name
  );
  data.append("email", profile.email);
  data.append("phone", profile.phone);
  data.append("experience", formData.experience);
  data.append("location", formData.location);
  data.append("questionsAndAnswers", JSON.stringify(questionsAndAnswers));

  // Handle resume - new file or existing path
  if (formData.resume) {
    if (typeof formData.resume === "string") {
      data.append("resumePath", formData.resume); // Existing resume path
    } else {
      data.append("resume", formData.resume); // New file upload
    }
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type - browser sets it automatically
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Submission failed");
    }

    alert("Application submitted!");
    navigate("/submitsucess");
  } catch (error) {
    alert("Error: " + error.message);
    console.error("Submission error:", error);
  }
};



  // Helper: get resume file name
  const getResumeName = () => {
    if (formData.resume) {
      if (typeof formData.resume === "string") {
        return formData.resume.split("/").pop();
      }
      return formData.resume.name;
    }
    return profile.onboarding?.resume?.split("/").pop() || "Not uploaded";
  };

  // Helper: get resume URL for preview
  const getResumeUrl = () => {
    if (previewUrl) return previewUrl;
    if (formData.resume && typeof formData.resume === "string") {
      return `${import.meta.env.VITE_API_BASE_URL}/${formData.resume.replace(/\\/g, "/")}`;
    }
    if (profile.onboarding?.resume) {
      return `${import.meta.env.VITE_API_BASE_URL}/${profile.onboarding.resume.replace(
        /\\/g,
        "/"
      )}`;
    }
    return null;
  };

  // Note: Fix any typos like use3Navigate, setPreviewUrl =3, localStorage.getItem3, job.additional3Info, etc.
  // These should be useNavigate, setPreviewUrl, localStorage.getItem, job.additionalInfo, etc.

  return (
    <div className="flex justify-center items-center px-4 mt-2">
      <div className="w-full max-w-[60%]">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-2">
            {job?.companyId?.company_logo && (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${job.companyId.company_logo}`}
                className="w-10 h-10 border rounded-full border-gray-400"
                alt="Company Logo"
              />
            )}
            <h1 className="text3-gray-600 font-medium text-xl">
              {job?.companyId?.company_name || jobDetails.companyName}
            </h1>
          </div>
          <h1 className="font-medium text-2xl mt-[1%] md:text-3xl">
            {job?.position || jobDetails.position}
          </h1>
          <h1 className="text-gray-400 mt-[1%] font-medium text-lg">
            {job?.location || jobDetails.location}
          </h1>
        </div>
        <hr className="border-t border-gray-400 mt-4 mb-2" />

        {/* Progress Bar */}
        <div className="w-[75%] bg-gray-200 h-2 rounded-full m-auto mb-6 mt-8">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-2xl font-bold mb-6 text-center">{steps[step]}</p>

        {/* Step 0: Resume Preview and Change */}
        {step === 0 && (
          <div className="flex flex-col space-y-4 w-[80%] m-auto">
            <label className="text-lg font-semibold">Resume</label>
            {getResumeUrl() && (
              <iframe
                src={getResumeUrl()}
                title="Resume Preview"
                className="w-full h-[80vh] border rounded"
              />
            )}
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg3-gray-300 mt-4"
              onClick={() => setShowUpload(true)}
            >
              Change Resume
            </button>
            {showUpload && (
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="block mt-2"
                onChange={handleFileChange}
              />
            )}
            {errors.resume && (
              <p className="text-red-500 text-sm">{errors.resume}</p>
            )}
          </div>
        )}

        {/* Step 1: Additional Questions */}
        {step === 1 && (
          <div className="flex flex-wrap gap-4 w-[80%] m-auto">
            {job?.additionalInfo?.map((question, idx) => (
              <div key={idx} className="w-[48%]">
                <label className="block text-lg font-semibold mb-1">
                  {question}
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors[idx] ? "border-red-500" : "border-gray-300"
                  } rounded-sm p-2 text-sm w-full`}
                  value={formData.additionalAnswers?.[idx] || ""}
                  onChange={(e) => handleAdditionalAnswer(idx, e.target.value)}
                  placeholder="Type your answer..."
                />
                {errors[idx] && (
                  <p className="text-red-500 text-sm">{errors[idx]}</p>
                )}
              </div>
            ))}
            <div className="otherdetails w-full flex gap-4">
              <div className="w-[48%]">
                <label className="block text-lg font-semibold mb-1">
                  Total Year of experience
                </label>
                <input
                  type="number"
                  className={`border ${
                    errors.experience ? "border-red-500" : "border-gray-300"
                  } rounded-lg outline-none p-2 w-full`}
                  value={formData.experience}
                  onChange={handleExperienceChange}
                  placeholder="Year of Experience"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm">{errors.experience}</p>
                )}
              </div>
              <div className="w-[48%]">
                <label className="block text-lg font-semibold mb-1">
                  Current Location
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  } rounded-lg outline-none p-2 w-full`}
                  value={formData.location}
                  onChange={handleLocationChange}
                  placeholder="Enter Your Location"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <div className="flex flex-col space-y-4 w-[80%] m-auto">
            <h2 className="text-xl font-semibold mb-2">Preview Your Details</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p>
                <span className="font-semibold">Name: </span>
                {profile.onboarding?.firstName
                  ? `${profile.onboarding.firstName} ${
                      profile.onboarding.lastName || ""
                    }`
                  : profile.name}
              </p>
              <p>
                <span className="font-semibold">Email: </span>
                {profile.email}
              </p>
              <p>
                <span className="font-semibold">Phone: </span>
                {profile.phone}
              </p>
              {job?.additionalInfo?.map((q, idx) => (
                <p key={idx}>
                  <span className="font-semibold">{q}: </span>
                  {formData.additionalAnswers[idx] || "Not specified"}
                </p>
              ))}
              <p>
                <span className="font-semibold">Total Year of Experience: </span>
                {formData.experience || "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Current Location: </span>
                {formData.location || "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Resume: </span>
                {getResumeName()}
              </p>
              {getResumeUrl() && (
                <iframe
                  src={getResumeUrl()}
                  title="Resume Preview"
                  className="w-full h-[80vh] border rounded mt-4"
                />
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={prevStep}
            disabled={step === 0}
          >
            Previous
          </button>
          {step === steps.length - 1 ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
              Submit
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={nextStep}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationForm;