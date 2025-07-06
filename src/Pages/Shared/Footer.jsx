import React from "react";
import ProfastLogo from "./ProfastLogo";
import { Link } from "react-router";
import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer footer-horizontal bg-[#0B0B0B] footer-center footer-bg p-10">
      <aside>
        <div className="text-white">
            <ProfastLogo/>
        </div>
        <p className="text-[#DADADA] text-left md:text-center">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to
          <br />
          business shipments - we deliver on time, every time.
        </p>
        <div className="border-1 border-dashed border-[#03464D] w-full mt-4"></div>
        <p className="flex flex-col md:flex-row md:gap-6 text-[#DADADA] text-xs my-6">
            <Link to='/services'>Services</Link>
            <Link to='/coverage'>Coverage</Link>
            <Link to='/about'>About US</Link>
            <Link to='/pricing'>Pricing</Link>
            <Link to='/blog'>Blog</Link>
            <Link to='/contact'>Contact</Link>
        </p>
        <div className="border-1 border-dashed border-[#03464D] w-full"></div>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Linkedin className="text-blue-400"/>
           <Twitter className="text-white"/>
           <Facebook className="text-white"/>
           <Youtube className="text-white" />
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
