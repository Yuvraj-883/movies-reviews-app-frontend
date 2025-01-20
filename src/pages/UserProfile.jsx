import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "Unknown",
    email: "Not Provided",
    bio: "No bio available",
    joinedDate: "N/A",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:8000/user/details", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Pass token in Authorization header
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            name: userData?.name || "Unknown",
            email: userData?.email || "Not Provided",
            bio: userData?.bio || "No bio available",
            joinedDate: userData?.joinedDate || "N/A",
          });
        } else {
          console.error("Failed to fetch user details");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="relative max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        {/* Background Circle */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-400 rounded-full opacity-20"></div>
        <div className="absolute top-20 -right-16 w-64 h-64 bg-pink-400 rounded-full opacity-20"></div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          User Profile
        </h2>

        <div className="flex flex-col items-center">
          {/* User Avatar */}
          <div className="w-24 h-24 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>

          {/* User Details */}
          <div className="w-full mb-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Name:</h3>
              <p className="text-gray-600">{user.name}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Email:</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Bio:</h3>
              <p className="text-gray-600">{user.bio}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Joined:</h3>
              <p className="text-gray-600">{user.joinedDate}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex gap-4">
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/update-profile")}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
