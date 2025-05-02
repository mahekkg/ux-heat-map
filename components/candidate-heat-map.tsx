"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CandidateSidebar from "./candidate-sidebar";
import HeatMapGrid from "./heat-map-grid";
import { getCandidates, getCandidateById } from "@/lib/data";
import type { Candidate } from "@/lib/types";

export default function CandidateHeatMap() {
  const [activeView, setActiveView] = useState("compare");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [displayCandidates, setDisplayCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [candidateLoading, setCandidateLoading] = useState(false);

  // Fetch all candidates (basic info) on mount
  useEffect(() => {
    async function fetchCandidates() {
      const data = await getCandidates();
      setCandidates(data);
      setDisplayCandidates(data); // Initialize with all candidates
      setLoading(false);
    }
    fetchCandidates();
  }, []);

  // Update displayed candidates when selectedCandidateId changes
  useEffect(() => {
    async function fetchSelectedCandidate() {
      if (selectedCandidateId) {
        setCandidateLoading(true);
        const candidate = await getCandidateById(selectedCandidateId);
        if (candidate) {
          setDisplayCandidates([candidate]); // Display only the selected candidate
        }
        setCandidateLoading(false);
      } else if (activeView === "compare") {
        // If no candidate is selected and we're in compare view, show all candidates
        setDisplayCandidates(candidates);
      }
    }

    if (selectedCandidateId) {
      fetchSelectedCandidate();
    } else {
      setDisplayCandidates(candidates);
    }
  }, [selectedCandidateId, candidates, activeView]);

  // Update displayed candidates when activeView changes
  useEffect(() => {
    if (activeView === "compare") {
      setSelectedCandidateId(null);
      setDisplayCandidates(candidates);
    } else if (
      activeView === "individual" &&
      !selectedCandidateId &&
      candidates.length > 0
    ) {
      // Automatically select first candidate in individual view if none selected
      setSelectedCandidateId(candidates[0].id);
    }
  }, [activeView, candidates, selectedCandidateId]);

  const handleSelectCandidate = (id: string | null) => {
    setSelectedCandidateId(id);
    if (id === null && activeView === "compare") {
      setDisplayCandidates(candidates);
    }
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view === "compare") {
      setSelectedCandidateId(null);
      setDisplayCandidates(candidates);
    } else if (
      view === "individual" &&
      !selectedCandidateId &&
      candidates.length > 0
    ) {
      setSelectedCandidateId(candidates[0].id);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading candidates...</div>;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-4 flex items-center">
          <a
            href="#"
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm">Back to My Jobs</span>
          </a>
        </div>

        <div className="px-4 pb-4 flex justify-between items-center">
          <h1 className="text-2xl text-gray-500 font-light">
            Posk_UXdesigner_sr001
          </h1>
          <div className="text-gray-500">{candidates.length} Candidates</div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <CandidateSidebar
          candidates={candidates}
          selectedCandidateId={selectedCandidateId}
          onSelectCandidate={handleSelectCandidate}
        />

        {/* Main content */}
        <div className="flex-1 border-l border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200 flex justify-between">
            <Tabs
              value={activeView}
              className="w-auto"
              onValueChange={handleViewChange}
            >
              <TabsList className="bg-transparent h-auto p-0">
                <TabsTrigger
                  value="compare"
                  className={`px-4 py-3 rounded-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white`}
                >
                  Compare View
                </TabsTrigger>
                <TabsTrigger
                  value="individual"
                  className="px-4 py-3 rounded-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  Individual view
                </TabsTrigger>
                <TabsTrigger
                  value="shortlisted"
                  className="px-4 py-3 rounded-none data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  Shortlisted candidates
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex">
              <button className="border border-gray-200 p-2">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="border border-gray-200 border-l-0 p-2">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="p-4">
            <button className="flex items-center border border-gray-300 rounded px-4 py-2 text-sm">
              <span className="mr-2">Filter</span>
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Heat Map */}
          {candidateLoading ? (
            <div className="p-4 text-gray-500">Loading candidate data...</div>
          ) : displayCandidates.length > 0 ? (
            <HeatMapGrid candidates={displayCandidates} />
          ) : (
            <div className="p-4 text-gray-500">
              No candidates available to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
