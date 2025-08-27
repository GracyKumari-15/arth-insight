import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import Tesseract from 'tesseract.js';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { Volume2, VolumeX, Download } from 'lucide-react';

interface Detection {
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

const LiveSmartVision = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ocrCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [running, setRunning] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [ocrText, setOcrText] = useState('');
  const [isOcrBusy, setIsOcrBusy] = useState(false);
  const [speechOn, setSpeechOn] = useState(false);
  const lastOcrTimeRef = useRef(0);
  const lastSpokenRef = useRef('');
  const rafRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' }, 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setRunning(true);
      toast({ title: 'Camera activated 📹', description: 'Live feed is running.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Camera access denied', description: 'Please allow camera access.', variant: 'destructive' });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setRunning(false);
    cancelLoop();
  };

  const cancelLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const loadModel = async () => {
    if (model || loadingModel) return;
    setLoadingModel(true);
    try {
      const m = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      setModel(m);
    } catch (e) {
      console.error('Model load error', e);
      toast({ title: 'Detection model failed to load', description: 'Please reload the page.', variant: 'destructive' });
    } finally {
      setLoadingModel(false);
    }
  };

  const drawDetections = (ctx: CanvasRenderingContext2D, dets: Detection[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    dets.forEach((d) => {
      const [x, y, w, h] = d.bbox;
      const score = Math.round(d.score * 100);
      // Color by basic class type
      const color = d.class.match(/person|knife|scissors|bottle|stop sign/i)
        ? 'rgba(239,68,68,0.9)' // red-ish for potentially risky
        : 'rgba(34,197,94,0.9)'; // green for neutral

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      const label = `${d.class} ${score}%`;
      ctx.fillStyle = color;
      ctx.fillRect(x, y - 22, ctx.measureText(label).width + 10, 20);
      ctx.fillStyle = '#fff';
      ctx.font = '14px Poppins, sans-serif';
      ctx.fillText(label, x + 5, y - 7);
    });
  };

  const runOcrOnDetection = useCallback(async (d: Detection) => {
    if (!videoRef.current) return;
    const now = performance.now();
    if (isOcrBusy || now - lastOcrTimeRef.current < 1500) return; // throttle OCR
    setIsOcrBusy(true);

    try {
      const [x, y, w, h] = d.bbox.map((n) => Math.max(0, Math.floor(n))) as [number, number, number, number];
      const v = videoRef.current;
      const c = ocrCanvasRef.current;
      c.width = w;
      c.height = h;
      const cctx = c.getContext('2d');
      if (!cctx) return;
      cctx.drawImage(v, x, y, w, h, 0, 0, w, h);
      const dataUrl = c.toDataURL('image/png');
      const res = await Tesseract.recognize(dataUrl, 'eng', { logger: () => {} });
      const text = (res.data.text || '').trim();
      if (text) {
        setOcrText(text);
        if (speechOn && text !== lastSpokenRef.current) {
          speak(`Detected ${d.class}. Label says ${text}.`);
          lastSpokenRef.current = text;
        }
      }
      lastOcrTimeRef.current = now;
    } catch (e) {
      // Ignore OCR errors quietly to keep loop smooth
    } finally {
      setIsOcrBusy(false);
    }
  }, [speechOn, isOcrBusy]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 1.0;
      u.pitch = 1.05;
      const female = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
      if (female) u.voice = female;
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const loop = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !model || !running) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    if (c.width !== v.videoWidth || c.height !== v.videoHeight) {
      c.width = v.videoWidth;
      c.height = v.videoHeight;
    }

    try {
      const preds = await model.detect(v);
      const mapped: Detection[] = preds.map(p => ({ class: p.class, score: p.score, bbox: p.bbox as any }));
      setDetections(mapped);
      drawDetections(ctx, mapped);

      // Pick the highest confidence detection to try OCR on
      if (mapped.length) {
        const top = mapped[0];
        // Heuristic: only try OCR for certain classes likely to contain text
        const texty = /book|bottle|tv|laptop|cell phone|remote|keyboard|stop sign|bench|backpack|handbag|suitcase|cup|wine glass|chair|monitor/i;
        if (texty.test(top.class)) {
          runOcrOnDetection(top);
        }
      }
    } catch (e) {
      // swallow per-frame errors
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [model, running, runOcrOnDetection]);

  useEffect(() => {
    if (running) {
      loadModel();
    } else {
      cancelLoop();
    }
  }, [running]);

  useEffect(() => {
    if (model && running) {
      rafRef.current = requestAnimationFrame(loop);
    }
    return cancelLoop;
  }, [model, running, loop]);

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Left: Live video with overlay */}
      <Card className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg md:text-xl font-semibold text-black">🎥 Live SmartVision</h2>
          <div className="flex gap-2">
            {!running ? (
              <Button onClick={startCamera} disabled={loadingModel} className="bg-gradient-primary text-sm md:text-base">
                {loadingModel ? 'Loading...' : '▶️ Start'}
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopCamera} className="text-sm md:text-base">⏹️ Stop</Button>
            )}
          </div>
        </div>
        <div className="relative mx-auto max-w-full">
          <video ref={videoRef} className="w-full rounded-lg border shadow-card" playsInline muted autoPlay />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          {running && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Camera Active
            </div>
          )}
        </div>
      </Card>

      {/* Right: Panels */}
      <div className="space-y-6">
        <Card className="p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold mb-2 text-black">🔍 Detected Objects</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {detections.length === 0 ? (
              <p className="text-muted-foreground">No objects detected yet…</p>
            ) : (
              detections.slice(0, 6).map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="font-medium capitalize">{d.class}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={Math.round(d.score * 100)} className="w-24" />
                    <span className="text-xs text-muted-foreground">{Math.round(d.score * 100)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold mb-2 text-black">📝 OCR Results</h3>
          <div className="min-h-16 p-3 bg-muted rounded-md">
            {ocrText ? <span className="font-medium">{ocrText}</span> : <span className="text-muted-foreground">No readable text found</span>}
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <h3 className="text-base md:text-lg font-semibold mb-3 text-black">🔊 TTS Output</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={() => setSpeechOn((s) => !s)} 
              className={`${speechOn ? 'bg-primary' : 'bg-gradient-primary'} text-sm md:text-base flex-1 sm:flex-none`}
            >
              {speechOn ? <><VolumeX className="mr-1 md:mr-2 h-4 w-4" /> OFF</> : <><Volume2 className="mr-1 md:mr-2 h-4 w-4" /> ON</>}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => toast({ title: 'Download requires TTS service', description: 'Use ElevenLabs or a backend to generate MP3.' })}
              className="text-sm md:text-base flex-1 sm:flex-none"
            >
              <Download className="mr-1 md:mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LiveSmartVision;
