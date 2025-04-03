import {PlayAgainstComputerParams} from "@/components/chess/PlayAgainstComputer";

export default function About() {
  return (
    <>
      <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-125">
        <PlayAgainstComputerParams />
      </div>
    </>
  );
}