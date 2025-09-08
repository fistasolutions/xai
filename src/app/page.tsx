import Features from "@/components/home/features";
import HomeHero from "@/components/home/home-hero";
import LatestNews from "@/components/home/latest-news";
import Premium from "@/components/home/premium";
import StarBurst from "@/components/home/start-burst";

export default function Home() {
  return (
    <>
      <HomeHero />
      <Features />
      <StarBurst />
      <Premium />
      <LatestNews />
    </>
  );
}
