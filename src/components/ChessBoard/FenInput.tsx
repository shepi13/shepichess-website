"use client";

import { useSearchParams } from "next/navigation";

import { validateFen } from "chess.js";
import React, { useEffect, useState } from "react";

import { Optional } from "@/lib/types/types";

export type FenInputProps = {
  fen: string;
  buttonStyles?: string;
  buttonText?: string;
  onClick?: Optional<(arg0: string) => void>;
};

const defaultButtonStyle = "cursor-pointer";
const defaultButtonText = "Submit";

export function FenInput({
  fen,
  buttonStyles = "",
  buttonText = defaultButtonText,
  onClick = null,
}: FenInputProps) {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("fen") ?? "");

  useEffect(() => {
    setValue(fen);
  }, [fen]);

  const updateFenParam = (fen: string) => {
    if (validateFen(fen).ok) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("fen", fen);
      window.history.pushState(null, "", `?${params.toString()}`);
    } else {
      alert("Invalid fen: " + fen);
    }
  };
  onClick = onClick ?? updateFenParam;

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-100 bg-stone-300 border-1 text-xs"
      />
      <button
        onClick={() => onClick(value)}
        className={defaultButtonStyle + buttonStyles}
      >
        {buttonText}
      </button>
    </div>
  );
}
