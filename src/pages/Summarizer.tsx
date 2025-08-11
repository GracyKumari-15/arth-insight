import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import BackButton from '@/components/ui/back-button';
import FloatingBackground from '@/components/ui/floating-background';
import { Copy, Download, FileText } from 'lucide-react';

const Summarizer = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    updateCounts(text);
  };

  const generateSummary = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to summarize.",
        variant: "destructive"
      });
      return;
    }

    if (inputText.trim().split(/\s+/).length < 10) {
      toast({
        title: "Text too short",
        description: "Please provide longer text for better summarization.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simple extractive summarization (client-side)
      const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const summaryLength = Math.max(1, Math.ceil(sentences.length * 0.3)); // 30% of original
      
      // Simple scoring based on sentence length and position
      const scoredSentences = sentences.map((sentence, index) => ({
        sentence: sentence.trim(),
        score: sentence.trim().length + (index === 0 ? 50 : 0) + (index === sentences.length - 1 ? 25 : 0)
      }));

      // Sort by score and take top sentences
      const topSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, summaryLength)
        .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
        .map(item => item.sentence);

      const generatedSummary = topSentences.join('. ') + '.';
      setSummary(generatedSummary);
      
      toast({
        title: "Summary generated! 📝",
        description: `Reduced to ${Math.round((generatedSummary.length / inputText.length) * 100)}% of original length.`
      });
    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        title: "Error generating summary",
        description: "Please try again with different text.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(summary);
    toast({
      title: "Summary copied! 📋",
      description: "The summary has been copied to clipboard."
    });
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Summary downloaded! 💾",
      description: "The summary file has been saved to your device."
    });
  };

  return (
    <div className="min-h-screen relative">
      <FloatingBackground />
      <BackButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-cursive font-bold text-primary mb-4 text-glow">
            📝 Text Summarizer
          </h1>
          <p className="text-lg font-times text-muted-foreground max-w-2xl mx-auto">
            Transform long text into concise, meaningful summaries with AI-powered analysis
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">📄 Enter Text to Summarize</h2>
              <Textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Paste your text here... (minimum 10 words for better results)"
                className="min-h-80 mb-4"
              />
              
              <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
              </div>

              <Button
                onClick={generateSummary}
                disabled={isProcessing || !inputText.trim()}
                className="w-full bg-gradient-primary text-lg py-6"
              >
                <FileText className="mr-2 h-5 w-5" />
                {isProcessing ? '🔄 Generating Summary...' : '✨ Summarize Text'}
              </Button>
            </Card>

            {/* Output Section */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-center">📋 Generated Summary</h2>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Your summarized text will appear here..."
                className="min-h-80 mb-4"
                readOnly={!summary}
              />
              
              {summary && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Summary Length: {summary.split(/\s+/).length} words</span>
                    <span>Reduction: {Math.round(((inputText.length - summary.length) / inputText.length) * 100)}%</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={copyText} variant="outline" className="flex-1">
                      <Copy className="mr-2 h-4 w-4" />
                      📝 Copy Summary
                    </Button>
                    <Button onClick={downloadSummary} variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      💾 Download
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Tips Section */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-3">💡 Tips for Better Summaries</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Provide well-structured text with clear sentences</li>
              <li>• Longer texts (100+ words) typically produce better summaries</li>
              <li>• The summary will be approximately 30% of your original text length</li>
              <li>• You can edit the generated summary before copying or downloading</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;