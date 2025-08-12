import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import LiveSmartVision from '@/components/subscription/LiveSmartVision';

const Subscription = () => {
  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-cursive font-bold text-primary mb-2 text-glow">
            🎥 Live SmartVision: Object Detection & Labeling
          </h1>
          <p className="text-sm md:text-base font-times text-muted-foreground max-w-3xl mx-auto">
            Real-time object detection with OCR and speech, right in your browser. Enable your camera to begin.
          </p>
        </div>
        <LiveSmartVision />
      </div>
    </div>
  );
};

export default Subscription;