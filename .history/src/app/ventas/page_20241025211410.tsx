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

// Define el tipo para Venta
type Venta = {
  id: number;
  total: number;
  clienteId: number;
};

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]); // Define el tipo Venta[]
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState({
    total: "",
    clienteId: "",
  });

  // Fetch de ventas y clientes cuando se carga el componente
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

  // Manejar el cambio en los inputs del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convertir clienteId a número antes de enviarlo al backend
    const dataToSend = {
      ...formData,
      clienteId: Number(formData.clienteId), // Convertir a número
      total: Number(formData.total), // Asegúrate de que el total sea un número
    };

    const response = await fetch("/api/ventas", {
      method: "POST",
      body: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      console.error("Error al agregar la venta:", await response.text());
      return;
    }

    // Actualizar la lista de ventas con la nueva venta
    const newVenta = await response.json();
    setVentas((prevVentas) => [...prevVentas, newVenta]); // Actualiza correctamente con el tipo Venta[]
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

      {/* Lista de ventas */}
      <ul>
        {ventas.map((venta) => (
          <li key={venta.id}>
            Venta ID: {venta.id}, Cliente ID: {venta.clienteId}, Total:{" "}
            {venta.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
