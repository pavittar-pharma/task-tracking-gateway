
import { Hero } from "@/components/landingPage/Hero";
import { Features } from "@/components/landingPage/Features";
import { Footer } from "@/components/landingPage/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
