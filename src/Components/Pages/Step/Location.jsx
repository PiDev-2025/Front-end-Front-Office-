import React from 'react'
import { Fragment } from 'react'
import { Col, Form, Row } from 'react-bootstrap'

const Location = () => {
    const TimeList = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
    ]
    return (
        <Fragment>
            <h3 className='font-bold text__32 mb-6'>Location & Dates</h3>

            <img src="./../images/hfghghj.png" className='w-full h-[256px] object-cover mb-8' alt="" />

            <div className="p-8 border border-solid border-[#E5E5E5]">
                <Row>
                    <Col md={6} className='mb-4'>
                        <Form.Group>
                            <Form.Label className="text__14 text-[#A3A3A3]">Pickup Location</Form.Label>
                            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                <img src="./../images/gdfgdfg.svg" alt="" />
                                <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Select Location" />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={6} className='mb-4'>
                        <Form.Group>
                            <Form.Label className="text__14 text-[#A3A3A3]">Return Location</Form.Label>
                            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                <img src="./../images/gdfgdfg.svg" alt="" />
                                <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Select Location" />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={3} className='col-6 mb-4'>
                        <Form.Group>
                            <Form.Label className="text__14 text-[#A3A3A3]">Pickup Date</Form.Label>
                            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                <img src="./../images/datee.svg" alt="" />
                                <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Select Date" />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={3} className='col-6 mb-4'>
                        <Form.Group>
                            <Form.Label className="text__14 text-[#A3A3A3]">Pickup Date</Form.Label>
                            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                <Form.Select className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full'>
                                    {
                                        TimeList.map((obj, i) => {
                                            return <Fragment>
                                                {
                                                    obj < 24 ? <Fragment>
                                                        <option>{obj < 9 ? "0" + obj + ":00" : obj + ":00"}</option>
                                                        <option>{obj < 9 ? "0" + obj + ":30" : obj + ":30"}</option>
                                                    </Fragment> : <option>00:00</option>
                                                }

                                            </Fragment>
                                        })
                                    }
                                </Form.Select>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={3} className='col-6 mb-4'>
                        <Form.Group>
                            <Form.Label className="text__14 text-[#A3A3A3]">Return Date</Form.Label>
                            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                <img src="./../images/datee.svg" alt="" />
                                <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Select Date" />
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={3} className='col-6 mb-4'>
                        <Form.Group>
                            <Form.Label className="text__14 text-[#A3A3A3]">Return Date</Form.Label>
                            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-solid border-[#F5F5F5] px-3 rounded-[16px] w-full">
                                <Form.Control type="text" className='bg-transparent outline-none border-none shadow-none focus:shadow-none focus:bg-transparent focus:outline-none focus:border-none text__14 !text-Mblack placeholder-[#A3A3A3] h-[54px] px-0 w-full' placeholder="Select Date" />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
}

export default Location
