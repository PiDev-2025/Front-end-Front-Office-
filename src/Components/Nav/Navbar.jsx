import React from 'react'
import { Container, Form, InputGroup } from 'react-bootstrap'
import { Fragment } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

const Navbar = () => {

    let location = useLocation();
    const [ToogleMenuResponsive, setToogleMenuResponsive] = useState(false);
    const [navabarScroll, setnavabarScroll] = useState(false)

    const statatusSet = () => {
        const urlList = [
            "/", "/about", "/careers", '/blog', 'faq'
        ]
        const status = urlList.some(item => location.pathname === item);
        setnavabarScroll(status)
    }

    const stickNavabr = () => {
        if (window.scrollY > 100) {
            setnavabarScroll(true)
        } else {
            statatusSet()
        }
    }

    useEffect(() => {
        statatusSet()
        window.addEventListener('scroll', stickNavabr);
    }, [location])
    return (
        <Fragment>

            <div className={"fixed h-full w-full bg-white z-[99] pt-[100px] menuMobile " + (ToogleMenuResponsive ? "active" : "")}>
                <Container className='h-full'>
                    <ul className='list-none p-0 m-0 flex items-center flex-wrap gap-4 text-[20px] w-full'>
                        <li className='w-full'>
                            <NavLink to="/" onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className='font-medium text-black'>Home</NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to="/booking" onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className='font-medium text-black'>Park now</NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to="/about" onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className='font-medium text-black'>About</NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to="/faq" onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className='font-medium text-black'>FAQ</NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to="/contact" onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className='font-medium text-black'>Contact</NavLink>
                        </li>
                        <li className='w-full'>
                            <NavLink to="/login" onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className='cursor-pointer font-medium text-[14px] text-Mblack !border-Mblack btnClass hover:bg-Mblack hover:text-Mwhite'>Login</NavLink>
                        </li>
                    </ul>
                </Container>
            </div>

            <div className={'fixed py-4 w-full z-[999] left-0 top-0 ' + (navabarScroll && (ToogleMenuResponsive == false) ? "bg-[#010101] " : "bg-Mwhite")}>
                <Container className='relative flex items-center'>


                    <NavLink to="/" className=''>
                        {
                            <img src={navabarScroll && (ToogleMenuResponsive == false) ? "./../images/Parkini.png" : "./../images/Parkini1.png"} alt="Parkini" style={{width:"50%"}}/>
                        }

                    </NavLink>


                    <ul className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 list-none p-0 m-0 hidden lg:flex items-center gap-4 text__16'>
                        <li>
                            <NavLink to="/" className={'font-medium ' + (navabarScroll && (ToogleMenuResponsive == false) ? "text-Mwhite" : "text-Mblack")}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/booking" className={'font-medium ' + (navabarScroll && (ToogleMenuResponsive == false) ? "text-Mwhite" : "text-Mblack")}>Park now </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className={'font-medium ' + (navabarScroll && (ToogleMenuResponsive == false) ? "text-Mwhite" : "text-Mblack")}>About</NavLink>
                        </li>
                        <li>
                            <NavLink to="/faq" className={'font-medium ' + (navabarScroll && (ToogleMenuResponsive == false) ? "text-Mwhite" : "text-Mblack")}>FAQ</NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact" className={'font-medium ' + (navabarScroll && (ToogleMenuResponsive == false) ? "text-Mwhite" : "text-Mblack")}>Contact</NavLink>
                        </li>
                    </ul>



                    <NavLink to="/login" className="ml-auto hidden lg:block">
                        <div className={'!hidden md:!inline-block cursor-pointer font-medium text__14 ' + (navabarScroll ? "text-Mwhite !border-Mwhite btnClass hover:bg-Mwhite hover:text-Mblack" : "text-Mblack !border-Mblack btnClass hover:bg-Mblack hover:text-Mwhite")}>Login</div>
                    </NavLink>

                    <div onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className={"relative px-1 py-1 barIcon w-[30px] h-[30px] cursor-pointer lg:hidden ml-auto " + (ToogleMenuResponsive ? "active" : "")}>
                        <div className={!navabarScroll ? "!bg-Mblack" : ToogleMenuResponsive ? "!bg-Mblack" : ""}></div>
                        <div className={!navabarScroll ? "!bg-Mblack" : ToogleMenuResponsive ? "!bg-Mblack" : ""}></div>
                        <div className={!navabarScroll ? "!bg-Mblack" : ToogleMenuResponsive ? "!bg-Mblack" : ""}></div>
                    </div>
                </Container>
            </div>
        </Fragment>
    )
}

export default Navbar
