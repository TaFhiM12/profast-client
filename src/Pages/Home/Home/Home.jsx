import React from 'react';
import Banner from '../Banner/Banner';
import HowItWorks from '../HowItWorks/HowItWorks';
import OurServices from '../OurServices/OurServices';
import HelpedTeams from '../HelpedTeams/HelpedTeams';
import Uniqueness from '../Uniqueness/Uniqueness';
import Mechant from '../Merchant/Mechant';
import CardSlider from '../../CustomerReviews/CustomerReviews';
import FAQ from '../FAQ/FAQ';


const Home = () => {
    return (
        <div className=''>
            {/* banner section */}
            <section>
                <Banner/>
            </section>

            {/* how it works section */}
            <section className='md:w-11/12 mx-auto my-10'>
                <HowItWorks/>
            </section>

            {/* our services section */}
            <section>
                <OurServices/>
            </section>

            {/* helped teams section */}
            <section>
                <HelpedTeams/>
            </section>

            {/* Uniqueness section */}
            <Uniqueness/>

            {/* merchant section */}
            <Mechant/>

            {/* review section  */}
            <CardSlider/>

            {/* faq section */}
            <FAQ/>
        </div>
    );
};

export default Home;