import React, { useState, useEffect, useContext } from "react";
import { Container } from "react-bootstrap";
import { Fragment } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../AuthContext";
import {
  NotificationBadge,
  NotificationItem,
  NotificationList,
} from "../../Pages/Notifications/NotificationItem";

const Navbar = () => {
  // État pour les notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const [ToogleMenuResponsive, setToogleMenuResponsive] = useState(false);
  const [navabarScroll, setnavabarScroll] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const { user, login, logout } = useContext(AuthContext);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      login(token);

      // Decode token to get user role
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [login]);

  // Logout function
  const handleLogout = () => {
    logout();
    setUserRole(null);
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
    return () => window.removeEventListener("scroll", stickNavabr);
  }, [location]);

  // Function to check if Scan QR should be visible
  const shouldShowScanQR = () => {
    return userRole === "Employe";
  };

  // Function to check if Parking should be visible
  const shouldShowParking = () => {
    return userRole === "Owner";
  };

  // Function to check if Notifications should be visible
  const shouldShowNotifications = () => {
    return userRole === "Owner" || userRole === "Employe";
  };

  return (
    <Fragment>
      {/* Responsive Menu */}
      <div
        className={
          "fixed h-full w-full bg-white z-[99] pt-[100px] menuMobile " +
          (ToogleMenuResponsive ? "active" : "")
        }
      >
        <Container className="h-full">
          <ul className="list-none p-0 m-0 flex items-center flex-wrap gap-4 text-[20px] w-full">
            <li className="w-full">
              <NavLink
                to="/"
                onClick={() => setToogleMenuResponsive(false)}
                className="font-medium text-black"
              >
                Home
              </NavLink>
            </li>
            <li className="w-full">
              <NavLink
                to="/booking"
                onClick={() => setToogleMenuResponsive(false)}
                className="font-medium text-black"
              >
                Park now
              </NavLink>
            </li>
            <li className="w-full">
              <NavLink
                to="/about"
                onClick={() => setToogleMenuResponsive(false)}
                className="font-medium text-black"
              >
                About
              </NavLink>
            </li>
            <li className="w-full">
              <NavLink
                to="/faq"
                onClick={() => setToogleMenuResponsive(false)}
                className="font-medium text-black"
              >
                FAQ
              </NavLink>
            </li>
            <li className="w-full">
              <NavLink
                to="/contact"
                onClick={() => setToogleMenuResponsive(false)}
                className="font-medium text-black"
              >
                Contact
              </NavLink>
            </li>

            {/* Show Parking only for Owner role in mobile menu */}
            {shouldShowParking() && (
              <li className="w-full">
                <NavLink
                  to="/my-parkings"
                  onClick={() => setToogleMenuResponsive(false)}
                  className="font-medium text-black"
                >
                  Parking
                </NavLink>
              </li>
            )}

            {/* Show Scan QR only for Employee role in mobile menu */}
            {shouldShowScanQR() && (
              <li className="w-full">
                <NavLink
                  to="/ScanQr"
                  onClick={() => setToogleMenuResponsive(false)}
                  className="font-medium text-black"
                >
                  Scan Qr
                </NavLink>
              </li>
            )}

            {/* Réservations link for mobile menu */}
            {user && (
              <li className="w-full">
                <NavLink
                  to="/mes-reservations"
                  onClick={() => setToogleMenuResponsive(false)}
                  className="font-medium text-black flex items-center"
                >
                  Réservations
                </NavLink>
              </li>
            )}

            {/* Notifications for mobile - only show if user is Owner or Employee */}
            {user && shouldShowNotifications() && (
              <li className="w-full">
                <div 
                  className="font-medium text-black flex items-center cursor-pointer"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  Notifications <NotificationBadge />
                </div>
                {showNotifications && (
                  <div className="mt-2 w-full bg-white rounded-lg shadow-xl z-50">
                    <NotificationList />
                  </div>
                )}
              </li>
            )}

            {/* Show Logout or Login Button */}
            <li className="w-full">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="cursor-pointer font-medium text-[14px] text-red-500"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setToogleMenuResponsive(false)}
                  className="cursor-pointer font-medium text-[14px] text-Mblack !border-Mblack btnClass hover:bg-Mblack hover:text-Mwhite"
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </Container>
      </div>

      {/* Navbar */}
      <div
        className={
          "fixed py-4 w-full z-[999] left-0 top-0 " +
          (navabarScroll && !ToogleMenuResponsive
            ? "bg-[#010101]"
            : "bg-Mwhite")
        }
      >
        <Container className="relative flex items-center">
          {/* Logo */}
          <NavLink to="/" className="">
            <img
              src={
                navabarScroll && !ToogleMenuResponsive
                  ? "./../images/Parkini.png"
                  : "./../images/Parkini1.png"
              }
              alt="Parkini"
              style={{ width: "30%" }}
            />
          </NavLink>

          {/* Navbar Links */}
          <ul className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 list-none p-0 m-0 hidden lg:flex items-center gap-4 text__16">
            <li>
              <NavLink
                to="/"
                className={
                  navabarScroll && !ToogleMenuResponsive
                    ? "text-Mwhite"
                    : "text-Mblack"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/booking"
                className={
                  navabarScroll && !ToogleMenuResponsive
                    ? "text-Mwhite"
                    : "text-Mblack"
                }
              >
                Park now
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={
                  navabarScroll && !ToogleMenuResponsive
                    ? "text-Mwhite"
                    : "text-Mblack"
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                className={
                  navabarScroll && !ToogleMenuResponsive
                    ? "text-Mwhite"
                    : "text-Mblack"
                }
              >
                FAQ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={
                  navabarScroll && !ToogleMenuResponsive
                    ? "text-Mwhite"
                    : "text-Mblack"
                }
              >
                Contact
              </NavLink>
            </li>

            {/* Show Parking only for Owner role in desktop menu */}
            {shouldShowParking() && (
              <li>
                <NavLink
                  to="/my-parkings"
                  className={
                    navabarScroll && !ToogleMenuResponsive
                      ? "text-Mwhite"
                      : "text-Mblack"
                  }
                >
                  Parking
                </NavLink>
              </li>
            )}

            {/* Show Scan QR only for Employee role in desktop menu */}
            {shouldShowScanQR() && (
              <li>
                <NavLink
                  to="/ScanQr"
                  className={
                    navabarScroll && !ToogleMenuResponsive
                      ? "text-Mwhite"
                      : "text-Mblack"
                  }
                >
                  Scan Qr
                </NavLink>
              </li>
            )}

            {/* Ajouter le lien Mes réservations (visible seulement si l'utilisateur est connecté) */}
            {user && (
              <li>
                <NavLink
                  to="/mes-reservations"
                  className={
                    navabarScroll && !ToogleMenuResponsive
                      ? "text-Mwhite"
                      : "text-Mblack"
                  }
                >
                  <span className="flex items-center">
                    <span className="mr-1"></span>
                    Réservations
                  </span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Show User Name or Login Button */}
          <div className="ml-auto hidden lg:block">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Composant de notifications - desktop - only show if user is Owner or Employee */}
                {shouldShowNotifications() && (
                  <div className="relative">
                    <NotificationBadge
                      onClick={() => setShowNotifications(!showNotifications)}
                    />
                    {/* Panneau de notifications (s'affiche au clic) */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50">
                        <NotificationList />
                      </div>
                    )}
                  </div>
                )}

                <NavLink to="/profile" className="cursor-pointer">
                  <span
                    className={
                      navabarScroll && !ToogleMenuResponsive
                        ? "text-Mwhite"
                        : "text-Mblack"
                    }
                  >
                    {user.name || user.email}
                  </span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className={
                    navabarScroll && !ToogleMenuResponsive
                      ? "text-Mwhite text-red-500 cursor-pointer font-medium"
                      : "text-Mblack text-red-500 cursor-pointer font-medium"
                  }
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="ml-auto hidden lg:block">
                <div
                  className={
                    "!hidden md:!inline-block cursor-pointer font-medium text__14 " +
                    (navabarScroll
                      ? "text-Mwhite !border-Mwhite btnClass hover:bg-Mwhite hover:text-Mblack"
                      : "text-Mblack !border-Mblack btnClass hover:bg-Mblack hover:text-Mwhite")
                  }
                >
                  Login
                </div>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div
            onClick={() => setToogleMenuResponsive(!ToogleMenuResponsive)}
            className={
              "relative px-1 py-1 barIcon w-[30px] h-[30px] cursor-pointer lg:hidden ml-auto " +
              (ToogleMenuResponsive ? "active" : "")
            }
          >
            <div
              className={
                !navabarScroll
                  ? "!bg-Mblack"
                  : ToogleMenuResponsive
                  ? "!bg-Mblack"
                  : ""
              }
            ></div>
            <div
              className={
                !navabarScroll
                  ? "!bg-Mblack"
                  : ToogleMenuResponsive
                  ? "!bg-Mblack"
                  : ""
              }
            ></div>
            <div
              className={
                !navabarScroll
                  ? "!bg-Mblack"
                  : ToogleMenuResponsive
                  ? "!bg-Mblack"
                  : ""
              }
            ></div>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Navbar;