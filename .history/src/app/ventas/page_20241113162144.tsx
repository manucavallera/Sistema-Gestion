"use client";
import { useEffect, useState } from "react";

interface Venta {
  id: number;
  fecha: string;
  total: number;
  clienteId: number;
}

const VentasPage = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [clienteId, setClienteId] = useState<number>(0);
  const [clientes, setClientes] = useState<
    { id: number; razonSocial: string }[]
  >([]); // Suponiendo que tienes un modelo Cliente

  useEffect(() => {
    // Cargar las ventas y clientes al montar el componente
    const fetchData = async () => {
      const ventasResponse = await fetch("/api/ventas"); // Cambia esto según tu ruta API
      const clientesResponse = await fetch("/api/clientes"); // Cambia esto según tu ruta API

      const ventasData = await ventasResponse.json();
      const clientesData = await clientesResponse.json();

      setVentas(ventasData.ventas);
      setClientes(clientesData.clientes);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ total, clienteId }),
    });

    if (response.ok) {
      const nuevaVenta = await response.json();
      setVentas((prev) => [...prev, nuevaVenta]); // Agregar la nueva venta a la lista
      setTotal(0); // Resetear el total
      setClienteId(0); // Resetear el cliente
    } else {
      console.error("Error al crear la venta");
    }
  };

  return (
    <div>
      <h1>Ventas</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='total'>Total:</label>
          <input
            type='number'
            id='total'
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label htmlFor='clienteId'>Cliente:</label>
          <select
            id='clienteId'
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            required
          >
            <option value=''>Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial}
              </option>
            ))}
          </select>
        </div>

        <button type='submit'>Crear Venta</button>
      </form>

      <h2>Lista de Ventas</h2>
      <ul>
        {ventas.map((venta) => (
          <li key={venta.id}>
            {venta.fecha} - Total: ${venta.total} - Cliente ID:{" "}
            {venta.clienteId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VentasPage;
