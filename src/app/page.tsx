import About from "@/components/About/About";
import Creators from "@/components/Creators/Creators";
import Hero from "@/components/Hero/Hero";
import PopularArticles from "@/components/PopularArticles/PopularArticles";

export default function HomePage() {
  return (
    <main className="container">
      <Hero />
      <About />
      <PopularArticles />
      <Creators />
    </main>
  );
}
