import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import { Card } from '@/components/ui/card';

const AboutUs = () => {
  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-cursive font-bold text-primary mb-4 text-glow">
            About Arth
          </h1>
          <p className="text-xl font-times text-muted-foreground max-w-2xl mx-auto">
            Bridging the gap between visual information and digital understanding
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8 shadow-soft">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                Welcome to <strong>Arth</strong>—a professional, AI-powered text recognition and analysis platform designed to help businesses and individuals extract meaningful insights from visual content. 🚀
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Inspired by the Sanskrit word <em>"Arth,"</em> which stands for purpose, sense, and significance, our platform is dedicated to bridging the gap between visual information and digital understanding. Whether you're processing documents, analyzing images, or extracting data from visual content, Arth provides enterprise-grade solutions powered by cutting-edge artificial intelligence. 🤖
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Our professional approach focuses on accuracy, efficiency, and reliability, offering seamless integration capabilities for businesses of all sizes. From optical character recognition to advanced text analysis, we provide the tools you need to transform visual data into actionable insights. 📊
              </p>

              <p className="text-lg leading-relaxed mb-8">
                Experience the future of text recognition with Arth's professional-grade AI solutions. ✨
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To make visual text processing accessible, accurate, and effortless for everyone through advanced AI technology.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To become the leading platform for intelligent text recognition and analysis worldwide.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-semibold mb-2">Core Values</h3>
                  <p className="text-muted-foreground">
                    Innovation, reliability, user-centric design, and commitment to excellence in every solution we deliver.
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-semibold mb-2">Our Promise</h3>
                  <p className="text-muted-foreground">
                    Delivering high-quality, secure, and efficient text processing solutions that exceed expectations.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features Highlight */}
          <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <h2 className="text-2xl font-cursive font-bold text-center mb-6">🚀 What Makes Us Special</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🔍</div>
                <h4 className="font-semibold mb-2">Advanced OCR</h4>
                <p className="text-sm text-muted-foreground">State-of-the-art optical character recognition for any text format</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🌐</div>
                <h4 className="font-semibold mb-2">Multi-Language</h4>
                <p className="text-sm text-muted-foreground">Support for multiple languages and regional dialects</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold mb-2">Lightning Fast</h4>
                <p className="text-sm text-muted-foreground">Real-time processing with instant results</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;