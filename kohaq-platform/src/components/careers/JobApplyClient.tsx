"use client";

import { useState } from "react";
import { ApplicationModal } from "@/components/careers/ApplicationModal";

export function JobApplyClient({ jobId }: { jobId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-accent px-6 py-3 font-label text-sm uppercase tracking-[0.15em] text-[#111]"
        >
          Apply Now
        </button>
      </div>
      <ApplicationModal
        jobId={jobId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
