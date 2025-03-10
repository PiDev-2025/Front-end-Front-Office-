import React from 'react'
import { Fragment } from 'react'
import { Container } from 'react-bootstrap'

const HowItWorks = () => {
    return (
        <Fragment>
            <section>
                <Container>
                    <div className="text-center mb-10">
                        <p className='mb-2 text__16'>HOW IT WORKS</p>
                        <h2 className='font-bold text__48'>Introducing your New Favorite <br className='hidden sm:block' /> Car Parking Experience</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-1 text-center sideLine">
                        <div className="relative px-4">
                            <img src="./../images/box-delivery-package-car-pin-location-group.svg" className='mb-4 mx-auto' alt="" />
                            <h5 className='font-bold text__20 mb-2'>Choose Your Location</h5>
                            <p className='text__14 text-[#525252]'>Find the perfect parking spot near your destination—whether it’s in the city center, near a train station, or at the airport.</p>
                        </div>
                        <div className="relative px-4">
                            <img src="./../images/car-checkmark.svg" className='mb-4 mx-auto' alt="" />
                            <h5 className='font-bold text__20 mb-2'>Select Your Parking Spot</h5>
                            <p className='text__14 text-[#525252]'>Browse available spaces, compare prices, and choose the one that suits your needs.</p>
                        </div>
                        <div className="relative px-4">
                            <img src="./../images/hand-mobile-credit-card-pay-checkmark.svg" className='mb-4 mx-auto' alt="" />
                            <h5 className='font-bold text__20 mb-2'>Confirm Your Booking</h5>
                            <p className='text__14 text-[#525252]'>Secure your spot in just a few clicks—no hassle, no stress.</p>
                        </div>
                        <div className="relative px-4">
                            <img src="./../images/car-key-protection.svg" className='mb-4 mx-auto' alt="" />
                            <h5 className='font-bold text__20 mb-2'>Park & Enjoy</h5>
                            <p className='text__14 text-[#525252]'>Arrive, park, and enjoy your day with peace of mind. Flexible booking, secure locations, and 24/7 assistance included.</p>
                        </div>
                    </div>
                </Container>
            </section>
        </Fragment>
    )
}

export default HowItWorks
