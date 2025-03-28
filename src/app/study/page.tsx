import PGNViewer from "@/components/PGNViewer";

export default function Blog() {
  return (
    <>
    <div className="sm:flex pt-15">
      <h1 className="text-primary dark:text-secondary p-10 text-5xl">HELLO WORLD!</h1>
      <div className="w-100 sm:w-150 ml-10 sm:ml-50">
        <PGNViewer pgn="1. e4 e5 2. Nf3 Nc6 3. Bb5 (3. Bc4)" />
      </div>
    </div>
    </>
  );
}