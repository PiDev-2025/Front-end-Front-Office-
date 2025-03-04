import React, { useEffect, useState } from "react";
import axios from "axios";

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/parkings/parkings") // Assure-toi que l'URL est correcte
      .then(response => {
        setParkings(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des parkings:", error);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Parkings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parkings.map((parking) => (
          <div key={parking._id} className="border rounded-lg p-4 shadow-md bg-white">
            <h2 className="text-xl font-semibold text-green-700">{parking.nameP}</h2>
            <p className="text-gray-600">{parking.location}</p>
            <p className="text-gray-500">Places disponibles: {parking.availableSpots} / {parking.totalSpots}</p>
            <p className="text-gray-700 font-bold">Prix: {parking.pricing.perHour} €/heure</p>
            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">Réserver</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingList;
