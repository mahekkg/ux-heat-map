"use client";

import { useState } from "react";
import type { Candidate } from "@/lib/types";

interface CandidateSidebarProps {
  candidates: Candidate[];
  selectedCandidateId: string | null;
  onSelectCandidate: (id: string | null) => void;
}

export default function CandidateSidebar({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
}: CandidateSidebarProps) {
  const [filter, setFilter] = useState("");

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="w-64 border-r border-gray-200 flex-shrink-0 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-700">Candidates</h2>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search candidates..."
            className="w-full border border-gray-300 rounded p-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <button
            className={`w-full text-left text-sm py-2 px-3 ${
              selectedCandidateId === null
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-700"
            } rounded`}
            onClick={() => onSelectCandidate(null)}
          >
            Show All Candidates
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`p-4 flex items-center hover:bg-gray-50 cursor-pointer ${
                selectedCandidateId === candidate.id ? "bg-blue-50" : ""
              }`}
              onClick={() => onSelectCandidate(candidate.id)}
            >
              <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                {candidate.name.charAt(0)}
              </div>
              <span className="text-sm">{candidate.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
        Displaying {filteredCandidates.length} of {candidates.length} candidates
      </div>
    </div>
  );
}
