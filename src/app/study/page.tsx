import PGNViewer from "@/components/PGNViewer";

export default function Blog() {
  return (
    <>
    <div className="lg:flex pt-15">
      <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-100 lg:w-175 ml-10 lg:ml-50">
        <PGNViewer start="rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2" pgn="2... Nc6 3. Bb5 {Spanish Opening} Nf6 {Berlin} 4. d3 Bc5 5. c3 {Tabia} 0-0 6. 0-0" />
      </div>
    </div>
    </>
  );
}