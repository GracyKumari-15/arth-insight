import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import { Star, Send, ThumbsUp, Heart } from 'lucide-react';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    rating: '',
    experience: '',
    feedback: '',
    recommend: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.feedback) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Thank you for your feedback! 🙏",
      description: "Your input helps us improve our services. We appreciate you taking the time to share your thoughts."
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      category: '',
      rating: '',
      experience: '',
      feedback: '',
      recommend: ''
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-cursive font-bold text-primary mb-4 text-glow">
            Share Your Feedback
          </h1>
          <p className="text-lg font-times text-muted-foreground max-w-2xl mx-auto">
            Your thoughts matter to us. Help us improve Arth by sharing your experience
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 shadow-soft">
            <div className="text-center mb-8">
              <div className="flex justify-center gap-1 mb-4">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                <ThumbsUp className="h-8 w-8 text-blue-500 fill-current" />
                <Star className="h-8 w-8 text-yellow-500 fill-current" />
              </div>
              <h2 className="text-2xl font-semibold">💭 We Value Your Opinion</h2>
              <p className="text-muted-foreground mt-2">
                Your feedback helps us create better experiences for everyone
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Feedback Category */}
              <div className="space-y-2">
                <Label>Feedback Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">🌟 General Feedback</SelectItem>
                    <SelectItem value="feature">💡 Feature Request</SelectItem>
                    <SelectItem value="bug">🐛 Bug Report</SelectItem>
                    <SelectItem value="ui">🎨 User Interface</SelectItem>
                    <SelectItem value="performance">⚡ Performance</SelectItem>
                    <SelectItem value="support">🤝 Customer Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Overall Rating */}
              <div className="space-y-4">
                <Label>Overall Experience Rating</Label>
                <RadioGroup
                  value={formData.rating}
                  onValueChange={(value) => handleSelectChange('rating', value)}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                      <Label htmlFor={`rating-${rating}`} className="flex items-center gap-2 cursor-pointer">
                        <div className="flex">{renderStars(rating)}</div>
                        <span className="text-sm">
                          {rating === 1 && 'Poor'}
                          {rating === 2 && 'Fair'}
                          {rating === 3 && 'Good'}
                          {rating === 4 && 'Very Good'}
                          {rating === 5 && 'Excellent'}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label>Which feature did you use most?</Label>
                <Select value={formData.experience} onValueChange={(value) => handleSelectChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the feature you used" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-recogniser">🔍 Text Recogniser</SelectItem>
                    <SelectItem value="speak-script">🗣️ Speak the Script</SelectItem>
                    <SelectItem value="sentence-recognition">👁️ Sentence Recognition</SelectItem>
                    <SelectItem value="summarizer">📝 Summarizer</SelectItem>
                    <SelectItem value="keyword-scout">🔍 Keyword Scout</SelectItem>
                    <SelectItem value="translate">🌐 Translate</SelectItem>
                    <SelectItem value="subscription">⭐ Subscription Features</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Detailed Feedback */}
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback *</Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  placeholder="Please share your detailed feedback, suggestions, or any issues you encountered..."
                  className="min-h-32"
                  required
                />
              </div>

              {/* Recommendation */}
              <div className="space-y-4">
                <Label>Would you recommend Arth to others?</Label>
                <RadioGroup
                  value={formData.recommend}
                  onValueChange={(value) => handleSelectChange('recommend', value)}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definitely" id="rec-definitely" />
                    <Label htmlFor="rec-definitely">😍 Definitely</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="probably" id="rec-probably" />
                    <Label htmlFor="rec-probably">👍 Probably</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="rec-maybe" />
                    <Label htmlFor="rec-maybe">🤔 Maybe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unlikely" id="rec-unlikely" />
                    <Label htmlFor="rec-unlikely">👎 Unlikely</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary text-lg py-6 mt-8">
                <Send className="mr-2 h-5 w-5" />
                Submit Feedback
              </Button>
            </form>
          </Card>

          {/* Thank You Message */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">🙏 Thank You for Your Time</h3>
              <p className="text-sm text-muted-foreground">
                Every piece of feedback helps us understand what we're doing right and where we can improve. 
                Your input directly influences our product roadmap and future features.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;