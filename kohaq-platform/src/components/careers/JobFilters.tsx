"use client";

import { useState } from "react";

export function JobFilters({
  onDomainChange,
  onTypeChange,
  onLocationChange,
}: {
  onDomainChange: (domain: string) => void;
  onTypeChange: (type: string) => void;
  onLocationChange: (location: string) => void;
}) {
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const domains = ["AI/ML", "Web Dev", "Mobile Dev", "Data Science", "DevOps", "QA"];
  const types = ["full-time", "part-time", "contract", "internship", "remote"];
  const locations = ["Lahore", "Karachi", "Islamabad", "Remote"];

  return (
    <aside className="space-y-4 rounded-xl border border-border bg-surface p-5">
      <h3 className="font-heading text-lg text-primary dark:text-white">Filters</h3>

      {/* Domain Filter */}
      <div>
        <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Domain</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["", ...domains].map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => {
                setSelectedDomain(domain);
                onDomainChange(domain);
              }}
              className={`rounded-full px-3 py-1 text-xs transition ${
                selectedDomain === domain
                  ? "bg-accent text-[#111]"
                  : "border border-border text-text-muted hover:border-accent"
              }`}
            >
              {domain || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Job Type</p>
        <div className="mt-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="type"
              value=""
              checked={selectedType === ""}
              onChange={(e) => {
                setSelectedType(e.target.value);
                onTypeChange(e.target.value);
              }}
              className="h-4 w-4"
            />
            Any
          </label>
          {types.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="type"
                value={type}
                checked={selectedType === type}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  onTypeChange(e.target.value);
                }}
                className="h-4 w-4"
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <p className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Location</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["", ...locations].map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => {
                setSelectedLocation(location);
                onLocationChange(location);
              }}
              className={`rounded-full px-3 py-1 text-xs transition ${
                selectedLocation === location
                  ? "bg-accent text-[#111]"
                  : "border border-border text-text-muted hover:border-accent"
              }`}
            >
              {location || "All"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

