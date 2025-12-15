import Hero from "./components/hero";
import Features from "./components/features";
import BrowseEvents from "./components/browse-events";
import CTA from "./components/cta";
import Footer from "./components/footer";

const Homepage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      {/* <BrowseEvents /> */}
      <CTA />
      <Footer />
    </main>
  );
};

export default Homepage;
