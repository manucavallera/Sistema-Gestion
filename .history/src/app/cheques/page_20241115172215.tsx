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
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [error, setError] = useState("");

  // Obtener cheques al montar el componente
  useEffect(() => {
    const obtenerCheques = async () => {
      try {
        const respuesta = await fetch("/api/cheques");
        const datos: Cheque[] = await respuesta.json();
        setCheques(datos);
      } catch (err) {
        console.error("Error al obtener los cheques:", err);
      }
    };

    obtenerCheques();
  }, []);

  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const datosCheque: Omit<Cheque, 'id'> = {
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

      const nuevoCheque: Cheque = await respuesta.json();
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

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "numeroCheque":
        setNumeroCheque(value);
        break;
      case "monto":
        setMonto(value);
        break;
      case "fechaEmision":
        setFechaEmision(value);
        break;
      case "fechaVencimiento":
        setFechaVencimiento(value);
        break;
      case "clienteId":
        setClienteId(value);
        break;
      case "proveedorId":
        setProveedorId(value);
        break;
      case "banco":
        setBanco(value);
        break;
      case "sucursal":
        setSucursal(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Cheques</h1>
      <form onSubmit={manejarEnvio} className="mb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="numeroCheque"
            placeholder="Número de Cheque"
            value={numeroCheque}
            onChange={manejarCambio}
            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="number"
            name="monto"
            placeholder="Monto"
            value={monto}
            onChange={manejarCambio}
            className="border border-gray-300 rounded            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="date"
            name="fechaEmision"
            placeholder="Fecha de Emisión"
            value={fechaEmision}
            onChange={manejarCambio}
            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="date"
            name="fechaVencimiento"
            placeholder="Fecha de Vencimiento"
            value={fechaVencimiento}
            onChange={manejarCambio}
            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="text"
            name="clienteId"
            placeholder="ID del Cliente"
            value={clienteId}
            onChange={manejarCambio}
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            name="proveedorId"
            placeholder="ID del Proveedor"
            value={proveedorId}
            onChange={manejarCambio}
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            name="banco"
            placeholder="Banco"
            value={banco}
            onChange={manejarCambio}
            className="border border-gray-300 rounded p-2"
            required
          />
          <input
            type="text"
            name="sucursal"
            placeholder="Sucursal"
            value={sucursal}
            onChange={manejarCambio}
            className="border border-gray-300 rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        >
          Agregar Cheque
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <h2 className="text-xl font-semibold mb-2">Lista de Cheques</h2>
      <ul className="space-y-2">
        {cheques.map((cheque) => (
          <li
            key={cheque.id}
            className="border border-gray-300 rounded p-4 flex justify-between items-center"
          >
            <div>
              <p><strong>Número:</strong> {cheque.numero}</p>
              <p><strong>Monto:</strong> ${cheque.monto.toFixed(2)}</p>
              <p><strong>Fecha de Emisión:</strong> {cheque.fechaEmision}</p>
              <p><strong>Fecha de Vencimiento:</strong> {cheque.fechaVencimiento}</p>
              <p><strong>Banco:</strong> {cheque.banco}</p>
              <p><strong>Sucursal:</strong> {cheque.sucursal}</p>
            </div>
            <button className="text-red-500 hover:text-red-700">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaginaCheques;