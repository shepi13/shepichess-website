import PGNViewer from "@/components/chess/PGNViewer";

export default function Blog() {
    return (
        <>
            <div className="lg:flex pt-15">
                <h1 className="text-primary p-10 text-5xl">HELLO WORLD!</h1>
                <div className="w-100 lg:w-175 ml-10 lg:ml-50">
                    <PGNViewer
                        start="rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
                        pgn="2...d6 {Philidor} (2...Nc6 (2...Nf6) 3. Bb5 {Spanish (Ruy) Opening} Nf6 {Berlin} 4. d3!? [f8c5red f8e7blue] Bc5! (4...Be7?! (4...g6)) 5. c3 {Tabia} 0-0 6. 0-0!$15) 3. d4 (3. Bc4) Bg4?"
                    />
                </div>
            </div>
        </>
    );
}
