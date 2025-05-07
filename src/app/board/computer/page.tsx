import { PlayComputerPage } from "@/components/ChessBoard/PlayComputer";

export default function Page() {
  return (
    <div className="w-135 flex flex-col gap-5 items-center justify-start -mt-15">
      <h1>Play vs Computer</h1>
      <div className="w-full">
        <PlayComputerPage />
      </div>
    </div>
  );
}
