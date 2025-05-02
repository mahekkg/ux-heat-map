// @/lib/data.ts
import type { Candidate, SkillMetric, SkillScore } from "@/lib/types";

// Skill metrics with mapped skill IDs from API
export const skillsAndMetrics: SkillMetric[] = [
  { id: "experience", name: "Experience (Years)", type: "numeric" },
  {
    id: "6dfba44e-7792-410f-85af-62f8fb06f147",
    name: "Application of Typography",
    type: "skill",
  },
  {
    id: "0152520b-829c-42ec-82a6-161d5b0afb4b",
    name: "Applying Color Theory",
    type: "skill",
  },
  {
    id: "fc2be13d-025b-4089-a9c5-99c0f3aa7f84",
    name: "Creation of Brands",
    type: "skill",
  },
];

// Fetch all candidates with detailed data
export async function getCandidates(): Promise<Candidate[]> {
  try {
    const response = await fetch("https://forinterview.onrender.com/people", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Fetch detailed data for each candidate
    const detailedCandidates = await Promise.all(
      data.map(async (item: any) => {
        const candidate = await getCandidateById(item.id);
        return (
          candidate || {
            id: item.id,
            name: item.name || `Candidate ${item.id}`,
            skillsets: [],
            skillScores: [],
            experience: 0,
          }
        );
      })
    );

    return detailedCandidates.filter(
      (candidate): candidate is Candidate => candidate !== null
    );
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

// Fetch a single candidate by ID
export async function getCandidateById(id: string): Promise<Candidate | null> {
  try {
    const response = await fetch(
      `https://forinterview.onrender.com/people/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const candidateData = await response.json();
    const skillsets = (candidateData.data?.data?.skillset || []).map(
      (skillset: any) => ({
        id: skillset.id || "",
        name: skillset.name || "Unknown Skillset",
        skills: (skillset.skills || []).map((skill: any) => ({
          id: skill.id || "",
          name: skill.name || "Unknown Skill",
          consensusScore: skill.pos?.[0]?.consensus_score || 0,
        })),
      })
    );

    // Map skills to scores
    const skillScores = mapSkillsToScores(
      candidateData.data?.data?.skillset || []
    );

    // Calculate experience from workEx
    const workEx = candidateData.data?.data?.user?.workEx || [];
    const experience = calculateExperience(workEx);

    return {
      id: candidateData.id,
      name: candidateData.name || `Candidate ${id}`,
      skillsets,
      skillScores,
      experience,
    } as Candidate;
  } catch (error) {
    console.error(`Error fetching candidate ${id}:`, error);
    return null;
  }
}

// Calculate total experience in years from workEx
function calculateExperience(workEx: any[]): number {
  if (!workEx || workEx.length === 0) return 0;

  let totalMonths = 0;
  workEx.forEach((job) => {
    const startDate = new Date(job.start_date);
    const endDate = job.end_date ? new Date(job.end_date) : new Date();
    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      endDate.getMonth() -
      startDate.getMonth();
    totalMonths += months;
  });

  return Math.round(totalMonths / 12);
}

// Map skills.name to consensus_score
function mapSkillsToScores(skillsets: any[]): SkillScore[] {
  const skillScores: SkillScore[] = [];

  skillsets.forEach((skillset) => {
    skillset.skills.forEach((skill: any) => {
      const score = skill.pos?.[0]?.consensus_score || 0;
      skillScores.push({
        name: skill.name,
        score: score,
      });
    });
  });

  return skillScores;
}

// Get numeric value for a candidate's metric
export const getNumericValue = (
  candidate: Candidate,
  metricId: string
): number => {
  if (metricId === "experience") {
    return candidate.experience || 0;
  }
  return 0;
};
