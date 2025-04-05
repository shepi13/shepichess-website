import { PlayAgainstComputerParams } from "@/components/chess/PlayComputer";

export default function Page() {
  return (
    <>
      <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-125">
        <PlayAgainstComputerParams />
      </div>
    </>
  );
}