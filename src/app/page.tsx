import Features from "@/components/home/features";
import HomeHero from "@/components/home/home-hero";
import LatestNews from "@/components/home/latest-news";
import Premium from "@/components/home/premium";

export default function Home() {
  return (
    <>
      <HomeHero />
      <Features />
      <Premium />
      <LatestNews />
    </>
  );
}
