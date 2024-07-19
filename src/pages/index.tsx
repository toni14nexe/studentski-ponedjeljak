"use client";

import { useEffect, useState } from "react";
import { Assembly } from "@/types/assembly";
import { LoadingOverlay, Button, Group, Box } from "@mantine/core";

const Home = () => {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    pregnant: "",
    note: "",
    members: "",
  });

  useEffect(() => {
    fetch("/api/assemblies")
      .then((response) => response.json())
      .then((data) => {
        setAssemblies(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/assemblies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, members: JSON.parse(form.members) }),
    });

    if (response.ok) {
      const newAssembly = await response.json();
      setAssemblies((prev) => [...prev, newAssembly]);
      setForm({ date: "", pregnant: "", note: "", members: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading)
    return (
      <LoadingOverlay
        visible={true}
        overlayProps={{ backgroundOpacity: 0.5, color: "black" }}
        loaderProps={{ type: "bars" }}
      />
    );

  return (
    <div>
      <h1>Assemblies</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Date"
          required
        />
        <input
          name="pregnant"
          value={form.pregnant}
          onChange={handleChange}
          placeholder="Pregnant"
          required
        />
        <input
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Note"
        />
        <input
          name="members"
          value={form.members}
          onChange={handleChange}
          placeholder="Members (JSON array string)"
          required
        />
        <button type="submit">Add Assembly</button>
      </form>
      <ul>
        {assemblies.map((assembly) => (
          <li key={assembly.id}>
            <p>Date: {assembly.date}</p>
            <p>Pregnant: {assembly.pregnant}</p>
            <p>Note: {assembly.note}</p>
            <p>
              Members:{" "}
              {JSON.parse(assembly.members as unknown as string)
                .map((member: { fullname: string }) => member.fullname)
                .join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
