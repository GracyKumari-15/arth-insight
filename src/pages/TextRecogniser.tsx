import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import Tesseract from 'tesseract.js';
import { Download, Copy, Upload } from 'lucide-react';

const TextRecogniser = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractText = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(selectedImage, 'eng', {
        logger: m => console.log(m)
      });
      setExtractedText(result.data.text);
      toast({
        title: "Text extracted successfully! 🎉",
        description: "Your image has been processed."
      });
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Error processing image",
        description: "Please try again with a clearer image.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    toast({
      title: "Text copied! 📋",
      description: "The extracted text has been copied to clipboard."
    });
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "File downloaded! 💾",
      description: "The text file has been saved to your device."
    });
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-cursive font-bold text-primary mb-4 text-glow">
            🔍 Text Recogniser
          </h1>
          <p className="text-lg font-times text-muted-foreground max-w-2xl mx-auto">
            Upload an image and extract text using advanced OCR technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">📸 Upload Image</h2>
            <div className="space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-20 text-lg bg-gradient-primary"
                variant="outline"
              >
                <Upload className="mr-2 h-6 w-6" />
                Choose Image (JPG, PNG, JPEG)
              </Button>
              
              {imagePreview && (
                <div className="mt-6 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg shadow-card"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Extract Button */}
          {selectedImage && (
            <div className="text-center">
              <Button
                onClick={extractText}
                disabled={isProcessing}
                size="lg"
                className="bg-gradient-primary text-lg px-12"
              >
                {isProcessing ? '🔄 Processing...' : '🔍 Extract Text'}
              </Button>
            </div>
          )}

          {/* Results Section */}
          {extractedText && (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">📄 Extracted Text</h2>
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="min-h-48 mb-6"
                placeholder="Extracted text will appear here..."
              />
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={copyText} variant="outline" className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  📝 Copy Text
                </Button>
                <Button onClick={downloadText} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  💾 Download Text
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextRecogniser;