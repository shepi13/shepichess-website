import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

import { ActiveEngineContext } from "@/components/EngineProvider";

import { convertVariationToSan } from "../utils/convertSan";
import { StockfishResult, useEngine } from "./useEngineWorker";

export function useEngineAnalysis(
  fen: string,
  maxDepth: number,
  pvLength: number,
): [StockfishResult, boolean, (arg0: boolean) => void] {
  // Enable only one engine at a time
  const analysisId = useId();
  const activeEngine = useContext(ActiveEngineContext);
  if (!activeEngine) {
    throw new Error("Context not defined!");
  }
  const shouldEnable = analysisId == activeEngine.engineId;
  const setEnabled = (enabled: boolean) => {
    const newId = enabled ? analysisId : "";
    activeEngine.setEngineId(newId);
  };

  // Stockfish move state
  const defaultStockFishData = useMemo(
    () => ({
      bestMove: "",
      ponder: "",
      evaluation: 0,
      possibleMate: "",
      pv: "",
      depth: 0,
    }),
    [],
  );
  const [stockfishData, setStockfishData] = useState(defaultStockFishData);
  const resetStockfishData = useCallback(
    () => setStockfishData(defaultStockFishData),
    [defaultStockFishData],
  );

  // Engine worker
  const engineCallback = useCallback(
    (stockfishData: StockfishResult) => {
      if (stockfishData.pv && stockfishData.pv.split(" ").length >= pvLength) {
        if (stockfishData.depth >= 8) {
          stockfishData.pv = convertVariationToSan(
            fen,
            stockfishData.pv,
            pvLength,
          );
          setStockfishData(stockfishData);
        } else {
          resetStockfishData();
        }
      }
    },
    [fen, pvLength, resetStockfishData],
  );
  const engine = useEngine(engineCallback, shouldEnable);

  // Find best move effect
  const evaluatePosition = engine.evaluatePosition;
  const findBestMove = useCallback(() => {
    evaluatePosition(fen, maxDepth);
  }, [fen, maxDepth, evaluatePosition]);

  useEffect(() => {
    if (shouldEnable) {
      findBestMove();
    } else {
      resetStockfishData();
    }
  }, [findBestMove, shouldEnable, resetStockfishData]);

  // Returns data, enabled flag, and enable setter function
  return [stockfishData, shouldEnable, setEnabled];
}
