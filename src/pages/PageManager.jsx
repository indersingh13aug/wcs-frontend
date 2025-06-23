import React, { useEffect, useState } from "react";
import axios from "../services/axios";

const PageManager = () => {
  const [pages, setPages] = useState([]);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");

  const fetchPages = async () => {
    const res = await axios.get("/admin/pages");
    setPages(res.data);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/admin/pages", { name, path });
    setName("");
    setPath("");
    fetchPages();
  };

  return (
    <div>
      <h2>Manage Pages</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Page Name" required />
        <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/path" required />
        <button type="submit">Add</button>
      </form>

      <ul>
        {pages.map((p) => (
          <li key={p.id}>{p.name} - {p.path}</li>
        ))}
      </ul>
    </div>
  );
};

export default PageManager;
