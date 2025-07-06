import casio from "../../../assets/brands/casio.png";
import amazon from "../../../assets/brands/amazon.png";
import moonstar from "../../../assets/brands/moonstar.png";
import star from "../../../assets/brands/start.png";
import startpeople from "../../../assets/brands/start-people 1.png";
import randstad from "../../../assets/brands/randstad.png";
import Marquee from "react-fast-marquee";

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';


const HelpedTeams = () => {
  const teams = [casio, amazon, moonstar, star, startpeople, randstad];
  return (
    <div className="flex flex-col gap-16 justify-center items-center my-20 ">
      <h1 className="text-3xl font-extrabold text-[#03373D]">
        We've helped thousands of sales teams
      </h1>
      <div className="flex">
        <Marquee className="">
          {Array.isArray &&
            teams.map((team, index) => (
              <img className="mr-12 w-40" key={index} src={team} />
            ))}
        </Marquee>
      </div>
      <div className="border-1 w-full border-dashed border-[#03464D]"></div>
      <div className="w-full flex justify-center">
        <Swiper
          effect="cards"
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper w-72 h-96"
        >
          {teams.map((team, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full flex items-center justify-center p-4 bg-[#f9f9f9] rounded-xl shadow-md">
                <img
                  src={team}
                  alt={`brand-${index}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HelpedTeams;
