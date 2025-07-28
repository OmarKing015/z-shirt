"use client";

import { useAppContext } from "@/context/context";
import { useEditorStore } from "../../store/store";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect } from "react";

export default function CostSummary() {
  const { totalCost } = useEditorStore();
  const {setExtraCost} = useAppContext();
  useEffect(() => {
    setExtraCost(totalCost-650);
  }, [totalCost])

  return (
    <Card className="fixed bottom-4 right-4 w-64 shadow-2xl backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="text-lg">Total Cost</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-black">
          {totalCost.toFixed(2)} EGP
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Real-time price calculation.
        </p>
      </CardContent>
    </Card>
  );
}
