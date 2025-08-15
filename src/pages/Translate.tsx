import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import Tesseract from 'tesseract.js';
import { Upload, Languages, Copy, Download } from 'lucide-react';

const Translate = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [imageTranslatedText, setImageTranslatedText] = useState('');
  const [textTargetLanguage, setTextTargetLanguage] = useState('es');
  const [imageTargetLanguage, setImageTargetLanguage] = useState('es');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en', name: 'English 🇬🇧' },
    { code: 'hi', name: 'Hindi 🇮🇳' },
    { code: 'es', name: 'Spanish 🇪🇸' },
    { code: 'fr', name: 'French 🇫🇷' },
    { code: 'ta', name: 'Tamil 🇮🇳' },
    { code: 'te', name: 'Telugu 🇮🇳' },
    { code: 'de', name: 'German 🇩🇪' },
    { code: 'it', name: 'Italian 🇮🇹' },
    { code: 'pt', name: 'Portuguese 🇵🇹' },
    { code: 'ru', name: 'Russian 🇷🇺' },
    { code: 'ja', name: 'Japanese 🇯🇵' },
    { code: 'ko', name: 'Korean 🇰🇷' },
    { code: 'zh', name: 'Chinese 🇨🇳' },
    { code: 'ar', name: 'Arabic 🇸🇦' },
  ];

  // Translation using MyMemory API (free and reliable)
  const translateText = async (text: string, targetLang: string) => {
    try {
      // MyMemory API - free translation service
      const encodedText = encodeURIComponent(text);
      const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=auto|${targetLang}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
      
      // Fallback: Simple client-side translation mapping for basic words
      const basicTranslations: Record<string, Record<string, string>> = {
        'hello': { 'es': 'hola', 'fr': 'bonjour', 'hi': 'नमस्ते', 'de': 'hallo', 'it': 'ciao' },
        'goodbye': { 'es': 'adiós', 'fr': 'au revoir', 'hi': 'अलविदा', 'de': 'auf wiedersehen', 'it': 'arrivederci' },
        'thank you': { 'es': 'gracias', 'fr': 'merci', 'hi': 'धन्यवाद', 'de': 'danke', 'it': 'grazie' },
        'yes': { 'es': 'sí', 'fr': 'oui', 'hi': 'हाँ', 'de': 'ja', 'it': 'sì' },
        'no': { 'es': 'no', 'fr': 'non', 'hi': 'नहीं', 'de': 'nein', 'it': 'no' }
      };
      
      const lowerText = text.toLowerCase();
      if (basicTranslations[lowerText] && basicTranslations[lowerText][targetLang]) {
        return basicTranslations[lowerText][targetLang];
      }
      
      throw new Error('Translation service unavailable');
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Unable to translate text. Please check your internet connection and try again.');
    }
  };

  const handleTextTranslation = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to translate",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateText(inputText, textTargetLanguage);
      setTranslatedText(result);
      toast({
        title: "Text translated! 🌍",
        description: `Translated to ${languages.find(l => l.code === textTargetLanguage)?.name}`
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

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
        description: "Ready for translation."
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

  const handleImageTextTranslation = async () => {
    if (!extractedText.trim()) {
      toast({
        title: "No text to translate",
        description: "Please extract text from image first.",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateText(extractedText, imageTargetLanguage);
      setImageTranslatedText(result);
      toast({
        title: "Extracted text translated! 🌍",
        description: `Translated to ${languages.find(l => l.code === imageTargetLanguage)?.name}`
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text copied! 📋",
      description: "The translated text has been copied to clipboard."
    });
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
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
            🌍 Universal Translator
          </h1>
          <p className="text-lg font-times text-muted-foreground max-w-2xl mx-auto">
            Translate text directly or extract and translate text from images
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="text" className="text-lg">📝 Text Input</TabsTrigger>
              <TabsTrigger value="image" className="text-lg">🖼️ Image Input</TabsTrigger>
            </TabsList>

            {/* Text Translation Tab */}
            <TabsContent value="text" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Input Text</h2>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to translate..."
                    className="min-h-48 mb-4"
                  />
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Target Language</label>
                      <Select value={textTargetLanguage} onValueChange={setTextTargetLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      onClick={handleTextTranslation}
                      disabled={isTranslating}
                      className="w-full bg-gradient-primary"
                    >
                      <Languages className="mr-2 h-4 w-4" />
                      {isTranslating ? '🔄 Translating...' : '🌍 Translate'}
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Translation Result</h2>
                  <Textarea
                    value={translatedText}
                    onChange={(e) => setTranslatedText(e.target.value)}
                    placeholder="Translated text will appear here..."
                    className="min-h-48 mb-4"
                    readOnly={!translatedText}
                  />
                  
                  {translatedText && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyText(translatedText)}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => downloadText(translatedText, 'translated-text.txt')}
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

            {/* Image Translation Tab */}
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
                  Choose Image (JPG, PNG)
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
                        <label className="block text-sm font-medium mb-2">Target Language</label>
                        <Select value={imageTargetLanguage} onValueChange={setImageTargetLanguage}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button
                        onClick={handleImageTextTranslation}
                        disabled={isTranslating}
                        className="w-full bg-gradient-primary"
                      >
                        <Languages className="mr-2 h-4 w-4" />
                        {isTranslating ? '🔄 Translating...' : '🌍 Translate Extracted Text'}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Translation Result</h2>
                    <Textarea
                      value={imageTranslatedText}
                      onChange={(e) => setImageTranslatedText(e.target.value)}
                      placeholder="Translated text will appear here..."
                      className="min-h-32 mb-4"
                      readOnly={!imageTranslatedText}
                    />
                    
                    {imageTranslatedText && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyText(imageTranslatedText)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => downloadText(imageTranslatedText, 'image-translated-text.txt')}
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

          {/* Language Support Notice */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-3">🌐 Translation Notes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• This is a demo version with basic translation capabilities</li>
              <li>• For production use, integrate with Google Translate API or LibreTranslate</li>
              <li>• Image text extraction works best with clear, high-contrast text</li>
              <li>• Multiple language support available for various regions</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Translate;