import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TextRecogniser from "./pages/TextRecogniser";
import SpeakScript from "./pages/SpeakScript";
import SentenceRecognition from "./pages/SentenceRecognition";
import Summarizer from "./pages/Summarizer";
import KeywordScout from "./pages/KeywordScout";
import Translate from "./pages/Translate";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import Library from "./pages/Library";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/text-recogniser" element={<TextRecogniser />} />
          <Route path="/speak-script" element={<SpeakScript />} />
          <Route path="/sentence-recognition" element={<SentenceRecognition />} />
          <Route path="/summarizer" element={<Summarizer />} />
          <Route path="/keyword-scout" element={<KeywordScout />} />
          <Route path="/translate" element={<Translate />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/library" element={<Library />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
