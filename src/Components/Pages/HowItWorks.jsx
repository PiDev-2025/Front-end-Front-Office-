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
                        <h2 className='font-bold text__48'>Introducing your New Favorite <br className='hidden sm:block' /> Car Rental Experience</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-rows-1 text-center sideLine">
                        <div className="relative px-4">
                            <img src="./../images/box-delivery-package-car-pin-location-group.svg" className='mb-4 mx-auto' alt="" />
                            <h5 className='font-bold text__20 mb-2'>Pick Location</h5>
                            <p className='text__14 text-[#525252]'>We do things smarter, not harder, with grace and gratitude.</p>
                        </div>
                        <div className="relative px-4">
                            <img src="./../images/car-checkmark.svg" className='mb-4 mx-auto' alt="" />
                            <h5 className='font-bold text__20 mb-2'>Pick Your Car</h5>
                            <p className='text__14 text-[#525252]'>Take a look at availableTeslas, their features& pricing</p>
                        </div>
                        <div className="relative px-4">
                            <img src="./../images/hand-mobile-credit-card-pay-checkmark.svg" className='mb-4 mx-auto' alt="" />
                            <h5 className='font-bold text__20 mb-2'>Confirmation</h5>
                            <p className='text__14 text-[#525252]'>Just verify your driver's license, add a payment methodand you're good to go</p>
                        </div>
                        <div className="relative px-4">
                            <img src="./../images/car-key-protection.svg" className='mb-4 mx-auto' alt="" />
                            <h5 className='font-bold text__20 mb-2'>Start Driving</h5>
                            <p className='text__14 text-[#525252]'>Charging, insurance and roadside assistance are already included in the price</p>
                        </div>
                    </div>
                </Container>
            </section>
        </Fragment>
    )
}

export default HowItWorks
