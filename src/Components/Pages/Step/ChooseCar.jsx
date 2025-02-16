import React from 'react'
import { Fragment } from 'react'
import { CardCar } from '../../Card/Card'
import { Col, Row } from 'react-bootstrap'

const ChooseCar = (props) => {
    const dataCars = [
        {
            img: "./../images/car (4).png",
            name: "Luxury Model Y",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            price: 102,
        },
        {
            img: "./../images/car (5).png",
            name: "Luxury Model Z",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            price: 102,
        },
        {
            img: "./../images/car (6).png",
            name: "Luxury Model M",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            price: 102,
        },
        {
            img: "./../images/car (1).png",
            name: "Luxury Model R",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            price: 102,
        },
        {
            img: "./../images/car (2).png",
            name: "Luxury Model L",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            price: 102,
        },
        {
            img: "./../images/car (3).png",
            name: "Luxury Model S",
            desc: 'Stylish SUV - Smooth driving Comfortable and Spacious',
            price: 102,
        },
    ]
    return (
        <Fragment>
            <h3 className='font-bold text__32 mb-6'>Choose your Best Car</h3>

            <Row className='gap-y-4'>
                {
                    dataCars.map((obj) => {
                        return <Col sm={6} lg={4}>
                            <CardCar data={obj} type="price" selectCar={props.selectCar} setselectCar={(e) => props.setselectCar(e)} />
                        </Col>
                    })
                }

            </Row>
        </Fragment>
    )
}

export default ChooseCar
