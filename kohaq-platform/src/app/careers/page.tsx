"use client";

import { useState, useEffect } from "react";
import { JobCard } from "@/components/careers/JobCard";
import { JobFilters } from "@/components/careers/JobFilters";

interface JobWithCompany {
  _id: string;
  title: string;
  company: { name: string; logo?: string };
  domain?: string;
  type?: string;
  location?: string;
  salary?: { min?: number; max?: number; currency?: string };
  applicationDeadline?: string;
  applicationCount?: number;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Fetch all jobs on mount
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs?limit=100");
        const data = (await response.json()) as {
          success: boolean;
          data?: { items: JobWithCompany[] };
        };
        if (data.success && data.data?.items) {
          setJobs(data.data.items);
          setFilteredJobs(data.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = jobs;

    if (selectedDomain) {
      filtered = filtered.filter((job) => job.domain === selectedDomain);
    }
    if (selectedType) {
      filtered = filtered.filter((job) => job.type === selectedType);
    }
    if (selectedLocation) {
      filtered = filtered.filter((job) => job.location === selectedLocation);
    }

    setFilteredJobs(filtered);
  }, [jobs, selectedDomain, selectedType, selectedLocation]);

  return (
    <main className="min-h-screen space-y-12 py-12">
      {/* Hero */}
      <section className="mx-auto max-w-6xl space-y-4 px-6">
        <h1 className="font-heading text-4xl font-bold text-primary dark:text-white">
          Join the KOHAQ Team
        </h1>
        <p className="max-w-2xl text-lg text-text-muted">
          Discover exciting career opportunities and grow with us. We&apos;re looking for
          talented individuals to help transform education in South Asia.
        </p>
      </section>

      {/* Filters & Jobs */}
      <section className="mx-auto max-w-6xl space-y-6 px-6">
        <div className="grid gap-6 lg:grid-cols-4">
          <div>
            <JobFilters
              onDomainChange={setSelectedDomain}
              onTypeChange={setSelectedType}
              onLocationChange={setSelectedLocation}
            />
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-4 lg:col-span-3">
            {loading ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-text-muted">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <p className="text-text-muted">No jobs found matching your filters</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  title={job.title}
                  company={job.company}
                  domain={job.domain}
                  type={job.type}
                  location={job.location}
                  salary={job.salary}
                  applicationDeadline={job.applicationDeadline}
                  applicationCount={job.applicationCount}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

