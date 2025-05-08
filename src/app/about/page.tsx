import { PGNViewer } from "@/components/PGNViewer/PGNViewer";

export default function About() {
  return (
    <>
      <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-150 flex flex-col gap-3">
        <h3>About Page!</h3>
        <PGNViewer
          pgn={`[Event "Briliant moves quiz: Judit's Polgar brilliancy"]
          [Result "*"]
          [Variant "Standard"]
          [ECO "?"]
          [Opening "?"]
          [StudyName "Briliant moves quiz"]
          [ChapterName "Judit's Polgar brilliancy"]
          [FEN "k6r/3p4/P1nq1p2/2b5/4Q1p1/2R3P1/1PP4B/R6K b - - 0 1"]
          [SetUp "1"]
          [UTCDate "2025.04.27"]
          [UTCTime "14:50:26"]
          [Annotator "https://lichess.org/@/Deividukassss"]
          [ChapterURL "https://lichess.org/study/dYxOPpbF/K9WVzSw8"]
          [ChapterMode "gamebook"]

          1... Rxh2+!! { Yes, absolutely gorgeous move. Can you find the continue for black? } 2. Kxh2 $7 Qd2+! { Yes. Absolutely correct. } 3. Kh1 Qh6+! 4. Kg2 $7 Qh3# $19 { Good job! } *
          `}
          flipped
          puzzle="Black to mate in 4!"
        />
      </div>
    </>
  );
}
