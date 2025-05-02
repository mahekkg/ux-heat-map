import CandidateHeatMap from "@/components/candidate-heat-map";
import { getCandidates } from "@/lib/data";

export default async function Home() {
  const candidates = await getCandidates();

  return (
    <main className="min-h-screen bg-white">
      <CandidateHeatMap candidates={candidates} />
    </main>
  );
}
