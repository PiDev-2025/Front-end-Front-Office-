import React, { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";
import { jwtDecode } from "jwt-decode";

const EmployeeParkingScanner = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scannerFacing, setScannerFacing] = useState("environment");
  const [isProcessing, setIsProcessing] = useState(false);
  const [employeeParkings, setEmployeeParkings] = useState([]);
  const [scannedData, setScannedData] = useState(null);
  const [updatingSpots, setUpdatingSpots] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);

  // Create a ref to store video stream tracks
  const videoStreamRef = useRef(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token not found");

        const decodedToken = jwtDecode(token);
        const userId =
          decodedToken.id ||
          decodedToken._id ||
          decodedToken.userId ||
          decodedToken.sub;

        setUser({
          ...decodedToken,
          _id: userId,
        });

        if (
          decodedToken.role === "Employee" ||
          decodedToken.role === "Employe"
        ) {
          if (userId) {
            await fetchEmployeeParkings(userId, token);
          } else {
            setError("User ID not found in authentication token");
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    authenticateUser();

    // Return a cleanup function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  // Function to explicitly stop the camera
  const stopCamera = () => {
    setScannerActive(false);

    // Stop all video tracks
    if (videoStreamRef.current) {
      const tracks = videoStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      videoStreamRef.current = null;
    }

    // Additional cleanup for any video elements
    document.querySelectorAll("video").forEach((video) => {
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    });
  };

  const fetchEmployeeParkings = async (employeeId, token) => {
    try {
      const url = `http://localhost:3001/parkings/parkings-by-employee/${employeeId}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Invalid JSON in error response" }));
        throw new Error(
          errorData.message ||
            `Failed to fetch parkings: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setEmployeeParkings(data);
    } catch (err) {
      setError(`Fetch error: ${err.message}`);
    }
  };

  // Hook into QrReader to capture mediaStream
  const handleMediaStream = (mediaStream) => {
    if (mediaStream) {
      videoStreamRef.current = mediaStream.getVideoTracks()[0];
    }
  };

  const handleScan = async (result) => {
    if (result && !isProcessing) {
      setIsProcessing(true);
      try {
        setScannedData(result.text);
        stopCamera(); // Use the new function to properly stop the camera
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const toggleCamera = () => {
    // First stop the current camera
    stopCamera();

    // Then set new facing mode and reactivate after a short delay
    const newFacing = scannerFacing === "environment" ? "user" : "environment";
    setScannerFacing(newFacing);

    setTimeout(() => {
      setScannerActive(true);
    }, 300);
  };

  const resetScanner = () => {
    setScannedData(null);

    // Add a small delay before reactivating the scanner
    setTimeout(() => {
      setScannerActive(true);
    }, 300);
  };

  const updateParkingSpots = async (parkingId, change) => {
    if (!user || updatingSpots) return;

    setUpdatingSpots(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      // Using the endpoint you provided
      const url = `http://localhost:3001/parkings/update-total-spots/${parkingId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ change: change }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Invalid JSON in error response" }));
        throw new Error(
          errorData.message ||
            `Failed to update spots: ${response.status} ${response.statusText}`
        );
      }

      // Refresh parking data
      await fetchEmployeeParkings(user._id, token);
    } catch (err) {
      setError(`Update error: ${err.message}`);
    } finally {
      setUpdatingSpots(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Loading...</h2>
          <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 border text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Parking Scanner</h1>
        <p className="text-gray-600 text-lg">
          Scan QR codes | View assigned parking details
        </p>
        {user && (
          <div className="mt-2 text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-full inline-block">
            Logged in as: {user.name || user.email} ({user.role})
            {user._id && (
              <span className="ml-2 text-xs text-gray-500">ID: {user._id}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* QR Scanner Section */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-xl shadow-md p-5 border">
            <h2 className="text-xl font-bold text-center mb-4">
              {scannedData ? "Scan Result" : "📷 Scan QR Code"}
            </h2>

            {!scannedData ? (
              <>
                <div className="flex justify-center mb-4">
                  <button
                    onClick={toggleCamera}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-lg text-sm"
                    disabled={isProcessing}
                  >
                    Switch Camera (
                    {scannerFacing === "environment" ? "Back" : "Front"})
                  </button>
                </div>

                <div className="relative aspect-video">
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded">
                      <div className="w-10 h-10 border-t-4 border-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  {scannerActive && (
                    <QrReader
                      constraints={{ facingMode: scannerFacing }}
                      onResult={handleScan}
                      onError={(error) => {
                        setError(`Camera error: ${error.message}`);
                      }}
                      onLoad={(instance) => {
                        // This is a workaround to get the mediaStream
                        if (instance && instance.stream) {
                          handleMediaStream(instance.stream);
                        }
                      }}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="font-bold text-lg">Scanned Data:</p>
                  <p className="text-sm text-gray-600 break-all">
                    {scannedData}
                  </p>
                </div>
                <button
                  onClick={resetScanner}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  New Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Parking Details Section */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-xl shadow-md p-5 border h-full">
            <h2 className="text-xl font-bold text-center mb-4">
              🅿️ Assigned Parking Details
            </h2>

            {error && (
              <div className="mt-4 p-4 bg-red-100 rounded-lg text-red-700">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                  }}
                  className="mt-2 text-sm bg-red-200 hover:bg-red-300 text-red-800 px-2 py-1 rounded"
                >
                  Dismiss
                </button>
              </div>
            )}

            {employeeParkings.length > 0 ? (
              employeeParkings.map((parking) => (
                <div key={parking._id} className="mt-4 space-y-4 mb-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-bold">{parking.name}</h3>
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        Available spots: {parking.availableSpots || 0}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          parking.status === "Open" || !parking.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {parking.status || "Open"}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700">{parking.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Location</h4>
                      <p className="text-sm">
                        {parking.location?.address || "N/A"}
                      </p>
                      {parking.location && (
                        <p className="text-xs text-gray-500 mt-1">
                          {parking.location.lat?.toFixed(4) ||
                            parking.location.coordinates?.[1]?.toFixed(4)}
                          ,
                          {parking.location.lng?.toFixed(4) ||
                            parking.location.coordinates?.[0]?.toFixed(4)}
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700">
                        Vehicle Types
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {parking.vehicleTypes?.map((type, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {parking.pricing && (
                    <div>
                      <h4 className="font-semibold text-gray-700">Pricing</h4>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {Object.entries(parking.pricing).map(
                          ([type, price]) => (
                            <div
                              key={type}
                              className="bg-yellow-50 p-2 rounded"
                            >
                              <span className="text-xs text-gray-500 capitalize">
                                {type}
                              </span>
                              <p className="font-bold">${price}/hour</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Spot management buttons */}
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={() => updateParkingSpots(parking._id, -1)}
                      className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50 shadow-lg"
                      disabled={updatingSpots}
                    >
                      <span className="text-2xl">-</span>
                      <span className="text-base">Decrease Spots</span>
                    </button>

                    <button
                      onClick={() => updateParkingSpots(parking._id, 1)}
                      className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-50 shadow-lg"
                      disabled={updatingSpots}
                    >
                      <span className="text-2xl">+</span>
                      <span className="text-base">Increase Spots</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-gray-600">No assigned parkings found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {user ? (
                    <>
                      User ID: {user._id || "Missing"} / Role:{" "}
                      {user.role || "Unknown"}
                    </>
                  ) : (
                    "Not authenticated"
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeParkingScanner;
