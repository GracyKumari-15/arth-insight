import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import { Upload, Trash2, Eye, Download } from 'lucide-react';

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  uploadDate: Date;
  size: string;
}

const Library = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: UploadedImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            url: e.target?.result as string,
            uploadDate: new Date(),
            size: (file.size / 1024).toFixed(2) + ' KB'
          };
          setUploadedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
      
      toast({
        title: "Images uploaded! 📁",
        description: `Successfully added ${files.length} image(s) to your library.`
      });
    }
  };

  const deleteImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    if (previewImage) {
      const imageToDelete = uploadedImages.find(img => img.id === id);
      if (imageToDelete && previewImage === imageToDelete.url) {
        setPreviewImage(null);
      }
    }
    toast({
      title: "Image deleted! 🗑️",
      description: "The image has been removed from your library."
    });
  };

  const previewImageHandler = (url: string) => {
    setPreviewImage(url);
  };

  const downloadImage = (image: UploadedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Download started! 💾",
      description: `Downloading ${image.name}`
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-cursive font-bold text-primary mb-4 text-glow">
            📚 Image Library
          </h1>
          <p className="text-lg font-times text-muted-foreground max-w-2xl mx-auto">
            Manage your uploaded images and access them anytime for text processing
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">📤 Upload New Images</h2>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-20 text-lg bg-gradient-primary"
              variant="outline"
            >
              <Upload className="mr-2 h-6 w-6" />
              Choose Images (Multiple files supported)
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Supported formats: JPG, PNG, JPEG • Maximum size: 10MB per file
            </p>
          </Card>

          {/* Library Stats */}
          {uploadedImages.length > 0 && (
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex justify-center items-center gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{uploadedImages.length}</div>
                  <div className="text-sm text-muted-foreground">Total Images</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {uploadedImages.reduce((total, img) => total + parseFloat(img.size), 0).toFixed(2)} KB
                  </div>
                  <div className="text-sm text-muted-foreground">Total Size</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {uploadedImages.filter(img => img.uploadDate.toDateString() === new Date().toDateString()).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Uploaded Today</div>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Grid */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">🖼️ Your Images</h2>
                
                {uploadedImages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-lg font-semibold mb-2">No images yet</h3>
                    <p className="text-muted-foreground">
                      Upload your first image to get started with your library
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => previewImageHandler(image.url)}
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm truncate mb-1">{image.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {formatDate(image.uploadDate)}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">{image.size}</p>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => previewImageHandler(image.url)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => downloadImage(image)}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs text-destructive hover:text-destructive"
                              onClick={() => deleteImage(image.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">👁️ Image Preview</h2>
                
                {previewImage ? (
                  <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      onClick={() => setPreviewImage(null)}
                      variant="outline"
                      className="w-full"
                    >
                      Close Preview
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🖼️</div>
                    <p className="text-sm text-muted-foreground">
                      Click on any image to preview it here
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;