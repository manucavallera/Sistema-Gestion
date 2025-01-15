import React, { useState, useEffect } from "react";

const VentasPage = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  const manejarEnvio = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para registrar la venta
    const nuevaVenta = {
      clienteId: clienteSeleccionado /* otros datos de la venta */,
    };
    setVentas([...ventas, nuevaVenta]);
  };

  return (
    <div>
      <h1>Registrar Venta</h1>
      <form onSubmit={manejarEnvio}>
        <label>
          Selecciona un Cliente:
          <select
            value={clienteSeleccionado}
            onChange={(e) => setClienteSeleccionado(e.target.value)}
          >
            <option value=''>Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </label>
        <button type='submit'>Registrar Venta</button>
      </form>
      <h2>Ventas Registradas</h2>
      <ul>
        {ventas.map((venta, index) => (
          <li key={index}>Venta a Cliente ID: {venta.clienteId}</li>
        ))}
      </ul>
    </div>
  );
};

export default VentasPage;
