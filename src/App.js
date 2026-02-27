import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
import { AudioProvider, useAudio } from "@/context/AudioContext";

// Pages
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import KanaHub from "@/pages/KanaHub";
import KanjiHub from "@/pages/KanjiHub";
import VocabHub from "@/pages/VocabHub";
import GrammarHub from "@/pages/GrammarHub";
import PracticeZone from "@/pages/PracticeZone";
import QuizPage from "@/pages/QuizPage";
import ProfilePage from "@/pages/ProfilePage";
import WritingPractice from "@/pages/WritingPractice";
import AdvancedWriting from "@/pages/AdvancedWriting";
import ConfusionPairs from "@/pages/ConfusionPairs";
import ConjugationTrainer from "@/pages/ConjugationTrainer";
import MockTest from "@/pages/MockTest";
import SentencePractice from "@/pages/SentencePractice";
import ReadingPractice from "@/pages/ReadingPractice";
import UnlimitedPractice from "@/pages/UnlimitedPractice";
import PlacementQuiz from "@/pages/PlacementQuiz";
import ListeningHub from "@/pages/ListeningHub";
import ShadowingPractice from "@/pages/ShadowingPractice";
import EbookReader from "@/pages/EbookReader";
import WordBank from "@/pages/WordBank";

// Background music initializer
const MusicInitializer = ({ children }) => {
  const { profile } = useProfile();
  const { startMusic, musicEnabled, initializeAudio } = useAudio();

  useEffect(() => {
    // Start music when user interacts with the page
    const handleInteraction = () => {
      initializeAudio();
      if (musicEnabled) {
        startMusic();
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [initializeAudio, startMusic, musicEnabled]);

  return children;
};

function App() {
  return (
    <ProfileProvider>
      <AudioProvider>
        <MusicInitializer>
          <BrowserRouter>
            <Routes>
              {/* Public Landing */}
              <Route path="/" element={<LandingPage />} />

              {/* Main App Routes - No auth required */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/kana" element={<KanaHub />} />
              <Route path="/kana/:type" element={<KanaHub />} />
              <Route path="/kanji" element={<KanjiHub />} />
              <Route path="/vocab" element={<VocabHub />} />
              <Route path="/grammar" element={<GrammarHub />} />
              <Route path="/practice" element={<PracticeZone />} />
              <Route path="/settings" element={<ProfilePage />} />

              {/* Practice Modes */}
              <Route path="/practice/writing" element={<WritingPractice />} />
              <Route path="/practice/writing/:type" element={<WritingPractice />} />
              <Route path="/practice/whiteboard" element={<AdvancedWriting />} />
              <Route path="/practice/confusion" element={<ConfusionPairs />} />
              <Route path="/practice/conjugation" element={<ConjugationTrainer />} />
              <Route path="/practice/mock-test" element={<MockTest />} />
              <Route path="/practice/sentence" element={<SentencePractice />} />
              <Route path="/practice/reading" element={<ReadingPractice />} />
              <Route path="/practice/listening" element={<ListeningHub />} />
              <Route path="/practice/shadowing" element={<ShadowingPractice />} />
              <Route path="/ebooks" element={<EbookReader />} />
              <Route path="/practice/word-bank" element={<WordBank />} />

              <Route path="/practice/unlimited" element={<UnlimitedPractice />} />

              {/* Quiz & Placement */}
              <Route path="/placement-quiz" element={<PlacementQuiz />} />
              <Route path="/quiz/:type" element={<QuizPage />} />

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster position="top-center" />
          </BrowserRouter>
        </MusicInitializer>
      </AudioProvider>
    </ProfileProvider>
  );
}

export default App;
