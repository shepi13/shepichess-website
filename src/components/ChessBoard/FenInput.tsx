"use client";

import { validateFen } from "chess.js";
import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type FenInputProps = {
  fen?: string;
  onSubmit?: (arg0: string) => void;
};

export function FenInput({ fen, onSubmit }: FenInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const handleInput = () => {
    const fen = input.current?.value;
    if (fen && validateFen(fen).ok) {
      onSubmit?.(fen);
    } else {
      toast.error("Invalid Fen!");
    }
  };

  return (
    <div>
      <Label htmlFor="text">
        <h4>Enter Fen:</h4>
      </Label>
      <div className="flex gap-2">
        <Input
          ref={input}
          type="text"
          placeholder={"Fen"}
          defaultValue={fen}
          className="bg-stone-300 border-black dark:border-stone-400"
          aria-label="Input Fen"
        />
        <Button
          type="submit"
          className="cursor-pointer"
          onClick={handleInput}
          aria-label="Submit Fen"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
