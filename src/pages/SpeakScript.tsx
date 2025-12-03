import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import Tesseract from 'tesseract.js';
import { Upload, Volume2, VolumeX, Copy, Download, FileText, Mic } from 'lucide-react';

const SpeakScript = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en-US', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'ta-IN', name: 'Tamil' },
    { code: 'te-IN', name: 'Telugu' },
  ];

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
        title: "No Image Selected",
        description: "Please upload an image to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(selectedImage, 'eng');
      setExtractedText(result.data.text);
      setTranslatedText(result.data.text);
      toast({
        title: "Text Extraction Complete",
        description: "The text is now ready for speech conversion."
      });
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Processing Error",
        description: "Unable to process the image. Please try with a clearer image.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = () => {
    if (!translatedText.trim()) {
      toast({
        title: "No Text Available",
        description: "Please extract text from an image first.",
        variant: "destructive"
      });
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = selectedLanguage;
      
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(voice => 
        voice.lang.includes(selectedLanguage.split('-')[0])
      );
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: "Unable to generate speech. Please try again.",
          variant: "destructive"
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Feature Not Supported",
        description: "Your browser does not support text-to-speech functionality.",
        variant: "destructive"
      });
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(translatedText);
    toast({
      title: "Text Copied",
      description: "The text has been copied to your clipboard."
    });
  };

  const downloadText = () => {
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Complete",
      description: "The text file has been saved to your device."
    });
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 to-slate-100">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Speak the Script
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Extract text from images and convert it to speech in multiple languages with high-quality voice output.
          </p>
        </div>

        {/* Side-by-Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Input Section - Left */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Input Image</h2>
            </div>
            
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
                className="w-full h-16 md:h-20 text-base md:text-lg font-medium"
                variant="outline"
              >
                <Upload className="mr-2 h-5 w-5" />
                Select Image File (JPG, PNG, JPEG)
              </Button>
              
              {imagePreview && (
                <div className="mt-6">
                  <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                    <img
                      src={imagePreview}
                      alt="Uploaded image preview"
                      className="w-full max-h-64 object-contain"
                    />
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={extractText}
                      disabled={isProcessing}
                      size="lg"
                      className="w-full font-semibold"
                    >
                      {isProcessing ? 'Processing Image...' : 'Extract Text'}
                    </Button>
                  </div>
                </div>
              )}

              {!imagePreview && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    No image selected. Please upload an image to begin text extraction.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Output Section - Right */}
          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Speech Output</h2>
            </div>
            
            {extractedText ? (
              <div className="space-y-4">
                <div className="bg-muted/30 border border-border rounded-lg p-4 md:p-6 min-h-[160px] md:min-h-[200px] max-h-[300px] overflow-y-auto">
                  <p className="text-lg md:text-xl lg:text-2xl font-bold text-foreground leading-relaxed whitespace-pre-wrap">
                    {translatedText}
                  </p>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Select Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose language" />
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
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={isSpeaking ? stopSpeaking : speakText}
                    className={`font-semibold ${isSpeaking ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="mr-2 h-4 w-4" />
                        Stop Speech
                      </>
                    ) : (
                      <>
                        <Volume2 className="mr-2 h-4 w-4" />
                        Play Speech
                      </>
                    )}
                  </Button>
                  <Button onClick={copyText} variant="outline" className="font-medium">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Text
                  </Button>
                </div>
                <Button onClick={downloadText} variant="outline" className="w-full font-medium">
                  <Download className="mr-2 h-4 w-4" />
                  Download Text File
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center min-h-[200px] md:min-h-[280px] flex flex-col items-center justify-center">
                <Mic className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-base md:text-lg">
                  Extracted text will be displayed here and ready for speech conversion.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpeakScript;
