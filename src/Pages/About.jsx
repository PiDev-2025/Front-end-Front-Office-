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
            name: "Lindsey Siphron",
            job: "CHIEF VISIONARY"
        },
        {
            img: "./../images/pp (3).jpg",
            name: "Kaylynn Baptista",
            job: "KING OF SIGNALS"
        },
        {
            img: "./../images/pp (4).jpg",
            name: "Desirae Dokidis",
            job: "OPERATIONS NINJA"
        },
        {
            img: "./../images/pp (5).jpg",
            name: "Corey Westervelt",
            job: "THE ACTION TAKER"
        },
        {
            img: "./../images/pp (6).jpg",
            name: "Kierra Lipshutz",
            job: "FRONT-END WIZARD"
        },
        {
            img: "./../images/pp (7).jpg",
            name: "Desirae Culhane",
            job: "BACKEND PILOT"
        },
        {
            img: "./../images/pp (8).jpg",
            name: "Jaylon Septimus",
            job: "THE ELECTRIC AVENGER"
        },
        {
            img: "./../images/pp (1).jpg",
            name: "Miracle Kenter",
            job: "LORD OF WHEELS"
        },
    ]
    return (
        <Fragment>
            <HeadTitle title={"Your Ultimate Car Rental <br /> Destination"} sub={"ABOUT US"} />

            <section>
                <Container>
                    <Row>
                        <Col md={6} className='mb-4 md:my-auto'>
                            <p className='text__18 mb-2'>GREENER WORLD</p>
                            <h3 className='font-bold text__48 mb-2'>Wheels on the Go</h3>
                            <p className='text__18 mb-8 text-[#525252]'>Welcome to our premier car rental website, where adventure meets convenience. Find the perfect wheels for your journey with our wide selection of top-notch vehicles. Whether it's a road trip, business travel, or just cruising in style, we've got you covered. Enjoy hassle-free booking, competitive rates, and exceptional customer service. Get ready to hit the road and make unforgettable memories with our reliable car rental services. Your next adventure starts here!</p>

                            <a href='#!' className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass cursor-pointer">Book a Car</a>
                        </Col>
                        <Col md={6} className='my-auto'>
                            <img src="./../images/fdhfgh.png" alt="" />
                        </Col>
                    </Row>
                </Container>
            </section>

            <section>
                <Container>
                    <p className='text__18 mb-2'>ON-DEMAND, ALL-ELECTRIC</p>
                    <h3 className='font-bold text__48 mb-8'>The Future of Car rental <br className='hidden sm:block' /> Is Here</h3>
                    <GridInfo />
                </Container>
            </section>

            <section>
                <Container>
                    <div className="text-center mb-8">
                        <p className='text__18 mb-2'>CARENT TEAM</p>
                        <h3 className='font-bold text__48'>Magic and Dedication <br /> Right Here</h3>
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
                    <p className='text__18 mb-2'>ELECTRIC CAR</p>
                    <h3 className='font-bold text__48 mb-8'>Car rental experience <br /> of the future</h3>

                    <Row className='gap-y-4'>
                        <Col md={6}>
                            <div className="flex items-center gap-2 px-4 py-3 border border-solid border-[#E5E5E5]">
                                <img src="./../images/mb (3).svg" className='w-[40px] h-[40px]' alt="" />
                                <h5 className='font-bold text__20'>All-electric. Charging Included.</h5>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="flex items-center gap-2 px-4 py-3 border border-solid border-[#E5E5E5]">
                                <img src="./../images/mb (1).svg" className='w-[40px] h-[40px]' alt="" />
                                <h5 className='font-bold text__20'>Book, Arrive & Drive in 2 Minutes</h5>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="flex items-center gap-2 px-4 py-3 border border-solid border-[#E5E5E5]">
                                <img src="./../images/mb (2).svg" className='w-[40px] h-[40px]' alt="" />
                                <h5 className='font-bold text__20'>You pick up or we deliver</h5>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="flex items-center gap-2 px-4 py-3 border border-solid border-[#E5E5E5]">
                                <img src="./../images/mb (4).svg" className='w-[40px] h-[40px]' alt="" />
                                <h5 className='font-bold text__20'>World-class, Highest Rated</h5>
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
