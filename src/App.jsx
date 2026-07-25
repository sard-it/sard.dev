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
import PartnerDetailsPage from "./pages/PartnerDetailsPage";
import CalendarPage from "./pages/CalendarPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 Home Page */}
        <Route
          path="/"
          element={
            <div className="bg-black">
              <HeroSection />
              <PartnersSection />
              <AboutSection />
              <ServicesSection />
              <VisionSection />
              <ValuesSection />
              <CTASection />
              <Footer />
            </div>
          }
        />

        {/* 🤝 Partner Contract Details Page */}
        <Route path="/partners/:id" element={<PartnerDetailsPage />} />

        {/* 🤖 AI Chat Page */}
        <Route path="/ai" element={<ChatPage />} />

        {/* 📅 Calendar Booking Page */}
        <Route path="/calendar" element={<CalendarPage />} />

        {/* 🔐 Admin Dashboard Page */}
        <Route path="/admin" element={<AdminPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;