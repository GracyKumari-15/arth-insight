import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import Tesseract from 'tesseract.js';
import { Upload, Volume2, Copy, Download } from 'lucide-react';

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
    { code: 'en-US', name: 'English 🇬🇧', voice: 'en-US' },
    { code: 'hi-IN', name: 'Hindi 🇮🇳', voice: 'hi-IN' },
    { code: 'es-ES', name: 'Spanish 🇪🇸', voice: 'es-ES' },
    { code: 'fr-FR', name: 'French 🇫🇷', voice: 'fr-FR' },
    { code: 'ta-IN', name: 'Tamil 🇮🇳', voice: 'ta-IN' },
    { code: 'te-IN', name: 'Telugu 🇮🇳', voice: 'te-IN' },
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
      setTranslatedText(result.data.text); // Default to original text
      toast({
        title: "Text extracted successfully! 🎉",
        description: "Ready for text-to-speech conversion."
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

  const speakText = () => {
    if (!translatedText.trim()) {
      toast({
        title: "No text to speak",
        description: "Please extract text from an image first.",
        variant: "destructive"
      });
      return;
    }

    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(translatedText);
      
      // Set language and voice
      utterance.lang = selectedLanguage;
      
      // Try to find a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang.includes(selectedLanguage.split('-')[0]) && 
        (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman'))
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech error",
          description: "Could not play audio. Please try again.",
          variant: "destructive"
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech not supported",
        description: "Your browser doesn't support text-to-speech.",
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
      title: "Text copied! 📋",
      description: "The text has been copied to clipboard."
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
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-cursive font-bold text-primary mb-4 text-glow">
            🎤 Speak the Script
          </h1>
          <p className="text-lg font-times text-muted-foreground max-w-2xl mx-auto">
            Extract text from images and convert to speech in multiple languages
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">📸 Upload an Image</h2>
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
                <div className="mt-4">
                  <Button
                    onClick={extractText}
                    disabled={isProcessing}
                    className="bg-gradient-primary"
                  >
                    {isProcessing ? '🔄 Processing...' : '✍️ Extract Text'}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Text and Language Section */}
          {extractedText && (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">📄 Extracted Text</h2>
              <Textarea
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                className="min-h-32 mb-6"
                placeholder="Extracted text will appear here..."
              />
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">🌐 Select Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
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

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={isSpeaking ? stopSpeaking : speakText}
                  className={`flex-1 ${isSpeaking ? 'bg-destructive' : 'bg-gradient-primary'}`}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  {isSpeaking ? '⏹️ Stop' : '🎧 Speak'}
                </Button>
                <Button onClick={copyText} variant="outline" className="flex-1">
                  <Copy className="mr-2 h-4 w-4" />
                  📝 Copy
                </Button>
                <Button onClick={downloadText} variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  📄 Download
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakScript;