import React, { Fragment, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { CardCar } from '../Components/Card/Card'
import HowItWorks from '../Components/Pages/HowItWorks'
import GridInfo from '../Components/Pages/GridInfo'
import { NavLink } from 'react-router-dom'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Homepage = () => {
    const [toogleTab, settoogleTab] = useState("Hourly Rental")

    const dataCars = [
        {
            img: "./../images/car (4).png",
            name: "Luxury Model Y",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (5).png",
            name: "Luxury Model Z",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (6).png",
            name: "Luxury Model M",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (1).png",
            name: "Luxury Model Z",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (2).png",
            name: "Luxury Model L",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
        {
            img: "./../images/car (3).png",
            name: "Luxury Model S",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            detail: [
                "Up to 533km range",
                "Autopilot included",
                "AWD",
            ]
        },
    ]

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    return (
        <Fragment>
            {/* start:hero */}
            <section className='relative overflow-hidden min-h-[calc(100vh_-_88px)] lg:min-h-[calc(100vh_-_98px)] bg-[#010101] flex flex-wrap pb-0'>
                <img src="./../images/img (1).png" className='absolute left-0 top-0 w-full h-full object-cover object-top hidden md:block' alt="" />
                <Container className='relative z-[2] w-full'>
                    <Row>
                        <Col md={6}>
                            <p className='text__18 text-Mgreen mb-2'>CAR RENTAL</p>
                            <h1 className='font-bold text__48 text-Mwhite mb-2'>Discover the Joy of Flexible and Affordable <br className='hidden xl:block' /> Car Rentals</h1>
                            <p className='text__18 text-[#A3A3A3] mb-2'>With our car rental services, you can experience the ultimate <br className='hidden xl:block' /> convenience and freedom of exploring your destination at your <br className='hidden xl:block' /> own pace.</p>
                        </Col>
                    </Row>
                </Container>

                <div className="self-end w-full pt-4 pb-[2rem] relative">
                    <div className="bkdropHead absolute w-full h-full left-0 top-0 hidden md:block"></div>
                    <Container className='relative z-2'>
                        <div className="bg-[#ffffff1f] absolute w-full h-full left-0 top-0 md:hidden block"></div>
                        <div className="p-3 md:p-0 relative z-2">
                            <div className="flex items-center text-center mb-4">
                                <div onClick={() => settoogleTab("Hourly Rental")} className={"py-3 cursor-pointer  md:min-w-[180px] text__16 text-Mwhite w-full md:w-auto " + (toogleTab == "Hourly Rental" ? "border-b border-solid border-[#FFFFFF]" : "opacity-50")}>Hourly Rental</div>
                                <div onClick={() => settoogleTab("Daily Rental")} className={"py-3 cursor-pointer  md:min-w-[180px] text__16 text-Mwhite w-full md:w-auto " + (toogleTab == "Daily Rental" ? "border-b border-solid border-[#FFFFFF]" : "opacity-50")}>Daily Rental</div>
                            </div>
                            {
                                toogleTab == "Hourly Rental" ? <div className="flex gap-4 flex-wrap md:!flex-nowrap">
                                    <div className="flex items-center gap-2 bg-[#ffffff0f] px-3 rounded-[16px] w-full md:w-[50%]">
                                        <img src="./../images/icon.svg" alt="" />
                                        <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mwhite placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Select Location" />
                                    </div>
                                    <div className="flex w-[calc((100%_/_2)_-_1rem)] md:w-auto items-center gap-2 bg-[#ffffff0f] px-3 rounded-[16px]">
                                        <img src="./../images/icon-1.svg" alt="" />
                                        <DatePicker
                                            className='bg-transparent text-Mwhite text__14 font-normal outline-none focus:outline-none'
                                            placeholderText="Pickup Date"
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                        />
                                    </div>
                                    <div className="flex w-[calc((100%_/_2)_-_1rem)] md:w-auto items-center gap-2 bg-[#ffffff0f] px-3 rounded-[16px]">
                                        <img src="./../images/icon-2.svg" alt="" />
                                        <DatePicker
                                            className='bg-transparent text-Mwhite text__14 font-normal outline-none focus:outline-none'
                                            placeholderText="Return Date"
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                        />
                                    </div>
                                    <a href="#!" className="inline-block cursor-pointer font-medium text__14 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass w-full md:w-auto text-center">Search</a>
                                </div> : <div className="flex gap-4 flex-wrap md:!flex-nowrap">
                                    <div className="flex items-center gap-2 bg-[#ffffff0f] px-3 rounded-[16px] w-full md:w-[50%]">
                                        <img src="./../images/icon.svg" alt="" />
                                        <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mwhite placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Select Location" />
                                    </div>
                                    <div className="flex w-[calc((100%_/_2)_-_1rem)] md:w-auto items-center gap-2 bg-[#ffffff0f] px-3 rounded-[16px]">
                                        <img src="./../images/icon-1.svg" alt="" />
                                        <DatePicker
                                            className='bg-transparent text-Mwhite text__14 font-normal outline-none focus:outline-none'
                                            placeholderText="Pickup Date"
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                        />
                                    </div>
                                    <div className="flex w-[calc((100%_/_2)_-_1rem)] md:w-auto items-center gap-2 bg-[#ffffff0f] px-3 rounded-[16px]">
                                        <img src="./../images/icon-2.svg" alt="" />
                                        <DatePicker
                                            className='bg-transparent text-Mwhite text__14 font-normal outline-none focus:outline-none'
                                            placeholderText="Return Date"
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                        />
                                    </div>
                                    <a href="#!" className="inline-block cursor-pointer font-medium text__14 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass w-full md:w-auto text-center">Search</a>
                                </div>
                            }
                        </div>
                    </Container>
                </div>
            </section>
            {/* end:hero */}


            <HowItWorks />


            <section>
                <Container>
                    <div className="text-center mb-10">
                        <h2 className='font-bold text__48'>Our Collections Car</h2>
                    </div>

                    <Row className='gap-y-4'>
                        {
                            dataCars.map((obj) => {
                                return <Col sm={6} lg={4}>
                                    <CardCar data={obj} />
                                </Col>
                            })
                        }

                    </Row>

                </Container>
            </section>


            <section>
                <Container>
                    <Row>
                        <Col md={6} className='md:!order-1 order-2 my-auto'>
                            <p className='text__18 mb-2'>GREENER WORLD</p>
                            <h1 className='font-bold text__48 mb-10'>The more you drive the more you contribute to a greener world</h1>
                            <p className='text__18 text-[#525252] mb-6'>We have partnered with OneTreePlanted to <br /> strengthen our commitment to cleaner air. Earn <br className='hidden lg:block' /> EcoPoints for every rental - 100 EcoPoints earned = <br className='hidden lg:block' /> 1 tree planted on your behalf.</p>
                            <NavLink to="/booking" className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass">Book a Car</NavLink>
                        </Col>
                        <Col md={6} className='order-1 md:!order-2 relative'>
                            <img src="./../images/fgfgfd.png" className='md:max-w-[34rem] lg:max-w-[58rem]  md:-translate-x-[7rem] lg:-translate-x-[12rem] lg:translate-y-[3rem]' alt="" />
                        </Col>
                    </Row>
                </Container>
            </section>


            <section className='pt-0'>
                <Container>
                    <p className='text__18 mb-2'>CARENT</p>
                    <h1 className='font-bold text__48 mb-10'>Rent an electric vehicle <br className='md:block hidden' /> with Carent today</h1>
                    <Row className='mb-8 lg:mb-0'>
                        <Col md={7} className='my-auto relative'>
                            <img src="./../images/sdgsdgd.png" className='xl:max-w-[56rem] xl:-translate-x-[7rem]' alt="" />
                        </Col>
                        <Col md={5} className='my-auto'>
                            <p className='text__18 text-[#525252] mb-6'>The best prices and customer experience along your business or leisure journey. UFODRIVE covers airport rental locations (like our Frankfurt Airport EV Rental Centre) as well as premium city locations (like our Paris EV Rental Hub).</p>
                            <NavLink to="/booking" className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass">Book a Car</NavLink>
                        </Col>
                    </Row>

                    <GridInfo />
                </Container>
            </section>


            <section className='bg-Mgreen pb-0 relative overflow-hidden'>
                <img src="./../images/patern.svg" className='absolute left-0 top-0 w-full h-full object-cover' alt="" />
                <Container className='text-center relative z-2'>
                    <p className='text__18 mb-2'>NEWSLETTER</p>
                    <h2 className='font-bold text__48 mb-8'>Stay up to date on the <br /> latest news</h2>

                    <div className="flex items-center gap-2 justify-center mb-10">
                        <div className="flex items-center gap-2 px-3 w-full sm:w-auto sm:min-w-[335px] border border-solid !border-Mblack rounded-[24px]">
                            <img src="./../images/sms.svg" alt="" />
                            <Form.Control type="text" className='h-[52px] px-0 text__14 !text-Mblack placeholder:text-[#525252] outline-none bg-transparent border-none shadow-none focus:outline-none focus:bg-transparent focus:border-none focus:shadow-none' placeholder="Enter your email address" />
                        </div>
                        <div className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass !py-[14px]">Subscribe</div>
                    </div>

                    <img src="./../images/gfjhfgjfgj.png" className='mx-auto' alt="" />
                </Container>
            </section>
        </Fragment >
    )
}

export default Homepage
