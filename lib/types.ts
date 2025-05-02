// @/lib/types.ts

export interface SkillMetric {
  id: string;
  name: string;
  type: "numeric" | "skill";
}

export interface SkillScore {
  name: string;
  score: number;
}

export interface Skill {
  id: string;
  name: string;
  consensusScore: number;
}

export interface Skillset {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Candidate {
  id: string;
  name: string;
  skillsets: Skillset[];
  skillScores: SkillScore[];
  experience: number;
}