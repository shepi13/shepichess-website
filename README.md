![Logo](https://github.com/shepi13/shepichess-website/blob/main/public/logo.svg)

![Build Status](https://github.com/shepi13/shepichess-website/actions/workflows/testDiff.yml/badge.svg?event=push)

---

# Chess Coaching Website using NextJS.

Still in development.


### Current features include: 
- light/dark mode
- full pgn viewer
- engine analysis,
- play against a computer
- mdx support for quick blog posts.


## PGN Viewer

A react component to embed chess analysis using PGN, including support for variations, comments, and arrows. Uses react-chessboard for the
actual display board.

It also allows the user to toggle stockfish analysis, or to browse the variation tree either with arrow keys, buttons, or
by clicking on the text of a move.

At some point I might rework this into a full open source library, as there aren't many javascript implementations of PGN/Chess
parsing that support proper variations.
