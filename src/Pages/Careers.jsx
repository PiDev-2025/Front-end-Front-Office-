import React from 'react'
import { Fragment } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import HeadTitle from '../Components/Pages/HeadTitle'
import { NavLink } from 'react-router-dom'

const Careers = () => {
    return (
        <Fragment>
            <HeadTitle title={"We're looking for great people to join <br /> our growing team"} sub={"CAREERS"} />

            <section>
                <Container>
                    <h3 className='font-bold text__48 mb-8'>Our Openings</h3>

                    <Row>
                        <Col className='mb-4' md={12}>
                            <div className="w-full inline-block p-4 rounded-[16px] border border-solid border-[#F5F5F5]">
                                <h4 className='font-bold text__24 mb-3'>Sr. Software Engineer</h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <img src="./../images/profile-2user.svg" alt="" />
                                        <span className='text__14 text-[#525252]'>1-3 Year</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="./../images/timer.svg" alt="" />
                                        <span className='text__14 text-[#525252]'>Remote</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="./../images/location.svg" alt="" />
                                        <span className='text__14 text-[#525252]'>Remote</span>
                                    </div>
                                </div>
                                <p className='text__16 mb-3'>We are seeking a passionate and skilled Ruby on Rails, backend engineer to join our dynamic team at ConvertKit. You'll play a crucial role in crafting and maintaining ConvertKit's core application logic. From email marketing to visual automation and API products, you'll have the opportunity to contribute to the development of some of our most challenging platform aspects.</p>

                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <div className="px-3 py-2 border border-solid border-[#E5E5E5] rounded-[20px]">Frond-end</div>
                                    <div className="px-3 py-2 border border-solid border-[#E5E5E5] rounded-[20px]">Developer</div>
                                    <div className="px-3 py-2 border border-solid border-[#E5E5E5] rounded-[20px]">Programming</div>
                                </div>

                                <NavLink to="/job/detail" className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass">Apply</NavLink>
                            </div>
                        </Col>
                        <Col className='mb-4' md={12}>
                            <div className="w-full inline-block p-4 rounded-[16px] border border-solid border-[#F5F5F5]">
                                <h4 className='font-bold text__24 mb-3'>Sr. UI/UX Web Designer</h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <img src="./../images/profile-2user.svg" alt="" />
                                        <span className='text__14 text-[#525252]'>1-3 Year</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="./../images/timer.svg" alt="" />
                                        <span className='text__14 text-[#525252]'>Remote</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src="./../images/location.svg" alt="" />
                                        <span className='text__14 text-[#525252]'>Remote</span>
                                    </div>
                                </div>
                                <p className='text__16 mb-3'>We are seeking a passionate and skilled Ruby on Rails, backend engineer to join our dynamic team at ConvertKit. You'll play a crucial role in crafting and maintaining ConvertKit's core application logic. From email marketing to visual automation and API products, you'll have the opportunity to contribute to the development of some of our most challenging platform aspects.</p>

                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <div className="px-3 py-2 border border-solid border-[#E5E5E5] rounded-[20px]">Frond-end</div>
                                    <div className="px-3 py-2 border border-solid border-[#E5E5E5] rounded-[20px]">Developer</div>
                                    <div className="px-3 py-2 border border-solid border-[#E5E5E5] rounded-[20px]">Programming</div>
                                </div>

                                <NavLink to="/job/detail" className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass">Apply</NavLink>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>


            <section>
                <Container>
                    <div className="text-center mb-14">
                        <p className='mb-2 text__16'>Our Values</p>
                        <h2 className='font-bold text__48'>The world's highest rated car <br /> rental experience</h2>
                    </div>

                    <Row className='gap-y-10'>
                        <Col md={6}>
                            <div className="md:flex text-center md:!text-left items-start gap-3">
                                <img src="./../images/heart-checkmark.svg" className='mb-3 md:mb-0 mx-auto' alt="" />
                                <div>
                                    <h5 className='font-bold text__20 mb-2'>Positive</h5>
                                    <p className='text__18 text-[#525252]'>We assume good intentions from others and don’t really care for complaining ourselves because it’s so much easier to have an optimistic approach.</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="md:flex text-center md:!text-left items-start gap-3">
                                <img src="./../images/mb (1).svg" className='mb-3 md:mb-0 mx-auto' alt="" />
                                <div>
                                    <h5 className='font-bold text__20 mb-2'>Book, Arrive & Drive in 2 Minutes</h5>
                                    <p className='text__18 text-[#525252]'>We are relentless in rigor, yet also relentlessly caring, kind and mindful in all areas, with and towards everyone, including the Earth. We take real action.</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="md:flex text-center md:!text-left items-start gap-3">
                                <img src="./../images/mb (2).svg" className='mb-3 md:mb-0 mx-auto' alt="" />
                                <div>
                                    <h5 className='font-bold text__20 mb-2'>You pick up or we deliver</h5>
                                    <p className='text__18 text-[#525252]'>We do things smarter, not harder, with grace and gratitude. When we fail and make mistakes, we take accountability for it, and become better through it.</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="md:flex text-center md:!text-left items-start gap-3">
                                <img src="./../images/mb (4).svg" className='mb-3 md:mb-0 mx-auto' alt="" />
                                <div>
                                    <h5 className='font-bold text__20 mb-2'>World-class, Highest Rated</h5>
                                    <p className='text__18 text-[#525252]'>We take pride in opportunities to share our beliefs, failures, strengths and decisions. For example, this exact sentence was first seen on the overview.</p>
                                </div>
                            </div>
                        </Col>
                        
                    </Row>
                </Container>
            </section>

        </Fragment>
    )
}

export default Careers
