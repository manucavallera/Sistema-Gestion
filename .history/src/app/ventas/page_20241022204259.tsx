// src/app/ventas/page.tsx
"use client";
import { useEffect, useState } from "react";

// Define el tipo para Cliente
type Cliente = {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
};

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
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

    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    };

    fetchVentas();
    fetchClientes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/ventas", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div>
      <h1>Ventas</h1>
      <form onSubmit={handleSubmit}>
        <select name='clienteId' onChange={handleInputChange} required>
          <option value=''>Seleccionar Cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.razonSocial}
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
        <button type='submit'>Agregar Venta</button>
      </form>
      {/* Aquí puedes listar las ventas */}
    </div>
  );
}
