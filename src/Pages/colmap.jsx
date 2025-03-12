import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ParkingImages() {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Remplace l'URL par celle de ton API
    axios.get('/api/parkings/images') 
      .then(response => {
        setImageUrls(response.data.images);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }, []);

  return (
    <div>
      {imageUrls.length > 0 ? (
        imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Parking Image ${index + 1}`} />
        ))
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
}

export default ParkingImages;
