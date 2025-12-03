import { useState } from "react";
import Header from "./components/header";
import Hero from "./components/hero";
import Features from "./components/features";
import BrowseEvents from "./components/browse-events";
import CTA from "./components/cta";
import Footer from "./components/footer";

const Homepage = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <main className="min-h-screen bg-background">
      <Header theme={theme} onThemeToggle={toggleTheme} />
      <Hero />
      <Features />
      <BrowseEvents />
      <CTA />
      <Footer />
    </main>
  );
};

export default Homepage;
