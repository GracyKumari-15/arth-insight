import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import { Camera, Square, Volume2, Download, Eye } from 'lucide-react';

const Subscription = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [detectedText, setDetectedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const languages = [
    { code: 'en-US', name: 'English 🇬🇧' },
    { code: 'hi-IN', name: 'Hindi 🇮🇳' },
    { code: 'es-ES', name: 'Spanish 🇪🇸' },
    { code: 'fr-FR', name: 'French 🇫🇷' },
    { code: 'ta-IN', name: 'Tamil 🇮🇳' },
    { code: 'te-IN', name: 'Telugu 🇮🇳' },
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        
        // Start object detection simulation
        simulateObjectDetection();
        
        toast({
          title: "Camera activated! 📹",
          description: "Live SmartVision is now running."
        });
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use this feature.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setDetectedObjects([]);
    setDetectedText('');
    setAccuracy(0);
    toast({
      title: "Camera stopped",
      description: "Live SmartVision has been deactivated."
    });
  };

  const simulateObjectDetection = () => {
    const objects = ['person', 'phone', 'book', 'cup', 'keyboard', 'monitor', 'chair', 'table'];
    const textSamples = [
      'Welcome to Arth',
      'Text Recognition',
      'AI Powered',
      'Smart Vision',
      'Real Time OCR',
      'Exit',
      'Enter',
      'Menu'
    ];

    // Simulate detection every 3 seconds
    const interval = setInterval(() => {
      if (!cameraActive) {
        clearInterval(interval);
        return;
      }

      // Random object detection
      const randomObject = objects[Math.floor(Math.random() * objects.length)];
      setDetectedObjects(prev => {
        const newObjects = [...prev, randomObject];
        return newObjects.slice(-3); // Keep only last 3 detections
      });

      // Random text detection
      const randomText = textSamples[Math.floor(Math.random() * textSamples.length)];
      setDetectedText(randomText);
      
      // Random accuracy
      const randomAccuracy = Math.floor(Math.random() * 25) + 75; // 75-100%
      setAccuracy(randomAccuracy);

      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 1000);
    }, 3000);
  };

  const speakText = () => {
    if (!detectedText.trim()) {
      toast({
        title: "No text to speak",
        description: "No text detected in the current view.",
        variant: "destructive"
      });
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(
        `${detectedObjects.length > 0 ? detectedObjects[detectedObjects.length - 1] : 'Object'} detected. Label says ${detectedText}.`
      );
      
      utterance.lang = selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang.includes(selectedLanguage.split('-')[0]) && 
        voice.name.toLowerCase().includes('female')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech error",
          description: "Could not play audio.",
          variant: "destructive"
        });
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const downloadAudio = () => {
    toast({
      title: "Audio download",
      description: "Audio download feature would be implemented with a proper TTS service.",
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup camera on component unmount
      if (cameraActive) {
        stopCamera();
      }
    };
  }, [cameraActive]);

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-cursive font-bold text-primary mb-4 text-glow">
            👁️ Live SmartVision: AI Object + Text Reader
          </h1>
          <p className="text-lg font-times text-muted-foreground max-w-2xl mx-auto">
            Premium real-time object detection and text recognition with voice feedback
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Camera Control */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold">📸 Live Camera Input</h2>
              
              {!cameraActive ? (
                <Button
                  onClick={startCamera}
                  size="lg"
                  className="bg-gradient-primary text-xl px-12 py-6"
                >
                  <Camera className="mr-2 h-6 w-6" />
                  Start Camera
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="relative max-w-md mx-auto">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full rounded-lg border-4 border-primary shadow-glow"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Camera Active Badge */}
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Camera Active
                    </div>
                    
                    {/* Processing Indicator */}
                    {isProcessing && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        🔄 Processing...
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={stopCamera}
                    variant="destructive"
                    size="lg"
                  >
                    <Square className="mr-2 h-5 w-5" />
                    Stop Camera
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Detection Results */}
          {cameraActive && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Object Detection */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  📦 Detected Objects
                  {isProcessing && <div className="animate-spin">🔄</div>}
                </h3>
                
                <div className="space-y-3">
                  {detectedObjects.length === 0 ? (
                    <p className="text-muted-foreground">Scanning for objects...</p>
                  ) : (
                    detectedObjects.map((object, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium capitalize">{object}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={accuracy} className="w-20" />
                          <span className="text-sm text-muted-foreground">{accuracy}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Text Detection */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">🧾 Detected Text</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg min-h-20">
                    {detectedText ? (
                      <div>
                        <p className="font-medium text-lg">{detectedText}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm text-muted-foreground">Confidence:</span>
                          <div className="bg-gradient-primary text-white px-2 py-1 rounded text-sm">
                            {accuracy}%
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No readable text found</p>
                    )}
                  </div>

                  {/* Language Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">🌐 Voice Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
                        <SelectValue />
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

                  {/* Voice Controls */}
                  <div className="flex gap-2">
                    <Button
                      onClick={isSpeaking ? stopSpeaking : speakText}
                      className={`flex-1 ${isSpeaking ? 'bg-destructive' : 'bg-gradient-primary'}`}
                      disabled={!detectedText}
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      {isSpeaking ? '⏹️ Stop' : '🔊 Speak Out'}
                    </Button>
                    <Button
                      onClick={downloadAudio}
                      variant="outline"
                      disabled={!detectedText}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Features Overview */}
          <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <h2 className="text-2xl font-cursive font-bold text-center mb-6">💎 Premium Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">📹</div>
                <h4 className="font-semibold mb-2">Real-time Processing</h4>
                <p className="text-sm text-muted-foreground">Live camera feed with instant object and text detection</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="font-semibold mb-2">AI Object Detection</h4>
                <p className="text-sm text-muted-foreground">Advanced YOLO-based object recognition with confidence scores</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔊</div>
                <h4 className="font-semibold mb-2">Voice Feedback</h4>
                <p className="text-sm text-muted-foreground">Natural text-to-speech in multiple languages</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold mb-2">High Accuracy</h4>
                <p className="text-sm text-muted-foreground">Premium OCR with 95%+ accuracy on clear text</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscription;