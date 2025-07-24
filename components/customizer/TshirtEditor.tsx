
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { fabric } from "fabric";

import { useEditorStore } from "../../store/store";
import { costEngine } from "@/lib/costEngine";

import CanvasWrapper from "./CanvasWraper";
import Toolbar from "./Toolbar";
import CostSummary from "./CostSummay";
import { Card } from "../ui/card";

const TSHIRT_IMAGES = {
  slim: "https://www.bing.com/ck/a?!&&p=d6ac50b1263b41135e4c71b6c7417fea5872f023281961a32d90c3313891b042JmltdHM9MTc1MzMxNTIwMA&ptn=3&ver=2&hsh=4&fclid=1caf939a-5e6f-608d-19ad-801d5f186141&u=a1L2ltYWdlcy9zZWFyY2g_cT1zbGltJTIwdCUyMHNoaXJ0cyUyMGZvciUyMG1lbiUyMHdoaXRlJTIwcG5nJkZPUk09SVFGUkJBJmlkPTY3NUQ5RDNCNTQyQjI1RUI2M0JFOTAxREVENTA2QTc2OTEzMUVDMzQ&ntb=1",
  oversized: "https://storage.googleapis.com/project-spark-b295f.appspot.com/static/docs/images/oversized_tshirt_final.png",
};


export default function TshirtEditor() {
  const {
    shirtStyle,
    setCanvas,
    setTotalCost,
    history,
    setHistory,
    setHistoryIndex,
  } = useEditorStore();
  const isUpdating = useRef(false);

  useEffect(() => {
    const initCanvas = new fabric.Canvas("canvas", {
      height: 500,
      width: 500,
    });
    setCanvas(initCanvas);

    const updateCostAndHistory = () => {
        if (isUpdating.current) return;

        const objects = initCanvas.getObjects();
        const cost = costEngine.calculate(objects);
        setTotalCost(cost);
        
        // Save state for undo/redo
        const currentState = JSON.stringify(initCanvas.toJSON(['cost', 'type']));
        const currentHistory = useEditorStore.getState().history;
        const currentHistoryIndex = useEditorStore.getState().historyIndex;

        // If we are undoing/redoing, the history will be the same, so we don't need to add it again
        if(currentState === currentHistory[currentHistoryIndex]) return;

        const newHistory = [...currentHistory.slice(0, currentHistoryIndex + 1), currentState];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    initCanvas.on("object:added", updateCostAndHistory);
    initCanvas.on("object:modified", updateCostAndHistory);
    initCanvas.on("object:removed", updateCostAndHistory);

    return () => {
      initCanvas.dispose();
      initCanvas.off("object:added", updateCostAndHistory);
      initCanvas.off("object:modified", updateCostAndHistory);
      initCanvas.off("object:removed", updateCostAndHistory);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCanvas, setTotalCost, setHistory, setHistoryIndex]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] min-h-screen">
      <Toolbar />
      <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-muted/20 relative">
        <Card className="relative w-full max-w-[500px] aspect-square overflow-hidden shadow-lg rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={shirtStyle}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={TSHIRT_IMAGES[shirtStyle]}
                data-ai-hint={`${shirtStyle} t-shirt`}
                alt={`${shirtStyle} t-shirt`}
                fill
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0">
            <CanvasWrapper />
          </div>
        </Card>
        <CostSummary />
      </div>
    </div>
  );
}
