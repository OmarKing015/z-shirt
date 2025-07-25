"use client"

import type React from "react"
import { useRef, useState } from "react"
import { fabric } from "fabric"
import { Type, ImagePlus, Undo, Redo, Trash2, Palette, Ruler, ShoppingBasket, Check } from "lucide-react"
import { useEditorStore } from "../../store/store"
import useBasketStore from "../../store/store"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "./use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { client } from "@/sanity/lib/client"
import { createProduct } from "@/sanity/lib/products/createProduct"
import { Product } from "@/sanity.types"
import { backendClient } from "@/sanity/lib/backendClient"

const TEMPLATE_LOGOS = [
  { name: "Logo 1", url: "/logos/logo1.png" },
  { name: "Logo 2", url: "/logos/logo2.png" },
  { name: "Logo 3", url: "/logos/logo3.png" },
  { name: "Logo 4", url: "/logos/logo4.png" },
  { name: "Logo 5", url: "/logos/logo5.png" },
  { name: "Logo 6", url: "/logos/logo6.png" },
]

const SHIRT_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#000000" },
  { name: "Navy", value: "#000080" },
  { name: "Red", value: "#FF0000" },
  { name: "Green", value: "#008000" },
  { name: "Yellow", value: "#FFFF00" },
]

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"]

const FONTS = {
  english: ["Inter", "Arial", "Helvetica", "Times New Roman", "Courier New", "Georgia"],
  arabic: ["Amiri", "Cairo", "Scheherazade", "Tajawal", "Lateef", "Almarai"],
}

