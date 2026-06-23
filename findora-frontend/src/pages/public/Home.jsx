import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import HelpSection from "../../components/HelpSection/HelpSection";
import RecentPosts from "../../components/RecentPosts/RecentPosts";
import Features from "../../components/Features/Features";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Statistics from "../../components/Statistics/Statistics";
import Footer from "../../components/Footer/Footer";

function Home() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <HelpSection />
      <RecentPosts />
      <Features />
      <HowItWorks />
      <Statistics />
      <Footer />
    </div>
  );
}

export default Home;
