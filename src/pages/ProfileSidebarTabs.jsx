
import React from "react";
import { User } from "lucide-react";

const mainTabs = [
  { label: "Account", value: "account", icon: <User className="w-5 h-5 mr-2" /> },
  { label: "Saved Jobs", value: "saved" },
  { label: "Applied Jobs", value: "applied" },
  { label: "My Posts", value: "myPosts" },
  { label: "Settings", value: "settings" }
];

const ProfileSidebarTabs = ({
  activeMain,
  setActiveMain,
  activeSub,
  setActiveSub,
  isOwnProfile,
  tabs = [],           // Array of sub-tab names (About, Education, etc)
}) => {
  // Responsive design using Tailwind's breakpoints
  return (
    <>
      {/* Mobile/tablet: horizontal main tabbar */}
      <div className="block md:hidden w-full border-b bg-white">
        <div className="flex flex-row gap-0 overflow-x-auto w-full">
          {mainTabs.map(tab => (
            <button
              key={tab.value}
              className={`flex items-center px-4 py-2 font-medium border-b-2 transition whitespace-nowrap
                ${activeMain === tab.value
                  ? "text-blue-700 border-blue-600 bg-blue-100"
                  : "text-gray-700 border-transparent"
                }
              `}
              onClick={() => {
                setActiveMain(tab.value);
                // Set default subtab when switching back to "Account"
                if(tab.value === "account" && tabs.length) setActiveSub(tabs[0]);
              }}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
        {/* SECOND ROW: account subtabs only if Account is active */}
        {activeMain === "account" && (
          <div className="w-full flex flex-row gap-1 overflow-x-auto px-2 pb-1 bg-white border-b">
            {tabs.map(subTab => (
              <button
                key={subTab}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer mb-1 whitespace-nowrap
                  ${activeSub === subTab
                    ? "bg-green-100 text-green-800"
                    : "hover:bg-gray-100 text-gray-700"
                  }`}
                onClick={() => setActiveSub(subTab)}
              >
                {subTab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: vertical sidebar with main and subtabs */}
      <div className="hidden md:block w-full h-fit sm:max-w-[240px] bg-white rounded-2xl shadow p-0 overflow-hidden">
        {/* Main (vertical) */}
        {mainTabs.map(tab => (
          <div key={tab.value}>
            <button
              className={`flex items-center w-full px-6 py-3 text-left font-medium rounded-none border-l-4 transition
                ${activeMain === tab.value
                  ? "text-blue-700 border-blue-500 bg-blue-50"
                  : "text-gray-700 border-transparent hover:bg-gray-50"
                }`}
              onClick={() => {
                setActiveMain(tab.value);
                if(tab.value === "account" && tabs.length) setActiveSub(tabs[0]);
              }}
            >
              {tab.icon}{tab.label}
            </button>
            {/* Subtabs for account (vertical) */}
            {tab.value === "account" && activeMain === "account" && (
              <ul className="pl-10 pr-2 py-2">
                {tabs.map(subTab => (
                  <li
                    key={subTab}
                    className={`cursor-pointer py-2 text-sm font-semibold 
                      ${activeSub === subTab
                        ? "text-green-800 bg-green-100 rounded pr-2 pl-3"
                        : "text-gray-700 hover:bg-gray-50 rounded pr-2 pl-3"
                      }`}
                    onClick={() => setActiveSub(subTab)}
                  >
                    {subTab}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileSidebarTabs;