import axios from "axios";
import React, { useEffect, useState } from "react";
import OurServicesCard from "./OurServicesCard";

const OurServices = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    axios("./services.json")
      .then((res) => setServices(res.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="my-10 bg-[#03373D] text-white px-4 py-10">
      <div className="text-center w-[70%] mx-auto mb-6">
        <h1 className="text-3xl font-extrabold mb-6">Our Services</h1>
        <p className="text-[#DADADA]">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero
          hassle. From personal packages to business shipments — we deliver on
          time, every time.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:p-4">
        {
            Array.isArray(services) &&
            services.map((service , index) => <OurServicesCard key={index}  service={service}/>) 
        }
      </div>
    </div>
  );
};

export default OurServices;
