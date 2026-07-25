import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { VisionSection } from './components/VisionSection';
import { ValuesSection } from './components/ValuesSection';
import { PartnersSection } from './components/PartnersSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import ChatPage from "./components/ChatPage";

 
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 Home Page (all your sections) */}
        <Route
          path="/"
          element={
            <div className="bg-black">
              <HeroSection />
              <AboutSection />
              <ServicesSection />
              <PartnersSection />
              <VisionSection />
              <ValuesSection />
              <CTASection />
              <Footer />
            </div>
          }
        />

        {/* 🤖 AI Chat Page */}
        <Route path="/ai" element={<ChatPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;