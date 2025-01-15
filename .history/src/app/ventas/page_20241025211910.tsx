"use client";
import { useEffect, useState } from "react";

// Definir el tipo para Cliente
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

  // Obtener las ventas y clientes al cargar el componente
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

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newVenta = await response.json();
        setVentas((prevVentas) => [...prevVentas, newVenta]);
        setFormData({ total: "", clienteId: "" }); // Limpiar formulario
      } else {
        console.error("Error al agregar la venta");
      }
    } catch (error) {
      console.error("Error al agregar la venta:", error);
    }
  };

  return (
    <div>
      <h1>Ventas</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='clienteId'>Cliente:</label>
          <select
            id='clienteId'
            name='clienteId'
            value={formData.clienteId}
            onChange={handleInputChange}
            required
          >
            <option value=''>Seleccionar Cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor='total'>Total:</label>
          <input
            type='number'
            id='total'
            name='total'
            value={formData.total}
            onChange={handleInputChange}
            placeholder='Total'
            required
          />
        </div>

        <button type='submit'>Agregar Venta</button>
      </form>

      <h2>Lista de Ventas</h2>
      <ul>
        {ventas.map((venta, index) => (
          <li key={index}>
            Cliente ID: {venta.clienteId}, Total: {venta.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
