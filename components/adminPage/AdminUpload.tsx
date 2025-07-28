import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../customizer/use-toast';

interface TshirtColor {
  id: string;
  name: string;
  file: File;
  preview: string;
}

interface Logo {
  id: string;
  name: string;
  file: File;
  preview: string;
}

const AdminUpload = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [tshirtColors, setTshirtColors] = useState<TshirtColor[]>([]);
  const [logoName, setLogoName] = useState('');
  const [colorName, setColorName] = useState('');
  const { toast } = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && logoName.trim()) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newLogo: Logo = {
          id: Date.now().toString(),
          name: logoName.trim(),
          file,
          preview: e.target?.result as string,
        };
        setLogos(prev => [...prev, newLogo]);
        setLogoName('');
        toast({
          title: "Logo uploaded",
          description: `${logoName} has been added successfully.`,
        });
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    } else {
      toast({
        title: "Upload failed",
        description: "Please provide a logo name and select a file.",
        variant: "destructive",
      });
    }
  };

  const handleTshirtColorUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && colorName.trim()) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newColor: TshirtColor = {
          id: Date.now().toString(),
          name: colorName.trim(),
          file,
          preview: e.target?.result as string,
        };
        setTshirtColors(prev => [...prev, newColor]);
        setColorName('');
        toast({
          title: "T-shirt color uploaded",
          description: `${colorName} color has been added successfully.`,
        });
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    } else {
      toast({
        title: "Upload failed",
        description: "Please provide a color name and select a file.",
        variant: "destructive",
      });
    }
  };

  const deleteLogo = (id: string) => {
    setLogos(prev => prev.filter(logo => logo.id !== id));
    toast({
      title: "Logo deleted",
      description: "Logo has been removed successfully.",
    });
  };

  const deleteTshirtColor = (id: string) => {
    setTshirtColors(prev => prev.filter(color => color.id !== id));
    toast({
      title: "Color deleted",
      description: "T-shirt color has been removed successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">
            Admin Upload Center
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage logos and t-shirt color images
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Logo Upload Section */}
          <Card className="shadow-elegant border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <ImageIcon className="w-5 h-5" />
                Logo Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo-name" className="text-sm font-medium">
                    Logo Name
                  </Label>
                  <Input
                    id="logo-name"
                    placeholder="Enter logo name..."
                    value={logoName}
                    onChange={(e) => setLogoName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="logo-file" className="text-sm font-medium">
                    Upload Logo Image
                  </Label>
                  <div className="mt-1">
                    <input
                      id="logo-file"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById('logo-file')?.click()}
                      className="w-full"
                      disabled={!logoName.trim()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Logo File
                    </Button>
                  </div>
                </div>
              </div>

              {/* Logo Grid */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Uploaded Logos</h3>
                {logos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No logos uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {logos.map((logo) => (
                      <div
                        key={logo.id}
                        className="bg-card border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={logo.preview}
                          alt={logo.name}
                          className="w-full h-24 object-contain bg-muted rounded"
                        />
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{logo.name}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteLogo(logo.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* T-shirt Colors Upload Section */}
          <Card className="shadow-elegant border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5">
              <CardTitle className="flex items-center gap-2 text-primary">
                <ImageIcon className="w-5 h-5" />
                T-shirt Color Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="color-name" className="text-sm font-medium">
                    Color Name
                  </Label>
                  <Input
                    id="color-name"
                    placeholder="Enter color name (e.g., Navy Blue)..."
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="color-file" className="text-sm font-medium">
                    Upload Color Sample Image
                  </Label>
                  <div className="mt-1">
                    <input
                      id="color-file"
                      type="file"
                      accept="image/*"
                      onChange={handleTshirtColorUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById('color-file')?.click()}
                      className="w-full"
                      disabled={!colorName.trim()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Color Image
                    </Button>
                  </div>
                </div>
              </div>

              {/* T-shirt Colors Grid */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">T-shirt Colors</h3>
                {tshirtColors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No t-shirt colors uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {tshirtColors.map((color) => (
                      <div
                        key={color.id}
                        className="bg-card border border-border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={color.preview}
                          alt={color.name}
                          className="w-full h-24 object-cover bg-muted rounded"
                        />
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{color.name}</Badge>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteTshirtColor(color.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;