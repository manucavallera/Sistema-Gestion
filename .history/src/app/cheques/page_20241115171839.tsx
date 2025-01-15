"use client";
import { useEffect, useState } from "react";

// Define la interfaz para un cheque
interface Cheque {
  id: number; // o string, dependiendo de cómo manejes los IDs
  numero: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  clienteId?: string | null;
  proveedorId?: string | null;
  banco: string;
  sucursal: string;
}

const PaginaCheques = () => {
  const [numeroCheque, setNumeroCheque] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [banco, setBanco] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [cheques, setCheques] = useState<Cheque[]>([]); // Especifica el tipo aquí
  const [error, setError] = useState("");

  // Obtener cheques al montar el componente
  useEffect(() => {
    const obtenerCheques = async () => {
      try {
        const respuesta = await fetch("/api/cheques"); // Ajusta el endpoint de la API según sea necesario
        const datos: Cheque[] = await respuesta.json(); // Especifica el tipo aquí
        setCheques(datos);
      } catch (err) {
        console.error("Error al obtener los cheques:", err);
      }
    };

    obtenerCheques();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const datosCheque: Omit<Cheque, "id"> = {
      // Omitir el ID ya que lo genera el servidor
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

      const nuevoCheque: Cheque = await respuesta.json(); // Especifica el tipo aquí
      setCheques((prev) => [...prev, nuevoCheque]); // Ahora esto debería funcionar correctamente
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
            Cheque #{cheque.numero}: ${cheque.monto} -{" "}
            {new Date(cheque.fechaEmision).toLocaleDateString()} -{" "}
            {new Date(cheque.fechaVencimiento).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaginaCheques;
