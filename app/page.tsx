import { Hero } from "@/components/main/hero";
import { RoverTechnologySection } from "@/components/main/rover-technology";
import { PastAchievements } from "@/components/main/past-achievements";
import { Sponsors } from "@/components/main/sponsors";
import { Gallery } from "@/components/main/gallery";
import { LogoSection } from "@/components/main/logo-section";
import { Fixed3DModel } from "@/components/sub/fixed-3d-model";
import { Mobile3DModel } from "@/components/sub/mobile-3d-model";
import { ChatWidget } from "@/components/main/chat-widget";

export default function Home() {
  return (
    <main className="h-full w-full">
      {/* Hero + Rover Technology Section with Fixed 3D Model */}
      <div className="relative">
        {/* Fixed 3D Model - Desktop Only, scoped to this section */}
        <Fixed3DModel />

        {/* Left Content Column - Desktop: w-1/2, Mobile: full width */}
        <div className="lg:w-1/2 w-full">
          <Hero />
          <RoverTechnologySection />

          {/* Mobile 3D Model - appears below text content */}
          <Mobile3DModel />
        </div>
      </div>

      {/* Normal Full-Width Sections */}
      <div className="w-full">
        <PastAchievements />
        <Sponsors />
        <Gallery />
        {/* <Skills /> */}
        {/* <Encryption /> */}
        {/* <Projects /> */}
      </div>
    </main>
  );
}
