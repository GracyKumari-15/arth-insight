import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import FloatingBackground from '@/components/ui/floating-background';
import Navbar from '@/components/ui/navbar';
import AuthModal from '@/components/ui/auth-modal';
import ToolCard from '@/components/ui/tool-card';

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [subscriptionMode, setSubscriptionMode] = useState(false);

  // Apply golden theme when subscription mode is active
  useEffect(() => {
    if (subscriptionMode) {
      document.body.classList.add('golden-mode');
    } else {
      document.body.classList.remove('golden-mode');
    }

    return () => {
      document.body.classList.remove('golden-mode');
    };
  }, [subscriptionMode]);

  const tools = [
    { emoji: '🔍', title: 'Text Recogniser', path: '/text-recogniser' },
    { emoji: '🗣️', title: 'Speak the Script', path: '/speak-script' },
    { emoji: '👁️', title: 'Sentence Recognition', path: '/sentence-recognition' },
    { emoji: '📝', title: 'Summarizer', path: '/summarizer' },
    { emoji: '🔍', title: 'Keyword Scout', path: '/keyword-scout' },
    { emoji: '🌐', title: 'Translate', path: '/translate' },
    { emoji: '⭐', title: 'Subscription', path: '/subscription', isSubscription: true },
  ];

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      
      <Navbar
        onLoginClick={() => setIsLoginOpen(true)}
        onSignupClick={() => setIsSignupOpen(true)}
        subscriptionMode={subscriptionMode}
        onSubscriptionToggle={() => setSubscriptionMode(!subscriptionMode)}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-cursive font-bold text-primary mb-6 relative underline-animate text-glow">
            Welcome!!!
          </h1>
          <p className="text-lg md:text-xl font-times text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            "Transform your text processing experience with our intelligent suite of tools. From OCR to AI-powered analysis, we make text understanding effortless."
          </p>
        </section>

        {/* Tools Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-cursive font-bold text-primary mb-4 text-glow">
              Powerful Text Processing Tools 🚀
            </h2>
            <p className="text-lg font-times text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              "Discover our comprehensive suite of AI-powered tools designed to extract, analyze, and transform text in ways you never imagined. Each tool is crafted with precision to deliver exceptional results."
            </p>
          </div>

          {/* Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* First row - 3 cards */}
            <ToolCard emoji="🔍" title="Text Recogniser" path="/text-recogniser" />
            <ToolCard emoji="🗣️" title="Speak the Script" path="/speak-script" />
            <ToolCard emoji="👁️" title="Sentence Recognition" path="/sentence-recognition" />
            
            {/* Second row - 3 cards */}
            <ToolCard emoji="📝" title="Summarizer" path="/summarizer" />
            <ToolCard emoji="🔍" title="Keyword Scout" path="/keyword-scout" />
            <ToolCard emoji="🌐" title="Translate" path="/translate" />
            
            {/* Third row - centered subscription card */}
            <div className="md:col-start-2">
              <ToolCard 
                emoji="⭐" 
                title="Subscription" 
                path="/subscription" 
                isSubscription={true} 
              />
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="text-center">
          <div className="bg-card rounded-2xl p-8 shadow-soft border max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Experience the Future of Text Processing
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust Arth for their text processing needs. 
              From simple OCR to advanced AI analysis, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsSignupOpen(true)}
                size="lg" 
                className="bg-gradient-primary text-lg px-8"
              >
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setIsLoginOpen(true)}
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Auth Modals */}
      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        type="login"
      />
      <AuthModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        type="signup"
      />
    </div>
  );
};

export default Index;
