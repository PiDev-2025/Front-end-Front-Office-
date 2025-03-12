import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Select from "react-select";

const vehicleOptions = [
  {
    value: "Moto",
    label: "Moto",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765730/moto_xdypx2.png",
  },
  {
    value: "Citadine",
    label: "Citadine",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-ville_ocwbob.png",
  },
  {
    value: "Berline / Petit SUV",
    label: "Berline / Petit SUV",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/wagon-salon_bj2j1s.png",
  },
  {
    value: "Familiale / Grand SUV",
    label: "Familiale / Grand SUV",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-familiale_rmgclg.png",
  },
  {
    value: "Utilitaire",
    label: "Utilitaire",
    image:
      "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-livraison_nodnzh.png",
  },
];

const customOption = ({ data, innerRef, innerProps }) => (
  <div
    ref={innerRef}
    {...innerProps}
    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
  >
    <img src={data.image} alt={data.label} className="w-8 h-5 mr-3" />
    <span>{data.label}</span>
  </div>
);

const generatePassword = async () => {
  try {
    const response = await axios.get(
      "https://www.random.org/passwords/?num=1&len=16&format=plain&rnd=new"
    );

    if (response.status === 200) {
      return response.data.trim();
    } else {
      alert("Failed to generate password.");
      return "";
    }
  } catch (error) {
    console.error("Error generating password:", error);
    alert("An error occurred. Please try again later.");
    return "";
  }
};

const validatePassword = (password) => {
  const minLength = /.{8,}/;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasNumber = /[0-9]/;

  if (!minLength.test(password)) {
    return "Le mot de passe doit contenir au moins 8 caractères.";
  }
  if (!hasUpperCase.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule.";
  }
  if (!hasLowerCase.test(password)) {
    return "Le mot de passe doit contenir au moins une minuscule.";
  }
  if (!hasNumber.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre.";
  }

  return "";
};

const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token"); // Assure-toi que le token est stocké ici
    if (!token) throw new Error("No token found");

    const response = await fetch("http://localhost:3001/User/userProfile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch user");

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
};

const updateUserProfile = async (userData, token, image, password) => {
  try {
    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("role", userData.role);


    

    // Vérifier si vehicleType est défini avant de l'ajouter
    if (userData.vehicleType) {
      formData.append("vehicleType", userData.vehicleType);
    }

    if (password) formData.append("password", password);

    const response = await fetch("http://localhost:3001/User/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to update user profile");

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return null;
  }
};


const validatePhoneNumber = (phone) => {
  // Expression régulière pour un numéro tunisien (ex: +216 XX XXX XXX)
  const phonePattern = /^(2|3|4|5|7|9)\d{7}$/;
  return phonePattern.test(phone);
};

