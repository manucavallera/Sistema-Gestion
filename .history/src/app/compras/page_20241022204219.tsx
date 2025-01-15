// src/app/compras/page.tsx
"use client";
import { useEffect, useState } from "react";

// Define el tipo para Proveedor
type Proveedor = {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string;
  email?: string;
};

// Define el tipo para Compra
type Compra = {
  id: number;
  fecha: string; // o Date dependiendo de cómo lo manejes
  total: number;
  proveedorId: number;
};

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
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

    const fetchProveedores = async () => {
      const response = await fetch("/api/proveedores");
      const data = await response.json();
      setProveedores(data);
    };

    fetchCompras();
    fetchProveedores();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/compras", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div>
      <h1>Compras</h1>
      <form onSubmit={handleSubmit}>
        <select name='proveedorId' onChange={handleInputChange} required>
          <option value=''>Seleccionar Proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>
              {proveedor.razonSocial}
            </option>
          ))}
        </select>
        <input
          type='number'
          name='total'
          placeholder='Total'
          value={formData.total}
          onChange={handleInputChange}
          required
        />
        <button type='submit'>Agregar Compra</button>
      </form>
      {/* Aquí puedes listar las compras */}
    </div>
  );
}
