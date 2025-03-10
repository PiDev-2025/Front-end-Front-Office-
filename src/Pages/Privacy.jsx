import React from 'react'
import { Fragment } from 'react'
import { Col, Container, Form, Pagination, Row } from 'react-bootstrap'

const Privacy = () => {
    return (
        <Fragment>

            <section className='pb-0'>
                <Container>
                    <div className="text-center">
                        <h2 className='font-bold text__48 mb-2'>Privacy Policy</h2>
                        <p className='text__16 text-[#525252]'>Effective Date: November 28, 2023</p>
                    </div>
                </Container>
            </section>

            <section>
                <Container>
                    <Row className='justify-center'>
                        <Col md={10}>
                            <h5 className='font-bold text__18 mb-3'>At [Business Agency Name], we understand the importance of your privacy. This Privacy Policy outlines the type of information we collect, how we use it, and how we protect your personal information. Please read this policy carefully to understand how we collect, use, and disclose information.</h5>

                            <div className="mb-3">
                                <h5 className='font-bold text__18 mb-2'>Information We Collect</h5>
                                <p className='text__16'>We collect various types of information from you when you use our website. This may include personal information such as your name, email address, and phone number. We may also collect non-personal information such as your IP address, browser type, and operating system.</p>
                            </div>
                            <div className="mb-3">
                                <h5 className='font-bold text__18 mb-2'>How We Use Your Information</h5>
                                <p className='text__16'>We may use your personal information to contact you, provide services to you, and to improve our website. We may also use your non-personal information to improve our website, monitor our website usage, and analyze trends.</p>
                            </div>
                            <div className="mb-3">
                                <h5 className='font-bold text__18 mb-2'>Disclosure of Your Information</h5>
                                <p className='text__16'>We may share your personal information with third-party service providers who help us operate our website, provide our services, and fulfill your requests. We may also share your information when required by law or when we believe that disclosure is necessary to protect our rights or the rights of others.</p>
                            </div>
                            <div className="mb-3">
                                <h5 className='font-bold text__18 mb-2'>Security of Your Information</h5>
                                <p className='text__16'>We take reasonable measures to protect your personal information from unauthorized access, disclosure, or misuse. However, we cannot guarantee the security of your information transmitted through the internet.</p>
                            </div>
                            <div className="mb-3">
                                <h5 className='font-bold text__18 mb-2'>Children’s Privacy</h5>
                                <p className='text__16'>Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us and we will remove the information.</p>
                            </div>
                            <div className="mb-3">
                                <h5 className='font-bold text__18 mb-2'>Changes to this Privacy Policy</h5>
                                <p className='text__16'>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the updated policy on our website.</p>
                            </div>
                            <div className="mb-3">
                                <h5 className='font-bold text__18 mb-2'>Contact Us</h5>
                                <p className='text__16'>If you have any questions about this Privacy Policy or our practices, please contact us at [Business Agency Contact Information].</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Fragment>
    )
}

export default Privacy
