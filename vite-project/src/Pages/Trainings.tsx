import React from "react";
import Hero from "../components/Training/Hero";
import Registration from "../components/Training/Registration";
import WhyChooseSection from "../components/Training/WhyChooseSection";
import AvailableTrainings from "../components/Training/AvailableTrainings";

const Trainings = () => {
  return (
    <div>
      <Hero />
      <AvailableTrainings />
      <Registration />
      <WhyChooseSection />
    </div>
  );
};

export default Trainings;
