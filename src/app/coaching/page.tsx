import { ChessBoardIcon } from "@/components/ChessBoardIcon";

export default function Coaching() {
  return (
    <>
      <div className="p-10">
        <h1 className="text-5xl">Chess Coaching</h1>
        <h2 className="text-3xl">NM Duncan Shepherd</h2>
        <ChessBoardIcon
          lightColor="white"
          darkColor="slate500"
          numSquares={8}
          className="w-25 overflow-hidden my-1"
          strokeColor="black"
        />
        <ChessBoardIcon
          lightColor="maroon"
          darkColor="black"
          numSquares={6}
          className="border-1 w-25 rounded-2xs overflow-hidden my-1"
        />
        <ChessBoardIcon
          lightColor="slate200"
          darkColor="black"
          numSquares={4}
          className="border-1 w-25 rounded-xs overflow-hidden my-1"
        />
        <ChessBoardIcon
          lightColor="gold"
          darkColor="slate800"
          numSquares={3}
          className="border-1 w-25 rounded-sm overflow-hidden my-1"
        />
        <ChessBoardIcon
          lightColor="white"
          darkColor="maroon"
          numSquares={2}
          className="border-1 w-25 rounded-md overflow-hidden my-1"
        />
      </div>
    </>
  );
}
