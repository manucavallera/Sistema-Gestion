// src/app/compras/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function ComprasPage() {
  const [compras, setCompras] = useState([]);
  const [formData, setFormData] = useState({
    total: "",
    proveedorId: "",
  });

  useEffect(() => {
    const fetchCompras = async () => {
      const response = await fetch("/api/compras");
      const data = await response.json();
      setCompras(data);
    };
    fetchCompras();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/compras", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFormData({ total: "", proveedorId: "" });
    const response = await fetch("/api/compras");
    const data = await response.json();
    setCompras(data);
  };

  return (
    <div>
      <h1>Compras</h1>
      <ul>
        {compras.map((compra: any) => (
          <li key={compra.id}>
            Total: {compra.total} - Proveedor ID: {compra.proveedorId} - Fecha:{" "}
            {new Date(compra.fecha).toLocaleDateString()}
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
          name='proveedorId'
          placeholder='Proveedor ID'
          value={formData.proveedorId}
          onChange={handleInputChange}
        />
        <button type='submit'>Agregar Compra</button>
      </form>
    </div>
  );
}
