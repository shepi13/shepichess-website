import { PGNViewer } from "@/components/PGNViewer/PGNViewer";

export default function About() {
  return (
    <>
      <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-150 flex flex-col gap-3">
        <h3>About Page!</h3>
        <PGNViewer
          pgn="1.e4 e5 (1...c5 {Sicilian} 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 {Najdorf} (5...g6 {Dragon}) (5...Nc6 {Classical})) (1...e6 {French})"
          puzzle
        />
      </div>
    </>
  );
}
