import React from 'react'
import { Fragment } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import HeadTitle from '../Components/Pages/HeadTitle'
import GridInfo from '../Components/Pages/GridInfo'
import JoinCarent from '../Components/Pages/JoinCarent'

const About = () => {
    const dataProfile = [
        {
            img: "./../images/pp (2).jpg",
            name: "Sarah Mitchell",
            job: "CEO & FOUNDER"
        },
        {
            img: "./../images/pp (3).jpg",
            name: "John Anderson",
            job: "OPERATIONS MANAGER"
        },
        {
            img: "./../images/pp (4).jpg",
            name: "Emily Parker",
            job: "CUSTOMER SERVICE HEAD"
        },
        {
            img: "./../images/pp (5).jpg",
            name: "Michael Chen",
            job: "TECHNICAL DIRECTOR"
        },
        {
            img: "./../images/pp (6).jpg",
            name: "Lisa Thompson",
            job: "MARKETING MANAGER"
        },
        {
            img: "./../images/pp (7).jpg",
            name: "David Wilson",
            job: "SECURITY HEAD"
        },
        {
            img: "./../images/pp (8).jpg",
            name: "Rachel Barnes",
            job: "FACILITY MANAGER"
        },
        {
            img: "./../images/pp (1).jpg",
            name: "James Cooper",
            job: "FINANCE DIRECTOR"
        },
    ]
    return (
        <Fragment>
            <HeadTitle title={"Your Smart Parking <br /> Solution"} sub={"ABOUT US"} />

            <section>
                <Container>
                    <Row>
                        <Col md={6} className='mb-4 md:my-auto'>
                            <p className='text__18 mb-2'>SMART PARKING</p>
                            <h3 className='font-bold text__48 mb-2'>Efficient Parking Solutions</h3>
                            <p className='text__18 mb-8 text-[#525252]'>Welcome to Parkini, your ultimate parking solution. We make parking simple and stress-free with our user-friendly booking platform. Find and reserve the perfect parking spot in advance, enjoy competitive rates, and experience hassle-free parking. Our dedicated team ensures your parking needs are met with excellence and reliability.</p>

                            <a href='/Booking' className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass cursor-pointer">Book Now</a>
                        </Col>
                        <Col md={6} className='my-auto'>
                            <img src="./../images/fdhfgh.png" alt="" />
                        </Col>
                    </Row>
                </Container>
            </section>

            <section>
                <Container>
                    <p className='text__18 mb-2'>SMART FEATURES</p>
                    <h3 className='font-bold text__48 mb-8'>The Future of Parking <br className='hidden sm:block' /> Is Here</h3>
                    <GridInfo />
                </Container>
            </section>

            <section>
                <Container>
                    <div className="text-center mb-8">
                        <p className='text__18 mb-2'>OUR TEAM</p>
                        <h3 className='font-bold text__48'>Experience & Excellence <br /> At Your Service</h3>
                    </div>

                    <Row className='gap-y-4'>
                        {
                            dataProfile.map((obj) => {
                                return <Col className='col-6' lg={3}>
                                    <div className="w-full border border-solid border-[#E5E5E5] p-2 sm:p-4">
                                        <div className="w-full h-[150px] sm:h-[250px] bg-[#FAFAFA] mb-3">
                                            <img src={obj.img} className='w-full h-full object-cover' alt="" />
                                        </div>

                                        <div className="text-center">
                                            <h5 className='font-bold text__20 mb-2'>{obj.name}</h5>
                                            <p className='uppercase text__16 text-[#525252]'>{obj.job}</p>
                                        </div>
                                    </div>
                                </Col>
                            })
                        }

                    </Row>


                </Container>
            </section>


            <section>
                <Container>
                    <p className='text__18 mb-2'>KEY FEATURES</p>
                    <h3 className='font-bold text__48 mb-8'>Smart Parking Features <br /> For Your Convenience</h3>

                    <Row className='gap-y-4'>
                        <Col md={6}>
                            <div className="flex items-center gap-2 px-4 py-3 border border-solid border-[#E5E5E5]">
                                <img src="./../images/mb (3).svg" className='w-[40px] h-[40px]' alt="" />
                                <h5 className='font-bold text__20'>24/7 Secure Parking</h5>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="flex items-center gap-2 px-4 py-3 border border-solid border-[#E5E5E5]">
                                <img src="./../images/mb (1).svg" className='w-[40px] h-[40px]' alt="" />
                                <h5 className='font-bold text__20'>Quick Online Booking</h5>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="flex items-center gap-2 px-4 py-3 border border-solid border-[#E5E5E5]">
                                <img src="./../images/mb (2).svg" className='w-[40px] h-[40px]' alt="" />
                                <h5 className='font-bold text__20'>Flexible Payment Options</h5>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="flex items-center gap-2 px-4 py-3 border border-solid border-[#E5E5E5]">
                                <img src="./../images/mb (4).svg" className='w-[40px] h-[40px]' alt="" />
                                <h5 className='font-bold text__20'>Premium Customer Support</h5>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </section>

            <JoinCarent />
        </Fragment>
    )
}

export default About
