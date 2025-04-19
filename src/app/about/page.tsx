import PGNViewer from "@/components/chess/PGNViewer";

export default function About() {
  return (
    <>
      <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-125 flex flex-col gap-3">
        <h3>About Page!</h3>
        <PGNViewer pgn="1.e4 c5" puzzle />
      </div>
    </>
  );
}
