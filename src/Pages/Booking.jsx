import React, { Fragment, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import {
  CarIcon,
  DocumentIcon,
  LocationIcon,
  RightArrowIcon,
  SettingIcon,
  MapIcon,
} from "../Components/Icon/Icon";
import { Link } from "react-router-dom";
import SecLocation from "./../Components/Pages/Step/Location";
import BookNow from "../Components/Pages/Step/BookNow";
import Reservation from "./../Components/Pages/Step/Reservation";
import Confirmation from "./../Components/Pages/Step/Confirmation";
import ParkingLiveView from "../Components/Pages/Step/ParkingLiveView";
import { useLocation } from "react-router-dom";

const Booking = () => {
  const [tabActiveId, setTabActiveId] = useState(1);
  const [selectedParking, setSelectedParking] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const location = useLocation();
  const [reservationData, setReservationData] = useState({
    startDate: new Date(),
    endDate: new Date(Date.now() + 60*60*1000), // +1h
    vehicleType: "",
    // autres champs nécessaires
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get("step");
    if (step) {
      setTabActiveId(parseInt(step));
    }

    if (location.state?.selectedParking) {
      setSelectedParking(location.state.selectedParking);
      console.log("Parking sélectionné :", location.state.selectedParking);
    }
  }, [location]);

  useEffect(() => {
    console.log("Selected Parking updated:", selectedParking);
  }, [selectedParking]);

  useEffect(() => {
    console.log("Selected Spot updated:", selectedSpot);
  }, [selectedSpot]);

  const dataTab = [
    {
      id: 1,
      icon: <LocationIcon color={1 <= tabActiveId ? "#1E19D8" : "#737373"} />,
      title: "Location & Dates",
    },
    {
      id: 2,
      icon: <CarIcon color={2 <= tabActiveId ? "#1E19D8" : "#737373"} />,
      title: "Booking",
    },
    {
      id: 3,
      icon: <MapIcon color={3 <= tabActiveId ? "#1E19D8" : "#737373"} />,
      title: "Select Spot",
    },
    {
      id: 4,
      icon: <SettingIcon color={4 <= tabActiveId ? "#1E19D8" : "#737373"} />,
      title: "Reservation",
    },
    {
      id: 5,
      icon: <DocumentIcon color={5 <= tabActiveId ? "#1E19D8" : "#737373"} />,
      title: "Confirmation",
    },
  ];

  const handleSpotSelection = (spotId) => {
    console.log("Selected spot ID:", spotId);
    setSelectedSpot(spotId);
    setTabActiveId(4); // Move to the reservation step after spot selection
  };

  const showContent = (e) => {
    switch (e) {
      case 1:
        return <SecLocation />;
      case 2:
        return (
          <BookNow
            parkingData={selectedParking}
            onContinue={(parking) => {
              console.log("Received parking data:", parking);
              setSelectedParking(parking);
              setTabActiveId(3);
            }}
          />
        );
      case 3:
        if (!selectedParking || (!selectedParking.id && !selectedParking._id)) {
          console.log(
            "No parking selected or no parking ID available, redirecting to step 2"
          );
          setTabActiveId(2);
          return null;
        }
        console.log(
          "Rendering ParkingLiveView with parking ID:",
          selectedParking.id
        );
        return (
          <ParkingLiveView
            parkingId={selectedParking.id || selectedParking._id}
            onSpotSelected={handleSpotSelection}
          />
        );
      case 4:
        if (!selectedParking) {
          console.log("No parking selected, redirecting to step 2");
          setTabActiveId(2);
          return null;
        }
        if (!selectedSpot) {
          console.log("No spot selected, redirecting to step 3");
          setTabActiveId(3);
          return null;
        }
        if (!selectedParking?.pricing) {
          console.error("Parking pricing missing!", selectedParking);
          setTabActiveId(2);
          return null;
        }
        return (
          <Reservation
            parkingData={{
              ...selectedParking,
              selectedSpotId: selectedSpot,
              pricing: selectedParking.pricing,
            }}
            reservationData={reservationData}
            setReservationData={setReservationData}
            onContinue={(reservationData) => {
              console.log("Reservation completed:", reservationData);
              setTabActiveId(5);
            }}
          />
        );
      case 5:
        return <Confirmation />;
      default:
        return <SecLocation />;
    }
  };

  return (
    <Fragment>
      <section>
        <Container>
          <div className="py-6 border-t border-b border-solid border-[#E5E5E5] w-full mb-10 overflow-auto no-scrollbar">
            <div className="flex items-center justify-center gap-3 w-[920px] lg:w-full">
              {dataTab.map((obj, i) => (
                <Fragment key={obj.id}>
                  <div
                    onClick={() => setTabActiveId(obj.id)}
                    className={
                      "flex items-center gap-2 text__16 px-4 py-2 border border-solid rounded-full cursor-pointer " +
                      (obj.id <= tabActiveId
                        ? "!border-Mblue text-Mblue bg-[#EDEDFC]"
                        : "!border-[#E5E5E5] text-[#737373]")
                    }
                  >
                    {obj.icon} <span>{obj.title}</span>
                  </div>
                  {i + 1 < dataTab.length && (
                    <RightArrowIcon key={`arrow-${i}`} color="#737373" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="mb-6">{showContent(tabActiveId)}</div>
        </Container>
      </section>
    </Fragment>
  );
};

export default Booking;