const Profile = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null); // Pour gérer l'image
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    vehicleType: "",
    password: "",
    confirmPassword: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(
    user?.vehicleType
      ? vehicleOptions.find((option) => option.value === user.vehicleType) || null
      : null
  );
  

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserProfile();
      if (data) {
        setUser(data);
        setUserData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          vehicleType: data.vehicleType,
          password: "",
          confirmPassword: "", // Initialiser le mot de passe vide pour le formulaire
        });
      }
    };

    fetchUser();
  }, []);

  const handleVehicleChange = (selectedOption) => {
    setSelectedVehicle(selectedOption);
    setUser((prevUser) => ({ ...prevUser, vehicleType: selectedOption.value }));
  };

  useEffect(() => {
    if (userData.password) {
      setPasswordError(validatePassword(userData.password));
    } else {
      setPasswordError("");
    }

    if (userData.confirmPassword) {
      if (userData.password !== userData.confirmPassword) {
        setConfirmPasswordError("Les mots de passe ne correspondent pas !");
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
    }
  }, [userData.password, userData.confirmPassword]);

  const handleGeneratePassword = async () => {
    const newPassword = await generatePassword();
    if (newPassword) {
      setUserData({
        ...userData,
        password: newPassword,
        confirmPassword: newPassword,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Affiche l'aperçu en temps réel
    }
  };
  useEffect(() => {
    if (user?.vehicleType) {
      const existingOption = vehicleOptions.find(
        (option) => option.value === user.vehicleType
      );
      setSelectedVehicle(existingOption || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dataToSend = { ...user };

    if (user.role !== "Driver") {
      delete dataToSend.vehicleType; // Ne pas envoyer vehicleType si ce n'est pas un Driver
    }

    // Validation du téléphone avant l'envoi
    if (!validatePhoneNumber(userData.phone)) {
      setPhoneError("Phone number must be valid (ex: +216 2X XXX XXX).");
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    // Sinon, on peut continuer avec la mise à jour
    setPhoneError(""); // Effacer l'erreur si le numéro est valide

    const token = localStorage.getItem("token");
    const updatedUser = await updateUserProfile(
      userData,
      token,
      image,
      userData.password
    );

    if (updatedUser) {
      setUser(updatedUser.user);
      alert("Profile updated successfully!");
    }
  };

  const handleFileClick = () => {
    document.getElementById("file-input").click(); // Simuler un clic sur l'input file
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-10">
      <div className="w-full max-w-7xl grid grid-cols-3 gap-10">
        {/* Formulaire */}
        <div className="col-span-2 bg-white shadow-lg rounded-lg p-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            My Account
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {[
              {
                label: "Name",
                type: "text",
                value: userData.name,
                key: "name",
              },
              {
                label: "Email",
                type: "email",
                value: userData.email,
                key: "email",
              },
              {
                label: "Phone Number",
                type: "text",
                value: userData.phone,
                key: "phone",
                error: phoneError,
              },
              {
                label: "Role",
                type: "text",
                value: userData.role,
                key: "role",
                readOnly: true,
              },
            ].map(({ label, type, value, key, error, readOnly }) => (
              <div key={key} className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white"
                  value={value}
                  onChange={(e) =>
                    setUserData({ ...userData, [key]: e.target.value })
                  }
                  readOnly={readOnly}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            ))}
            {user.role === "Driver" && (
              <div className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium mb-1">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <Select
                  options={vehicleOptions}
                  value={selectedVehicle}
                  onChange={handleVehicleChange}
                  components={{ Option: customOption }}
                  className="w-full"
                />
              </div>
            )}
            {[
              {
                label: "Password",
                key: "password",
                visible: passwordVisible,
                setVisible: setPasswordVisible,
                error: passwordError,
              },
              {
                label: "Confirm Password",
                key: "confirmPassword",
                visible: confirmPasswordVisible,
                setVisible: setConfirmPasswordVisible,
                error: confirmPasswordError,
              },
            ].map(({ label, key, visible, setVisible, error }) => (
              <div key={key} className="flex flex-col col-span-2">
                <label className="text-gray-700 font-medium mb-1 flex items-center">
                  {label} <span className="text-red-500 ml-1">*</span>
                  <span
                    className="ml-2 cursor-pointer"
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                  </span>
                </label>
                <div className="flex">
                  <input
                    type={visible ? "text" : "password"}
                    name={key}
                    className="w-full p-3 border rounded-lg"
                    value={userData[key]}
                    onChange={handleChange}
                    placeholder={label}
                  />
                  {key === "password" && (
                    <button
                      type="button"
                      className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 shadow-md"
                      onClick={handleGeneratePassword}
                    >
                      Generate
                    </button>
                  )}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            ))}
            <div className="flex justify-end col-span-2 mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        {/* Carte de Profil */}
        <div className="relative flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-80 h-96 self-start translate-x-16">
          <img
            src={
              previewImage ||
              user.image ||
              "https://res.cloudinary.com/dpcyppzpw/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1740761212/profile-user-icon_h3njnr.jpg"
            }
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-white shadow-lg mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
          <button
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-900 shadow-md"
            onClick={handleFileClick}
          >
            Upload Image
          </button>
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;