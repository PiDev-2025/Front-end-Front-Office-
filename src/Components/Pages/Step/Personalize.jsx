import React from 'react'
import { Fragment } from 'react'
import { Col, Row } from 'react-bootstrap'
import { CardCarPersonalize } from '../../Card/Card'
import { useState } from 'react'

const Personalize = () => {

    const [toogleSelect, settoogleSelect] = useState("")

    const dataSelect = [
        {
            title: "Minimum Protection",
            desc: "Maximum of €2000 out-of-pocket per damage event, including damage to tyres or windscreen.",
            price: "Included"
        },
        {
            title: "Standard Protection",
            desc: "Maximum of €750 out-of-pocket per damage event, including damage to tyres or windscreen.",
            price: "$20"
        },
        {
            title: "Maximum Protection",
            desc: "Maximum of €85 admin fee per damage event, including damage to tyres or windscreen.",
            price: "$40"
        },
    ]



    const onClickSelectFun = (e) => {
        if (e == toogleSelect) {
            settoogleSelect("")
        } else {
            settoogleSelect(e)
        }
    }

    const onSelectCIrcle = (e) => {
        return <div className={"w-[24px] h-[24px] flex-shrink-0 rounded-full border border-solid flex items-center justify-center " + (toogleSelect == e ? "border-Mblue bg-Mblue" : "border-[#A3A3A3]")}>
            <img src="./../images/check (1).svg" className={toogleSelect == e ? "block" : "hidden"} alt="" />
        </div>
    }

    const cardSelectOption = (e) => {
        return <div onClick={() => onClickSelectFun(e.title)} className={"w-full flex-wrap md:!flex-nowrap gap-y-4 md:gap-y-0 p-4 border border-solid flex justify-between " + (toogleSelect == e.title ? "border-Mblue bg-[#EDEDFC]" : "border-[#E5E5E5] cursor-pointer")}>
            <div className="flex gap-2">
                {onSelectCIrcle(e.title)}
                <div>
                    <h5 className='font-bold text__20 mb-2'>{e.title}</h5>
                    <p className='text__18'>{e.desc}</p>
                </div>
            </div>
            <h5 className='font-bold text__20 ml-8 md:ml-0'>{e.price}</h5>
        </div>
    }


    const [toogleSelectGreener, settoogleSelectGreener] = useState("")

    const dataGreener = [
        {
            title: "Loyalty Cashback",
            desc: "Added to your loyalty account, as a reward for driving without polluting",
            price: "Included"
        },
        {
            title: "550 EcoPoints and 3 trees planted",
            desc: "For every 100 EcoPoints, we plant 1 tree to help restore our ecosystem",
            price: "Included"
        },
    ]

    const onClickGreenerFun = (e) => {
        if (e == toogleSelectGreener) {
            settoogleSelectGreener("")
        } else {
            settoogleSelectGreener(e)
        }
    }

    const onGreenerCircle = (e) => {
        return <div className={"w-[24px] h-[24px] flex-shrink-0 rounded-full border border-solid flex items-center justify-center " + (toogleSelectGreener == e ? "border-Mblue bg-Mblue" : "border-[#A3A3A3]")}>
            <img src="./../images/check (1).svg" className={toogleSelectGreener == e ? "block" : "hidden"} alt="" />
        </div>
    }

    const cardGreener = (e) => {
        return <div onClick={() => onClickGreenerFun(e.title)} className={"w-full flex-wrap md:!flex-nowrap gap-y-4 md:gap-y-0 p-4 border border-solid flex justify-between " + (toogleSelectGreener == e.title ? "border-Mblue bg-[#EDEDFC]" : "border-[#E5E5E5] cursor-pointer")}>
            <div className="flex gap-2">
                {onGreenerCircle(e.title)}
                <div>
                    <h5 className='font-bold text__20 mb-2'>{e.title}</h5>
                    <p className='text__18'>{e.desc}</p>
                </div>
            </div>
            <h5 className='font-bold text__20  ml-8 md:ml-0'>{e.price}</h5>
        </div>
    }
    return (
        <Fragment>
            <h3 className='font-bold text__32 mb-6'>Personalize</h3>

            <Row>
                <Col md={4} className='mb-4 md:mb-0'>
                    <CardCarPersonalize />
                </Col>
                <Col md={8}>
                    <h4 className='font-bold text__20 mb-2'>Protection</h4>
                    <p className='text__18 text-[#525252] mb-3'>Maximum amount you will pay in case of damage</p>

                    <div className="flex flex-wrap gap-3">
                        {
                            dataSelect.map((obj, i) => {
                                return cardSelectOption(obj)
                            })
                        }
                    </div>


                    <h4 className='font-bold text__20 mb-2 mt-4'>Greener World</h4>
                    <p className='text__18 text-[#525252] mb-3'>The more you drive the more you contribute to a greener world</p>

                    <div className="flex flex-wrap gap-3 mb-6">
                        {
                            dataGreener.map((obj, i) => {
                                return cardGreener(obj)
                            })
                        }
                    </div>
                </Col>
            </Row>

        </Fragment>
    )
}

export default Personalize
