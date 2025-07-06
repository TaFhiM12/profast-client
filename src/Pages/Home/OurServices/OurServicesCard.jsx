import React from 'react';

import servic from '../../../assets/service.png'

const OurServicesCard = ({service}) => {
    return (
        <div data-aos="fade-up" className='w-full mx-auto bg-white text-black text-center p-10 flex flex-col justify-center items-center gap-y-5 rounded-2xl hover:bg-[#CAEB66] shadow-lg hover:scale-102 transition duration-700 ease-in-out'>
            <div className='bg-[#EEEDFC] p-4 rounded-full'>
                <img className='w-10' src={servic} alt="" />
            </div>
            <h2 className='text-xl text-[#03373D] font-bold'>{service.title}</h2>
            <p className='text-[#606060]'>{service.description}</p>
        </div>
    );
};

export default OurServicesCard;