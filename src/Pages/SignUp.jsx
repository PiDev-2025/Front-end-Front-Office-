import React from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const SignUp = () => {
    return (
        <section>
            <Container>
                <Row className='justify-between'>
                    <Col className='mb-4 md:mb-0' md={4}>
                        <h2 className='font-bold text__32 mb-3'>Test!</h2>
                        <p className='text__16 text-[#525252]'>Please enter your credentials to access your account.</p>

                        <div className="my-4">
                            <p className='text__14 mb-2'>Anything your need </p>
                            <h5 className='font-bold text__20 text-Mblue'>Parkini@Parkini.com</h5>
                        </div>

                        <p className='text__14 mb-2'>Social Media</p>
                        <div className="flex items-center gap-2">
                            <a href="#!">
                                <img src="./../images/as (1).svg" alt="" />
                            </a>
                            <a href="#!">
                                <img src="./../images/as (2).svg" alt="" />
                            </a>
                            <a href="#!">
                                <img src="./../images/as (3).svg" alt="" />
                            </a>
                            <a href="#!">
                                <img src="./../images/as (4).svg" alt="" />
                            </a>
                            <a href="#!">
                                <img src="./../images/as (5).svg" alt="" />
                            </a>
                        </div>
                    </Col>
                    <Col md={7}>
                        <Row>
                            <Col className='col-6'>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label className='font-normal text__14 text-[#A3A3A3]'>First Name<span className='text-[#ED544E]'>*</span></Form.Label>
                                    <Form.Control type="email" placeholder="First Name" className='font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]' />
                                </Form.Group>
                            </Col>
                            <Col className='col-6'>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label className='font-normal text__14 text-[#A3A3A3]'>Last Name<span className='text-[#ED544E]'>*</span></Form.Label>
                                    <Form.Control type="text" placeholder="Last Name" className='font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]' />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-normal text__14 text-[#A3A3A3]">Email<span className="text-[#ED544E]"></span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label className="font-normal text__14 text-[#A3A3A3]">Password<span className="text-[#ED544E]"></span></Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label className="font-normal text__14 text-[#A3A3A3]">Verified Password <span className="text-[#ED544E]"></span></Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
                            />
                        </Form.Group>

                     

                        {/* Connect Button with Sign Up Link */}
                        <div className="d-flex justify-content-between">
                            <a href="#!" className="inline-block cursor-pointer text-center font-medium text__16 text-Mwhite !py-[15px] !px-[28px] bg-Mblue !border-Mblue btnClass md:w-auto w-full">Connect</a>

                            {/* Sign Up Link */}
                            <NavLink to="/login" >
                                <a className="text-[blue] text__14 self-center">Sign in </a>
                            </NavLink>
                        </div>
                    </Col>

                </Row>
                <br />
                <br />
                <br />

            </Container>
        </section>
    )
}

export default SignUp
