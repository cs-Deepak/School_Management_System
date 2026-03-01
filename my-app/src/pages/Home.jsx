import Hero from "../components/Hero";
import StatBar from "../components/StatBar";
import About from "../components/About";
import AcademicPrograms from "../components/AcademicPrograms";
import FacilitiesSection from "../components/FacilitiesSection";
import NoticeBoard from "../components/NoticeBoard";
import Testimonials from "../components/Testimonials";
import AdmissionCTA from "../components/AdmissionCTA";
import Showcase from "../components/Showcase";

const Home = () => {
  return (
    <>
      <Hero />
      <StatBar />
      <div style={{ marginTop: "100px" }}>
        <About />
      </div>
      <AcademicPrograms />
      <FacilitiesSection />
      <NoticeBoard />
      <Testimonials />
      <AdmissionCTA />
      <Showcase />
    </>
  );
};

export default Home;
