import { PGNViewer } from "@/components/PGNViewer/PGNViewer";

export default function About() {
  return (
    <>
      <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-150 flex flex-col gap-3">
        <h3>About Page!</h3>
        <PGNViewer
          pgn={`
                { So black is threatening unstoppable mate in one move. However white has a strong fight back ! }
                1. Ng6+!! Kg8 2. Ne7+! Kh8 3. Rxh7+!! Kxh7 4. Rh1# $18 *`}
          start={"r4r1k/5ppp/8/8/5N2/1Bb5/2P5/1KR4R w - - 0 1"}
          puzzle
        />
      </div>
    </>
  );
}
