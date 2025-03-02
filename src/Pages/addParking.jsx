import React, { useState, Fragment } from "react";
import { Container } from "react-bootstrap";
import axios from 'axios';
import { CarIcon, LocationIcon, RightArrowIcon } from "../Components/Icon/Icon";

import Step1AddParking from "./../Components/Pages/Step/Step1AddParking";
import AddPhoto from "./../Components/Pages/Step/Step2AddParking";

const ParkingForm = () => {
  const [tabActiveId, settabActiveId] = useState(1);

  const [formData, setFormData] = useState({
    location: {
      lat: 36.8065,
      lng: 10.1815,
    },
    address: "",
    totalSpots: "",
    rates: [],
    characteristics: [],
    vehicleTypes: [],
    images: {
      face1: null,
      face2: null,
      face3: null,
      face4: null,
    },
  });
  

  const dataTab = [
    { id: 1, icon: <LocationIcon />, title: "Important Informations" },
    { id: 2, icon: <CarIcon />, title: "Film your parking" },
  ];


  const showContent = () => {
    switch (tabActiveId) {
      case 1:
        return <Step1AddParking formData={formData} setFormData={setFormData} />;
      case 2:
        return <AddPhoto formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <section>
        <Container>
          {/* Barre de progression */}
          <div className="py-6 border-t border-b border-gray-300 w-full mb-10 overflow-auto no-scrollbar">
            <div className="flex items-center justify-center gap-3 w-[920px] lg:w-full">
              {dataTab.map((obj, i) => (
                <Fragment key={obj.id}>
                  <div
                    onClick={() => settabActiveId(obj.id)}
                    className={`flex items-center gap-2 text-lg font-semibold px-4 py-2 border rounded-full cursor-pointer transition duration-200
                      ${
                        obj.id <= tabActiveId
                          ? "border-blue-500 text-blue-500 bg-blue-100"
                          : "border-gray-400 text-gray-500 bg-white hover:bg-gray-200"
                      }`}
                  >
                    {obj.icon} <span>{obj.title}</span>
                  </div>
                  {i + 1 < dataTab.length && <RightArrowIcon color="#737373" />}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Contenu du formulaire */}
          <div className="mb-6">{showContent()}</div>

          {/* Debug: Afficher la valeur de tabActiveId */}
          {console.log("tabActiveId:", tabActiveId)}

          {/* Boutons de navigation */}
          <div className="flex items-center justify-between w-full">
            {/* Bouton "Back" */}
            {tabActiveId > 1 && (
              <button
                onClick={() => {
                  settabActiveId(tabActiveId - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                 className="px-6 py-3 rounded-lg bg-gray-500 !text-white !font-medium !border !border-gray-700 hover:!bg-gray-700 transition duration-200 !block"
              >
                Back
              </button>
            )}

            {/* Espace pour aligner le bouton "Continue" à droite */}
            <div className="flex-1"></div>

            {/* Bouton "Continue" */}
            {tabActiveId < 2 && (
              <button
                onClick={() => {
                  settabActiveId(tabActiveId + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-6 py-3 rounded-lg bg-black text-white font-medium border border-gray-900 hover:bg-gray-800 transition duration-200"
              >
                Continue
              </button>
            )}
          </div>
        </Container>
      </section>
    </Fragment>
  );
};

export default ParkingForm;
