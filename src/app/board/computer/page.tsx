import { PlayAgainstComputerParams } from "@/components/ChessBoard/PlayComputer";

export default function Page() {
  return (
    <div className="w-130 flex flex-col gap-10 items-center justify-start -mt-15">
      <h1>Play vs Computer</h1>
      <div className="w-full">
        <PlayAgainstComputerParams />
      </div>
    </div>
  );
}
