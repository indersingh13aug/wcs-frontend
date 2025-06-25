import React, { useState } from "react";
import axios from "../services/axios";
import Swal from "sweetalert2";

const ChangePassword = () => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleToggle = (key) => {
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePolicy = (password) => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{}|;:',.<>/?]/.test(password),
  });

  const policy = validatePolicy(form.new_password);
  const allValid = Object.values(policy).every(Boolean);
  const passwordMatch = form.new_password === form.confirm_password;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!allValid) {
      Swal.fire("Error", "New password does not meet the policy", "error");
      return;
    }

    if (!passwordMatch) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      await axios.put("/change-password", {
        current_password: form.current_password,
        new_password: form.new_password,
      });

      Swal.fire("Success", "Password changed successfully", "success");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.detail || "Change failed", "error");
    }
  };

  const strengthLevel = () => {
    const validCount = Object.values(policy).filter(Boolean).length;
    if (validCount <= 2) return "Weak";
    if (validCount === 3 || validCount === 4) return "Moderate";
    return "Strong";
  };

  const strengthColor = {
    Weak: "text-red-500",
    Moderate: "text-yellow-500",
    Strong: "text-green-600",
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Current Password */}
        <div>
          <label className="block font-medium mb-1">Current Password</label>
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              name="current_password"
              value={form.current_password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => handleToggle("current")}
            >
              {show.current ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block font-medium mb-1">New Password</label>
          <div className="relative">
            <input
              type={show.new ? "text" : "password"}
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => handleToggle("new")}
            >
              {show.new ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Strength Meter */}
          {form.new_password && (
            <p className={`mt-1 text-sm font-semibold ${strengthColor[strengthLevel()]}`}>
              Strength: {strengthLevel()}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-medium mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => handleToggle("confirm")}
            >
              {show.confirm ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* Password Policy */}
        <div className="bg-gray-100 border p-3 rounded text-sm">
          <p className="font-semibold mb-1">Password must include:</p>
          <ul className="space-y-1 list-disc pl-6">
            <li className={policy.upper ? "text-green-600" : "text-red-600"}>One uppercase letter (A–Z)</li>
            <li className={policy.lower ? "text-green-600" : "text-red-600"}>One lowercase letter (a–z)</li>
            <li className={policy.digit ? "text-green-600" : "text-red-600"}>One digit (0–9)</li>
            <li className={policy.special ? "text-green-600" : "text-red-600"}>One special character</li>
            <li className={policy.length ? "text-green-600" : "text-red-600"}>At least 8 characters</li>
          </ul>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
