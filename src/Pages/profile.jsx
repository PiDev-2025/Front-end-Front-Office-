import React from "react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Phone } from "lucide-react";

const ProfilePage = () => {
    const [user, setUser] = useState({ name: "", email: "", role: "", image: "",Phone: "",vehiculeType: ""});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setUser({
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
                vehiculeType: decoded.vehicleType,
                Phone: decoded.phone,

                image: "", // Default image placeholder
            });
        }
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="w-96 p-6 shadow-lg rounded-xl bg-white text-center">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                    alt="User Profile"
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-500 object-cover"
                />

                <h2 className="text-xl font-semibold">{user.name || "Unknown User"}</h2>
                <p className="text-gray-500">{user.email || "No Email Provided"}</p>
                
                <p className="text-gray-500"> {user.role || "No Role Assigned"}</p>
                <p className="text-gray-500">{user.vehiculeType || "No Vehicule Type Provided"}</p>
                <Phone size={24} className="inline-block mt-2" />
             
                <span className="inline-block mt-2 px-4 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-full">
                {user.Phone || "No Phone Provided"}
                </span>
                <button className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
