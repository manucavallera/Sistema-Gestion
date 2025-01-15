// src/app/ventas/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [formData, setFormData] = useState({
    total: "",
    clienteId: "",
  });

  useEffect(() => {
    const fetchVentas = async () => {
      const response = await fetch("/api/ventas");
      const data = await response.json();
      setVentas(data);
    };
    fetchVentas();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/ventas", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFormData({ total: "", clienteId: "" });
    const response = await fetch("/api/ventas");
    const data = await response.json();
    setVentas(data);
  };

  return (
    <div>
      <h1>Ventas</h1>
      <ul>
        {ventas.map((venta: any) => (
          <li key={venta.id}>
            Total: {venta.total} - Cliente ID: {venta.clienteId} - Fecha:{" "}
            {new Date(venta.fecha).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='total'
          placeholder='Total'
          value={formData.total}
          onChange={handleInputChange}
        />
        <input
          type='text'
          name='clienteId'
          placeholder='Cliente ID'
          value={formData.clienteId}
          onChange={handleInputChange}
        />
        <button type='submit'>Agregar Venta</button>
      </form>
    </div>
  );
}
