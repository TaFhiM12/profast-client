import React from 'react';

import tracking from '../../../assets/live-tracking.png'
import delivery from '../../../assets/safe-delivery.png'


const Uniqueness = () => {
    return (
        <div className='my-20 flex flex-col gap-10 p-4'>
            <div data-aos="fade-right" className='w-full rounded-2xl flex flex-col md:flex-row gap-20  bg-white shadow-lg py-10 px-10'>
                <img src={tracking} alt="" />
                <div className='border-r-1 border-dashed border-[#03464D]'></div>
                <div className='flex flex-col justify-center md:w-[60%]'>
                    <h1 className='text-[#03373D] font-bold'>Live Parcel Tracking</h1>
                    <p className='text-[#606060]'>Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.</p>
                </div>
            </div>
            <div data-aos="fade-left" className='w-full rounded-2xl flex flex-col md:flex-row gap-20 bg-white shadow-lg py-10 px-10 '>
                <img className='' src={delivery} alt="" />
                <div className='border-r-1 border-dashed border-[#03464D] bg-amber shadow-lg'></div>
                <div className='flex flex-col justify-center'>
                    <h1 className='text-[#03373D] font-bold'>100% Safe Delivery</h1>
                    <p className='text-[#606060]'>We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.</p>
                </div>
            </div>
            <div data-aos="fade-right" className='w-full rounded-2xl flex flex-col md:flex-row gap-20 bg-white shadow-lg py-10 px-10 '>
                <img src={delivery} alt="" />
                <div className='border-r-1 border-dashed border-[#03464D] bg-amber shadow-lg'></div>
                <div className='flex flex-col justify-center'>
                    <h1 className='text-[#03373D] font-bold'>24/7 Call Center Support</h1>
                    <p className='text-[#606060]'>Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.</p>
                </div>
            </div>
            <div className='border-1 border-dashed border-[#03464D] mt-16'></div>
        </div>
    );
};

export default Uniqueness;