export default function Toolbar() {
  const { canvas, shirtStyle, toggleShirtStyle, undo, redo, canUndo, canRedo } = useEditorStore()
  const { addItem } = useBasketStore()
  const [text, setText] = useState("Hello")
  const [selectedFont, setSelectedFont] = useState("Inter")
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("#FFFFFF")
  const [isArabic, setIsArabic] = useState(false)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const addText = () => {
    if (!canvas) return
    const textObject = new fabric.IText(text || "Type here", {
      left: 150,
      top: 200,
      fill: "#000000",
      fontFamily: selectedFont,
      // @ts-ignore
      cost: text.length * 0.1,
      type: "text",
    })
    canvas.add(textObject)
    canvas.setActiveObject(textObject)
    canvas.renderAll()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || !e.target.files[0]) return
    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }
    fabric.Image.fromURL(URL.createObjectURL(file), (img: any) => {
      img.scaleToWidth(150)
      img.set({
        left: 175,
        top: 175,
        // @ts-ignore
        cost: 5,
        type: "logo",
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    })
  }

  const addTemplateLogo = (logoUrl: string) => {
    if (!canvas) return
    fabric.Image.fromURL(logoUrl, (img: any) => {
      img.scaleToWidth(150)
      img.set({
        left: 175,
        top: 175,
        // @ts-ignore
        cost: 3,
        type: "logo",
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
    })
  }

  const deleteActiveObject = () => {
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.remove(activeObject)
      canvas.renderAll()
    }
  }

  const changeFont = (font: string) => {
    setSelectedFont(font)
    if (!canvas) return
    const activeObject = canvas.getActiveObject()
    if (activeObject && activeObject.type === "i-text") {
      // @ts-ignore
      activeObject.set({ fontFamily: font })
      canvas.renderAll()
    }
  }

  const updateShirtColor = (color: string) => {
    setSelectedColor(color)
    if (canvas) {
      canvas.renderAll()
    }
  }

  const orderNow = async () => {
    if (!canvas) return

    try {
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL({ format: "png" })

      // Convert data URL to blob
      const fetchResponse = await fetch(imageDataUrl)
      const blob = await fetchResponse.blob()

      // Create a file from the blob
      const file = new File([blob], "tshirt-design.png", { type: "image/png" })

      // Upload the image to Sanity
      const imageAsset = await client.assets.upload("image", file)

      // Get design details
      const objects = canvas.toJSON(["cost", "type"])
      const totalPrice = useEditorStore.getState().totalCost

      // Create product metadata
      const productName = `Custom T-Shirt - ${selectedSize} - ${SHIRT_COLORS.find((c) => c.value === selectedColor)?.name || "White"} - ${shirtStyle}`

      // Create the product using the new createProduct function
      const result= await backendClient.create<Product>({
        _type: "product",
        name: productName,
        slug: {
          _type: "slug",
          current: productName.toLowerCase().replace(/ /g, "-"),
        },
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
        price: totalPrice,
        _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        _createdAt: "",
        _updatedAt: "",
        _rev: "",
        success:"" ,
        product: ""
      })
      console.log(result)

      if (result.product) {
        // Add to basket
        addItem(result.product )

        toast({
          title: "Added to Basket!",
          description: "Your custom t-shirt has been added to your basket.",
        })
      } else {
        throw new Error("Failed to create product")
      }
    } catch (error) {
      console.error("Failed to create order:", error)
      toast({
        title: "Error",
        description: "Failed to create your order.",
        variant: "destructive",
      })
    }
  }

  return (
    <TooltipProvider>
      <aside className="w-full lg:w-72 bg-card border-r p-4 flex flex-col gap-6">
        {/* T-Shirt Style */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
            <Ruler /> T-Shirt Style
          </h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="shirt-style-toggle">Slim Fit</Label>
            <Switch id="shirt-style-toggle" checked={shirtStyle === "oversized"} onCheckedChange={toggleShirtStyle} />
            <Label htmlFor="shirt-style-toggle">Oversized</Label>
          </div>
        </div>

        <Separator />

        {/* Size Selection */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted-foreground">Size</h2>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
            {SHIRT_SIZES.map((size) => (
              <div key={size} className="flex items-center space-x-1">
                <RadioGroupItem value={size} id={`size-${size}`} />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Color Selection */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted-foreground">Color</h2>
          <div className="flex flex-wrap gap-2">
            {SHIRT_COLORS.map((color) => (
              <Tooltip key={color.value}>
                <TooltipTrigger asChild>
                  <button
                    className={`w-8 h-8 rounded-full border ${
                      selectedColor === color.value ? "ring-2 ring-primary" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => updateShirtColor(color.value)}
                  >
                    {selectedColor === color.value && <Check className="w-4 h-4 mx-auto text-white" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{color.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator />

        {/* Customize */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
            <Palette /> Customize
          </h2>

          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="text-input">Text Content</Label>
                <input
                  id="text-input"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="border rounded p-2"
                />

                <div className="flex items-center space-x-2 mt-2">
                  <Label htmlFor="language-toggle">English</Label>
                  <Switch id="language-toggle" checked={isArabic} onCheckedChange={setIsArabic} />
                  <Label htmlFor="language-toggle">Arabic</Label>
                </div>

                <Label htmlFor="font-select" className="mt-2">
                  Font
                </Label>
                <Select value={selectedFont} onValueChange={changeFont}>
                  <SelectTrigger id="font-select">
                    <SelectValue placeholder="Select Font" />
                  </SelectTrigger>
                  <SelectContent>
                    {(isArabic ? FONTS.arabic : FONTS.english).map((font) => (
                      <SelectItem key={font} value={font}>
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={addText} className="mt-2 bg-transparent">
                  <Type className="mr-2" /> Add Text
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={() => uploadInputRef.current?.click()}>
                  <ImagePlus className="mr-2" /> Upload Custom Logo
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={uploadInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />

                <Label className="mt-4">Template Logos</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {TEMPLATE_LOGOS.map((logo, index) => (
                    <button
                      key={index}
                      className="border rounded p-2 hover:bg-accent"
                      onClick={() => addTemplateLogo(logo.url)}
                    >
                      <img src={logo.url || "/placeholder.svg"} alt={logo.name} className="w-full h-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button variant="destructive" onClick={deleteActiveObject}>
            <Trash2 className="mr-2" /> Delete Selected
          </Button>
        </div>

        <Separator />

        {/* History */}
        <div className="flex-grow flex flex-col gap-4">
          <h2 className="font-semibold text-sm text-muted-foreground">History</h2>
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

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-sm text-muted-foreground">Actions</h2>
          <Button onClick={orderNow} size="lg">
            <ShoppingBasket className="mr-2" /> Order Now
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
