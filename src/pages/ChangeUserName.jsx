import React, { useState } from "react";
import axios from '../services/axios';
import Swal from "sweetalert2";

const ChangeUsername = () => {
  const [username, setUsername] = useState("");
  const [policyStatus, setPolicyStatus] = useState({
    length: false,
    allowedChars: false,
    noStartWithUnderscore: false,
    noStartWithDot: false,
  });
  const [isAvailable, setIsAvailable] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("");

  const validateUsername = (value) => {
    const rules = {
      length: value.length >= 5 && value.length <= 20,
      allowedChars: /^[A-Za-z0-9._]+$/.test(value),
      noStartWithUnderscore: !value.startsWith("_"),
      noStartWithDot: !value.startsWith("."),
    };
    setPolicyStatus(rules);
  };

  const handleUsernameChange = async (e) => {
    const val = e.target.value;
    setUsername(val);
    validateUsername(val);

    if (val.length >= 5) {
      try {
        const res = await axios.get(`/check-username?username=${val}`);
        setIsAvailable(res.data.available);
      } catch (err) {
        console.error(err);
        setIsAvailable(false);
      }
    } else {
      setIsAvailable(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allValid = Object.values(policyStatus).every(Boolean);
    if (!allValid) {
      setSubmitStatus("❌ Username does not meet all policies.");
      return;
    }

    if (!isAvailable) {
      setSubmitStatus("❌ Username is already taken.");
      return;
    }

    try {
      // await axios.post("/change-username", { username });
      const token = localStorage.getItem("access_token");
      alert(token);
      await axios.put(
        "/change-username",
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setSubmitStatus("✅ Username changed successfully!");
      Swal.fire("Username Change", "Username changed successfully!", "success");

      setUsername("");
      setIsAvailable(null); // Optional: reset availability
    } catch (err) {
      console.error(err);
      // setSubmitStatus("❌ Failed to update username.");
      Swal.fire("Username Change", "Failed to update username.", "error");
    }
  };

  const getColor = (valid) => (valid ? "green" : "red");

  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded-xl shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4">Change Username</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter new username"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
        />

        <ul className="text-sm mb-4">
          <li style={{ color: getColor(policyStatus.length) }}>
            • 5–20 characters
          </li>
          <li style={{ color: getColor(policyStatus.allowedChars) }}>
            • Only letters, numbers, underscore (_) or dot (.)
          </li>
          <li style={{ color: getColor(policyStatus.noStartWithUnderscore) }}>
            • Cannot start with underscore (_)
          </li>
          <li style={{ color: getColor(policyStatus.noStartWithDot) }}>
            • Cannot start with dot (.)
          </li>
        </ul>

        {isAvailable === false && (
          <p className="text-red-500 text-sm mb-2">Username already exists.</p>
        )}
        {isAvailable === true && (
          <p className="text-green-600 text-sm mb-2">Username is available.</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Change Username
        </button>

        {submitStatus && (
          <p className="mt-3 text-center font-medium text-sm">
            {submitStatus}
          </p>
        )}
      </form>
    </div>
  );
};

export default ChangeUsername;
