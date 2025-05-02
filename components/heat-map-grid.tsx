// @/components/heat-map-grid.tsx
import type { Candidate, SkillScore } from "@/lib/types";
import { getNumericValue, skillsAndMetrics } from "@/lib/data";

// Get color class based on consensus score (1-5)
const getSkillColorClass = (score: number) => {
  if (score === undefined || score === null || score === 0)
    return "bg-gray-100";

  switch (score) {
    case 5:
      return "bg-green-600"; // Excellent
    case 4:
      return "bg-green-500"; // Very good
    case 3:
      return "bg-green-400"; // Good
    case 2:
      return "bg-green-300"; // Fair
    case 1:
      return "bg-green-200"; // Poor
    default:
      return "bg-gray-100"; // No score
  }
};

interface HeatMapGridProps {
  candidates: Candidate[];
}

export default function HeatMapGrid({ candidates }: HeatMapGridProps) {
  // Get all unique skills across all candidates
  const allSkills: SkillScore[] = [];
  const skillSet = new Set<string>();
  candidates.forEach((candidate) => {
    candidate.skillScores.forEach((skill) => {
      if (!skillSet.has(skill.name)) {
        skillSet.add(skill.name);
        allSkills.push({ name: skill.name, score: 0 }); // Placeholder score
      }
    });
  });

  // Define metrics to display: numeric metrics + all skills
  const metrics = [
    { id: "experience", name: "Experience (Years)", type: "numeric" as const },
    { id: "canJoinIn", name: "Can join in", type: "numeric" as const },
    {
      id: "minSalary",
      name: "Minimum salary expected",
      type: "numeric" as const,
    },
    ...skillsAndMetrics.filter((metric) => metric.type === "skill"), // Add predefined skills
    ...allSkills
      .filter(
        (skill) =>
          !skillsAndMetrics.some(
            (m) => m.type === "skill" && m.name === skill.name
          )
      )
      .map((skill) => ({
        id: skill.name, // Use name as ID for simplicity
        name: skill.name,
        type: "skill" as const,
      })),
  ];

  // Function to get a candidate's skill consensus score by skill name
  const getSkillScore = (candidate: Candidate, skillName: string): number => {
    const skill = candidate.skillScores.find((s) => s.name === skillName);
    return skill ? skill.score : 0;
  };

  // Calculate average skill score for rating
  const getCandidateRating = (candidate: Candidate): string => {
    const skillScores = candidate.skillScores
      .map((skill) => skill.score)
      .filter((score) => score > 0);
    const average =
      skillScores.length > 0
        ? (
            skillScores.reduce((sum, score) => sum + score, 0) /
            skillScores.length
          ).toFixed(1)
        : "N/A";
    return average;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="w-64 px-4 py-3 text-left border-b border-gray-200"></th>
            {candidates.map((candidate) => (
              <th
                key={candidate.id}
                className="px-2 py-3 text-center border-b border-gray-200"
              >
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center mb-1 text-white">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getCandidateRating(candidate)}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
              {candidates.map((candidate) => {
                if (item.type === "numeric") {
                  const value = getNumericValue(candidate, item.id);
                  return (
                    <td
                      key={`${candidate.id}-${item.id}`}
                      className="text-center text-sm py-2"
                    >
                      {value || "N/A"}
                    </td>
                  );
                } else {
                  const skillScore = getSkillScore(candidate, item.name);
                  return (
                    <td key={`${candidate.id}-${item.id}`} className="p-1">
                      <div
                        className={`h-8 w-full ${getSkillColorClass(
                          skillScore
                        )}`}
                        title={`${item.name}: ${skillScore}/5`}
                      ></div>
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
