import { EngineAnalysis } from "@/components/chess/EngineAnalysis";

export default function Analysis() {
  return (
    <>
    <div className="lg:flex pt-15">
      <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-100 lg:w-150 ml-10 lg:ml-50">
        <EngineAnalysis start="rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2" />
      </div>
    </div>
    </>
  );
}