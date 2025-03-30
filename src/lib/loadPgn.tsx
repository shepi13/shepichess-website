import { Chess } from "chess.js";

export default function loadPgn(pgn: string, start: string) {
    const game = new Chess(start);

    const tokens = [...pgn.matchAll(/(?:[0-9]*\.+)* *((?:[A-Za-z]+[0-9]+)|0-0-0|0-0|O-O-O|O-O)([!?]+)* *(?:\{(.*?)\})*/g)]
    for (const token of tokens) {
        const move = token[1];
        const comment = token[3];

        // Chess.js doesn't seem to have move annotation (!, !!, !?, etc) support even, so might need to implement this myself
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const annotation = token[2];

        game.move(move.replace(/0/g, "O"));
        if(comment) {
            game.setComment(comment.trim());
        }
    }
    return game;
}
