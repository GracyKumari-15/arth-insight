import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import Tesseract from 'tesseract.js';
import { Upload, Search, Copy, Download } from 'lucide-react';

const KeywordScout = () => {
  const [inputText, setInputText] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [imageKeyword, setImageKeyword] = useState('');
  const [imageHighlightedText, setImageHighlightedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text section functions
  const highlightKeywords = () => {
    if (!inputText.trim() || !searchKeyword.trim()) {
      toast({
        title: "Missing input",
        description: "Please enter both text and keyword to search.",
        variant: "destructive"
      });
      return;
    }

    const regex = new RegExp(`(${searchKeyword})`, 'gi');
    const highlighted = inputText.replace(regex, '<mark class="bg-yellow-300 px-1 rounded">$1</mark>');
    setHighlightedText(highlighted);

    const matches = inputText.match(regex);
    const count = matches ? matches.length : 0;
    
    toast({
      title: "Keywords found! 🔍",
      description: `Found ${count} occurrence(s) of "${searchKeyword}"`
    });
  };

  // Image section functions
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

  const extractTextFromImage = async () => {
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
      const result = await Tesseract.recognize(selectedImage, 'eng');
      setExtractedText(result.data.text);
      toast({
        title: "Text extracted! 📄",
        description: "Ready for keyword search."
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

  const highlightImageKeywords = () => {
    if (!extractedText.trim() || !imageKeyword.trim()) {
      toast({
        title: "Missing input",
        description: "Please extract text and enter a keyword to search.",
        variant: "destructive"
      });
      return;
    }

    const regex = new RegExp(`(${imageKeyword})`, 'gi');
    const highlighted = extractedText.replace(regex, '<mark class="bg-yellow-300 px-1 rounded">$1</mark>');
    setImageHighlightedText(highlighted);

    const matches = extractedText.match(regex);
    const count = matches ? matches.length : 0;
    
    toast({
      title: "Keywords found in image! 🔍",
      description: `Found ${count} occurrence(s) of "${imageKeyword}"`
    });
  };

  const copyText = (text: string) => {
    const cleanText = text.replace(/<mark[^>]*>|<\/mark>/g, '');
    navigator.clipboard.writeText(cleanText);
    toast({
      title: "Text copied! 📋",
      description: "The text has been copied to clipboard."
    });
  };

  const downloadText = (text: string, filename: string) => {
    const cleanText = text.replace(/<mark[^>]*>|<\/mark>/g, '');
    const blob = new Blob([cleanText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-cursive font-bold text-primary mb-4 text-glow">
            🔍 Keyword Scout
          </h1>
          <p className="text-lg font-times text-muted-foreground max-w-2xl mx-auto">
            Find and highlight keywords in text or extract keywords from images
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="text" className="text-lg">📝 Text Search</TabsTrigger>
              <TabsTrigger value="image" className="text-lg">🖼️ Image Search</TabsTrigger>
            </TabsList>

            {/* Text Search Tab */}
            <TabsContent value="text" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Enter Text</h2>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your text here..."
                    className="min-h-48 mb-4"
                  />
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Search Keyword</label>
                      <Input
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="Enter keyword to highlight..."
                      />
                    </div>
                    
                    <Button
                      onClick={highlightKeywords}
                      className="w-full bg-gradient-primary"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      🔍 Find Keywords
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Highlighted Results</h2>
                  <div
                    className="min-h-48 p-4 border rounded-lg bg-muted/50 mb-4 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: highlightedText || "Highlighted text will appear here..." }}
                  />
                  
                  {highlightedText && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyText(highlightedText)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => downloadText(highlightedText, 'keyword-results.txt')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Image Search Tab */}
            <TabsContent value="image" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">📸 Upload Image</h2>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-16 text-lg bg-gradient-primary mb-4"
                  variant="outline"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Choose Image (JPG, PNG, JPEG)
                </Button>
                
                {imagePreview && (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-48 mx-auto rounded-lg shadow-card mb-4"
                    />
                    <Button
                      onClick={extractTextFromImage}
                      disabled={isProcessing}
                      className="bg-gradient-primary"
                    >
                      {isProcessing ? '🔄 Extracting...' : '📄 Extract Text'}
                    </Button>
                  </div>
                )}
              </Card>

              {extractedText && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Extracted Text</h2>
                    <Textarea
                      value={extractedText}
                      onChange={(e) => setExtractedText(e.target.value)}
                      className="min-h-32 mb-4"
                    />
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Search Keyword</label>
                        <Input
                          value={imageKeyword}
                          onChange={(e) => setImageKeyword(e.target.value)}
                          placeholder="Enter keyword to highlight..."
                        />
                      </div>
                      
                      <Button
                        onClick={highlightImageKeywords}
                        className="w-full bg-gradient-primary"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        🔍 Find Keywords
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Highlighted Results</h2>
                    <div
                      className="min-h-32 p-4 border rounded-lg bg-muted/50 mb-4 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: imageHighlightedText || "Highlighted text will appear here..." }}
                    />
                    
                    {imageHighlightedText && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyText(imageHighlightedText)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => downloadText(imageHighlightedText, 'image-keyword-results.txt')}
                          variant="outline"
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default KeywordScout;