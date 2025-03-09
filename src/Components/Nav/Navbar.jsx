import React, { useState, useEffect,useContext  } from "react";
import { Container } from "react-bootstrap";
import { Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from '../../AuthContext';
const Navbar = () => {
  const location = useLocation();
  const [ToogleMenuResponsive, setToogleMenuResponsive] = useState(false);
  const [navabarScroll, setnavabarScroll] = useState(false);

  const { user, login, logout } = useContext(AuthContext);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      login(token);
    }
  }, [login]);

  // Logout function
  const handleLogout = () => {
    logout();
  
    // Optionally, redirect to the login page or homepage
    window.location.href = "/login"; // or you can use navigate() if using react-router-dom
  };

  // Navbar background color change
  useEffect(() => {
    const statatusSet = () => {
      const urlList = ["/", "/about", "/careers", "/blog", "/faq"];
      const status = urlList.some((item) => location.pathname === item);
      setnavabarScroll(status);
    };

    const stickNavabr = () => {
      if (window.scrollY > 100) {
        setnavabarScroll(true);
      } else {
        statatusSet();
      }
    };

    statatusSet();
    window.addEventListener("scroll", stickNavabr);
  }, [location]);

  return (
    <Fragment>
      {/* Responsive Menu */}
      <div className={"fixed h-full w-full bg-white z-[99] pt-[100px] menuMobile " + (ToogleMenuResponsive ? "active" : "")}>
        <Container className="h-full">
          <ul className="list-none p-0 m-0 flex items-center flex-wrap gap-4 text-[20px] w-full">
            <li className="w-full"><NavLink to="/" onClick={() => setToogleMenuResponsive(false)} className="font-medium text-black">Home</NavLink></li>
            <li className="w-full"><NavLink to="/booking" onClick={() => setToogleMenuResponsive(false)} className="font-medium text-black">Park now</NavLink></li>
            <li className="w-full"><NavLink to="/about" onClick={() => setToogleMenuResponsive(false)} className="font-medium text-black">About</NavLink></li>
            <li className="w-full"><NavLink to="/faq" onClick={() => setToogleMenuResponsive(false)} className="font-medium text-black">FAQ</NavLink></li>
            <li className="w-full"><NavLink to="/contact" onClick={() => setToogleMenuResponsive(false)} className="font-medium text-black">Contact</NavLink></li>
            <li className="w-full"><NavLink to="/ownerAddPaking" onClick={() => setToogleMenuResponsive(false)} className="font-medium text-black">Parking</NavLink></li>

            {/* Show Logout or Login Button */}
            <li className="w-full">
              {user ? (
                <button onClick={handleLogout} className="cursor-pointer font-medium text-[14px] text-red-500">Logout</button>
              ) : (
                <NavLink to="/login" onClick={() => setToogleMenuResponsive(false)} className="cursor-pointer font-medium text-[14px] text-Mblack !border-Mblack btnClass hover:bg-Mblack hover:text-Mwhite">Login</NavLink>
              )}
            </li>
          </ul>
        </Container>
      </div>

      {/* Navbar */}
      <div className={'fixed py-4 w-full z-[999] left-0 top-0 ' + (navabarScroll && !ToogleMenuResponsive ? "bg-[#010101]" : "bg-Mwhite")}>
        <Container className="relative flex items-center">
          {/* Logo */}
          <NavLink to="/" className="">
            <img src={navabarScroll && !ToogleMenuResponsive ? "./../images/Parkini.png" : "./../images/Parkini1.png"} alt="Parkini" style={{ width: "30%" }} />
          </NavLink>

          {/* Navbar Links */}
          <ul className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 list-none p-0 m-0 hidden lg:flex items-center gap-4 text__16">
            <li><NavLink to="/" className={navabarScroll && !ToogleMenuResponsive ? "text-Mwhite" : "text-Mblack"}>Home</NavLink></li>
            <li><NavLink to="/booking" className={navabarScroll && !ToogleMenuResponsive ? "text-Mwhite" : "text-Mblack"}>Park now</NavLink></li>
            <li><NavLink to="/about" className={navabarScroll && !ToogleMenuResponsive ? "text-Mwhite" : "text-Mblack"}>About</NavLink></li>
            <li><NavLink to="/faq" className={navabarScroll && !ToogleMenuResponsive ? "text-Mwhite" : "text-Mblack"}>FAQ</NavLink></li>
            <li><NavLink to="/contact" className={navabarScroll && !ToogleMenuResponsive ? "text-Mwhite" : "text-Mblack"}>Contact</NavLink></li>
            <li><NavLink to="/ownerAddPaking" className={navabarScroll && !ToogleMenuResponsive ? "text-Mwhite" : "text-Mblack"}>Add Parking</NavLink></li>
          </ul>

          {/* Show User Name or Login Button */}
          <div className="ml-auto hidden lg:block">
            {user ? (
              <div className="flex items-center gap-3">
                <NavLink to="/profile" className="cursor-pointer">
                <span className={navabarScroll && !ToogleMenuResponsive ? "text-Mwhite" : "text-Mblack"}>{user.name || user.email}</span>
                </NavLink>
                <button onClick={handleLogout} className={navabarScroll && !ToogleMenuResponsive ? "text-Mwhite text-red-500 cursor-pointer font-medium" : "text-Mblack text-red-500 cursor-pointer font-medium"}>Logout</button>
              </div>
            ) : (
                <NavLink to="/login" className="ml-auto hidden lg:block">
                <div className={'!hidden md:!inline-block cursor-pointer font-medium text__14 ' + (navabarScroll ? "text-Mwhite !border-Mwhite btnClass hover:bg-Mwhite hover:text-Mblack" : "text-Mblack !border-Mblack btnClass hover:bg-Mblack hover:text-Mwhite")}>Login</div>
            </NavLink>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)} className={"relative px-1 py-1 barIcon w-[30px] h-[30px] cursor-pointer lg:hidden ml-auto " + (ToogleMenuResponsive ? "active" : "")}>
            <div className={!navabarScroll ? "!bg-Mblack" : ToogleMenuResponsive ? "!bg-Mblack" : ""}></div>
            <div className={!navabarScroll ? "!bg-Mblack" : ToogleMenuResponsive ? "!bg-Mblack" : ""}></div>
            <div className={!navabarScroll ? "!bg-Mblack" : ToogleMenuResponsive ? "!bg-Mblack" : ""}></div>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Navbar;
