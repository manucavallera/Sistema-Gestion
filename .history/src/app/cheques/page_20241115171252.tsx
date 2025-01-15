import { useEffect, useState } from "react";

const PaginaCheques = () => {
  const [numeroCheque, setNumeroCheque] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [banco, setBanco] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [cheques, setCheques] = useState([]);
  const [error, setError] = useState("");

  // Obtener cheques al montar el componente
  useEffect(() => {
    const obtenerCheques = async () => {
      try {
        const respuesta = await fetch("/api/cheques"); // Ajusta el endpoint de la API según sea necesario
        const datos = await respuesta.json();
        setCheques(datos);
      } catch (err) {
        console.error("Error al obtener los cheques:", err);
      }
    };

    obtenerCheques();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const datosCheque = {
      numero: numeroCheque,
      monto: parseFloat(monto),
      fechaEmision: fechaEmision,
      fechaVencimiento: fechaVencimiento,
      clienteId: clienteId || null,
      proveedorId: proveedorId || null,
      banco: banco,
      sucursal: sucursal,
    };

    try {
      const respuesta = await fetch("/api/cheques", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosCheque),
      });

      if (!respuesta.ok) {
        const datosError = await respuesta.json();
        setError(datosError.message);
        return;
      }

      const nuevoCheque = await respuesta.json();
      setCheques((prev) => [...prev, nuevoCheque]);
      // Reiniciar el formulario
      setNumeroCheque("");
      setMonto("");
      setFechaEmision("");
      setFechaVencimiento("");
      setClienteId("");
      setProveedorId("");
      setBanco("");
      setSucursal("");
      setError("");
    } catch (err) {
      console.error("Error al crear el cheque:", err);
      setError("Error al crear el cheque");
    }
  };

  return (
    <div>
      <h1>Gestión de Cheques</h1>
      <form onSubmit={manejarEnvio}>
        <input
          type='text'
          placeholder='Número de Cheque'
          value={numeroCheque}
          onChange={(e) => setNumeroCheque(e.target.value)}
          required
        />
        <input
          type='number'
          placeholder='Monto'
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
        <input
          type='date'
          placeholder='Fecha de Emisión'
          value={fechaEmision}
          onChange={(e) => setFechaEmision(e.target.value)}
          required
        />
        <input
          type='date'
          placeholder='Fecha de Vencimiento'
          value={fechaVencimiento}
          onChange={(e) => setFechaVencimiento(e.target.value)}
          required
        />
        <input
          type='text'
          placeholder='ID del Cliente (opcional)'
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />
        <input
          type='text'
          placeholder='ID del Proveedor (opcional)'
          value={proveedorId}
          onChange={(e) => setProveedorId(e.target.value)}
        />
        <input
          type='text'
          placeholder='Banco'
          value={banco}
          onChange={(e) => setBanco(e.target.value)}
        />
        <input
          type='text'
          placeholder='Sucursal'
          value={sucursal}
          onChange={(e) => setSucursal(e.target.value)}
        />
        <button type='submit'>Agregar Cheque</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>Lista de Cheques</h2>
      <ul>
        {cheques.map((cheque) => (
          <li key={cheque.id}>
            {cheque.numero} - {cheque.monto} - {cheque.fechaEmision.toString()}{" "}
            - {cheque.fechaVencimiento.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaginaCheques;
