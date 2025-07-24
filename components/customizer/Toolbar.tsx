"use client";

import { useRef, useState } from "react";
import { fabric } from "fabric"; // Changed to default import
import {
  Type,
  ImagePlus,
  Undo,
  Redo,
  Trash2,
  Palette,
  Ruler,
  ShoppingBasket,
} from "lucide-react";

import { useEditorStore } from "../../store/store";
import useBasketStore from "../../store/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider as TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "./use-toast";
import { backendClient } from "@/sanity/lib/backendClient";

export default function Toolbar() {
  const { canvas, shirtStyle, toggleShirtStyle, undo, redo, canUndo, canRedo } =
    useEditorStore();
  const { addItem } = useBasketStore();
  const [text, setText] = useState("Hello");
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addText = () => {
    if (!canvas) return;
    const textObject = new fabric.IText(text || "Type here", {
      left: 150,
      top: 200,
      fill: "#000000",
      fontFamily: "Inter",
      // @ts-ignore
      cost: text.length * 0.1,
      type: "text",
    });
    canvas.add(textObject);
    canvas.setActiveObject(textObject);
    canvas.renderAll();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    fabric.Image.fromURL(URL.createObjectURL(file), (img: any) => {
      img.scaleToWidth(150);
      img.set({
        left: 175,
        top: 175,
        // @ts-ignore
        cost: 5, // Fixed cost for logos
        type: "logo",
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  const deleteActiveObject = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const orderNow = async () => {
    if (!canvas) return;
    const image = canvas.toDataURL({ format: "png" });
    const objects = canvas.toJSON(["cost", "type"]);
    const totalPrice = useEditorStore.getState().totalCost;

    try {
      const newProduct = await backendClient.create({
        _type: "order",
        design: JSON.stringify(objects),
        totalPrice,
        image,
      });
      addItem({
        _id: newProduct._id,
        name: "My Custom T-Shirt",
        image: { asset: { _ref: image, _type: "reference" }, _type: "image" },
        _type: "product",
        _createdAt: new Date().toISOString(),
        _updatedAt: "",
        _rev: "",
      });

      toast({
        title: "Added to Basket!",
        description: "Your custom t-shirt has been added to your basket.",
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        title: "Error",
        description: "Failed to create your order.",
        variant: "destructive",
      });
    }
  }; // Added missing closing brace for orderNow function
  return (
    <TooltipProvider>
      <aside className="w-full lg:w-72 bg-card border-r p-4 flex flex-col gap-6">
        <h1 className="text-2xl font-bold font-headline">TeeForge</h1>

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
            <Ruler /> T-Shirt Style
          </h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="shirt-style-toggle">Slim Fit</Label>
            <Switch
              id="shirt-style-toggle"
              checked={shirtStyle === "oversized"}
              onCheckedChange={toggleShirtStyle}
            />
            <Label htmlFor="shirt-style-toggle">Oversized</Label>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
            <Palette /> Customize
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={addText}>
              <Type className="mr-2" /> Add Text
            </Button>
            <Button
              variant="outline"
              onClick={() => uploadInputRef.current?.click()}
            >
              <ImagePlus className="mr-2" /> Add Logo
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={uploadInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </div>
          <Button variant="destructive" onClick={deleteActiveObject}>
            <Trash2 className="mr-2" /> Delete Selected
          </Button>
        </div>

        <Separator />

        <div className="flex-grow flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted-foreground">
            History
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={undo} disabled={!canUndo}>
                  <Undo />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={redo} disabled={!canRedo}>
                  <Redo />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-sm text-muted-foreground">
            Actions
          </h2>
          <Button onClick={orderNow} size="lg">
            <ShoppingBasket className="mr-2" /> Order Now
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
