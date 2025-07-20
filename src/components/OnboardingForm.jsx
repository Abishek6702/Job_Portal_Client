import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaCog,
  FaUpload,
  FaEye,
} from "react-icons/fa";

import PersonalInfo from "./steps/PersonalInfo";
import EducationStep from "./steps/EducationStep";
import ExperienceStep from "./steps/ExperienceStep";
import PreferencesStep from "./steps/PreferencesStep";
import UploadsStep from "./steps/UploadsStep";
import PreviewStep from "./steps/PreviewStep";

const steps = [
  "Personal Info",
  "Education",
  "Experience",
  "Preferences",
  "Uploads",
  "Preview",
];

const stepIcons = [
  <FaUser className="text-lg" />,
  <FaGraduationCap className="text-lg" />,
  <FaBriefcase className="text-lg" />,
  <FaCog className="text-lg" />,
  <FaUpload className="text-lg" />,
  <FaEye className="text-lg" />,
];

export default function OnboardingForm() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    education: [
      {
        level: "",
        institution: "",
        university: "",
        branch: "",
        yearFrom: "",
        yearTo: "",
        marks: "",
      },
    ],
    experience: [
      {
        company: "",
        yearFrom: "",
        yearTo: "",
        title: "",
        location: "",
        description: "",
      },
    ],
    preferredRoles: [""],
    salaryExpectation: "",
    profileImage: null,
    skills: [],
    skillsInput: "",
    resume: null,
  });

  const stepDescriptions = [
    "Fill in your personal details",
    "Add your educational background",
    "Enter your work experience",
    "Set your job preferences",
    "Upload your profile picture and resume",
    "Review and submit your information",
  ];

  const [submitting, setSubmitting] = useState(false);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const form = new FormData();
      form.append("userId", userId);
      form.append("firstName", formData.firstName);
      form.append("lastName", formData.lastName);
      form.append("location", formData.location);
      form.append("salaryExpectation", formData.salaryExpectation);
      form.append("education", JSON.stringify(formData.education));
      form.append("experience", JSON.stringify(formData.experience));
      form.append("preferredRoles", JSON.stringify(formData.preferredRoles));
      form.append("skills", JSON.stringify(formData.skills));

      if (formData.profileImage)
        form.append("profileImage", formData.profileImage);
      if (formData.resume) form.append("resume", formData.resume);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/onboarding/onboarding`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Onboarding submitted successfully!");
        navigate("/feeds");
      } else {
        alert("Submission failed: " + data.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
    setSubmitting(false);
  };

  // Step rendering
  const stepProps = { formData, setFormData };
  let StepComponent;
  switch (currentStep) {
    case 0:
      StepComponent = <PersonalInfo {...stepProps} />;
      break;
    case 1:
      StepComponent = <EducationStep {...stepProps} />;
      break;
    case 2:
      StepComponent = <ExperienceStep {...stepProps} />;
      break;
    case 3:
      StepComponent = <PreferencesStep {...stepProps} />;
      break;
    case 4:
      StepComponent = <UploadsStep {...stepProps} />;
      break;
    case 5:
      StepComponent = <PreviewStep formData={formData} />;
      break;
    default:
      StepComponent = null;
  }

  return (
    <div className="flex min-h-screen  ">
      <div className="w-[30%] bg-gray-50 p-8 border-r border-gray-200 min-h-screen flex flex-col justify-start sticky left-0 top-0 h-screen overflow-y-auto">
        <div className="w-full max-w-xs">
          <ol className="relative   ml-5">
            {steps.map((step, idx) => (
              <li
                key={step}
                className="mb-14 last:mb-0 flex items-start relative  "
              >
                {idx !== steps.length - 1 && (
                  <span
                    className={`absolute left-[-1.3rem] top-10 w-0.5  h-16  ${
                      idx < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  ></span>
                )}
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-white border-2  ${
                    idx <= currentStep
                      ? "border-blue-600 text-blue-600"
                      : "border-gray-200 text-gray-400"
                  } absolute left-[-2.5rem] top-0`}
                >
                  {stepIcons[idx]}
                </span>
                <div className="ml-8">
                  <div
                    className={`font-medium ${
                      idx <= currentStep ? "text-black" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {stepDescriptions[idx]}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="w-[70%] flex items-center justify-center p-8  ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === steps.length - 1) {
              handleSubmit();
            } else {
              nextStep();
            }
          }}
          encType="multipart/form-data"
          className="w-full max-w-3xl    "
        >
          <div className="text-md ">{StepComponent}</div>
          
          <div className="flex justify-between mt-6 ">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
