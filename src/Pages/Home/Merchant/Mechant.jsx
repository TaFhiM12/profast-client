import React from 'react';


const Mechant = () => {
    return (
        <div data-aos="zoom-in" className='my-10 p-10 h-[400px] bg-[#03373D] bg-[url(./bg1.png)] bg-top bg-no-repeat rounded-2xl'>
            <div className='bg-[url(./bg2.png)] h-full bg-no-repeat bg-right mr-10'>
                <div className='w-[60%] pt-13 pl-16 flex flex-col gap-4'>
                    <h1 className='text-xl md:text-2xl text-white font-extrabold'>Merchant and Customer Satisfaction is Our First Priority</h1>
                    <p className='text-base-100 text-xs md:text-sm'>We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.</p>
                    <div className='flex gap-5'>
                        <button className='btn btn-primary'>Become a Merchant</button> <button className='btn btn-outline btn-warning'>Earn with Profast Courier</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mechant;