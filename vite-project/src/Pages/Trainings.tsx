import React from "react";
import Hero from "../components/Training/Hero";
import Registration from "../components/Training/Registration";
import WhyChooseSection from "../components/Training/WhyChooseSection";
import Gallery from "../components/Training/Gallery";
import AvailableTrainings from "../components/Training/AvailableTrainings";

const Trainings = () => {
  return (
    <div>
      <Hero />
      <Registration />
      <WhyChooseSection />
      <AvailableTrainings />
      <Gallery />
    </div>
  );
};

export default Trainings;
