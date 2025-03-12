import React, { useState } from 'react'
import { Fragment } from 'react'
import { CardCarPersonalize } from '../../Card/Card'
import { Col, Form, Row } from 'react-bootstrap'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const Confirmation = () => {
    const [phone, setPhone] = useState("1")
    return (
        <Fragment>
            <h3 className='font-bold text__32 mb-6'>Confirmation</h3>
            <Row>
                <Col md={4} className='mb-4 md:mb-0'>
                    <CardCarPersonalize type="confirmation" />

                    <div className="mt-4">
                        <h5 className='font-bold text__16 mb-2'>Protection</h5>
                        <ul className='list-none flex flex-wrap gap-2'>
                            <li className='flex items-center gap-2 w-full'>
                                <img src="./../images/ffsdfd.svg" alt="" />
                                <p className='text__16 text-[#525252]'>Minimum Protection</p>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h5 className='font-bold text__16 mb-2'>Greener World</h5>
                        <ul className='list-none flex flex-wrap gap-2'>
                            <li className='flex items-center gap-2 w-full'>
                                <img src="./../images/ffsdfd.svg" alt="" />
                                <p className='text__16 text-[#525252]'>CO2 Cashback into your loyalty account = €8</p>
                            </li>
                            <li className='flex items-center gap-2 w-full'>
                                <img src="./../images/ffsdfd.svg" alt="" />
                                <p className='text__16 text-[#525252]'>6 trees planted learn more</p>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <h5 className='font-bold text__16 mb-2'>Important</h5>
                        <ul className='list-disc pl-4 flex flex-wrap gap-2'>
                            <li className='w-full'>
                                <p className='text__16 text-[#525252]'>Minimum driver age 26 & full driving licence held for a minimum of 2 years</p>
                            </li>
                            <li className='w-full'>
                                <p className='text__16 text-[#525252]'>Pre-rental authorisation of €2000 is required on your card, which will be released upon return of your vehicle</p>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col md={8}>
                    <h4 className='font-bold text__20 mb-3'>Driver Details</h4>
                    <Row>
                        <Col md={6} className='mb-4'>
                            <Form.Group>
                                <Form.Label className="text__14 text-[#A3A3A3]">Phone Number</Form.Label>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                    <div className="inline-block">
                                        <div className="flex items-center bg-Mwhite px-[12px] py-[6px] rounded-full">
                                            <PhoneInput
                                                className="color__black phoneModFiled"
                                                country={'us'}
                                                value={phone}
                                                onChange={(e) => setPhone(e)}
                                            />
                                            <div className="ml-[2rem]">+{phone}</div>
                                        </div>
                                    </div>
                                    <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Phone Number" />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6} className='mb-4'>
                            <Form.Group>
                                <Form.Label className="text__14 text-[#A3A3A3]">Email</Form.Label>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                    <Form.Control type="email" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Email" />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={12} className='mb-4'>
                            <Form.Group>
                                <Form.Label className="text__14 text-[#A3A3A3]">Full Name</Form.Label>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                    <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Full Name" />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={12} className='mb-4'>
                            <Form.Group>
                                <Form.Label className="text__14 text-[#A3A3A3]">Cardholder Name</Form.Label>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                    <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Ex:  San Andreas" />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={12} className='mb-4'>
                            <Form.Group>
                                <Form.Label className="text__14 text-[#A3A3A3]">Card Number</Form.Label>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                    <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Ex:  31111 1111 1111 1111" />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col className='col-4 mb-4'>
                            <Form.Group>
                                <Form.Label className="text__14 text-[#A3A3A3]">Postal Code</Form.Label>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                    <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="123456" />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col className='col-4 mb-4'>
                            <Form.Group>
                                <Form.Label className="text__14 text-[#A3A3A3]">Expiration</Form.Label>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                    <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="MM/YY" />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col className='col-4 mb-4'>
                            <Form.Group>
                                <Form.Label className="text__14 text-[#A3A3A3]">CCV</Form.Label>
                                <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                    <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="123" />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="text-right mt-6">
                        <a href='#!' className="inline-block cursor-pointer font-medium text__16 text-Mwhite !rounded-[24px] !border-Mblue bg-Mblue btnClass cursor-pointer">Confirm</a>
                    </div>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Confirmation
