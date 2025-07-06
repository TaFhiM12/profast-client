import React from 'react';

import bookingIcon from '../../../assets/bookingIcon.png'

const HowItWorks = () => {
    return (
        <div>
            <h1 className='text-3xl font-extrabold mb-6 text-[#03373D]'>How it Works</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                <div className='bg-white rounded-2xl flex flex-col gap-4 py-10 px-5 shadow-lg'>
                    <img className='w-12' src={bookingIcon} alt="" />
                    <h2 className='font-bold text-xl text-[#03373D]'>Booking Pick & Drop</h2>
                    <p className=''>From personal packages to business shipments — we deliver on time, every time.</p>
                </div>
                <div className='bg-white rounded-2xl p-4 flex flex-col gap-4 py-10 px-5 shadow-lg'>
                    <img className='w-12' src={bookingIcon} alt="" />
                    <h2 className='font-bold text-xl text-[#03373D]'>Cash On Delivery</h2>
                    <p>From personal packages to business shipments — we deliver on time, every time.</p>
                </div>
                <div className='bg-white rounded-2xl p-4 flex flex-col gap-4 py-10 px-5 shadow-lg'>
                    <img className='w-12' src={bookingIcon} alt="" />
                    <h2 className='font-bold text-xl text-[#03373D]'>Delivery Hub</h2>
                    <p>From personal packages to business shipments — we deliver on time, every time.</p>
                </div>
                <div className='bg-white rounded-2xl p-4 flex flex-col gap-4 py-10 px-5 shadow-lg'>
                    <img className='w-12' src={bookingIcon} alt="" />
                    <h2 className='font-bold text-xl text-[#03373D]'>Booking SME & Corporate</h2>
                    <p>From personal packages to business shipments — we deliver on time, every time.</p>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;