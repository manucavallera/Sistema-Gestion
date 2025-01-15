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

// Define la interfaz para un cliente
interface Cliente {
  id: string; // o number, dependiendo de cómo manejes los IDs
  razonSocial: string;
}

// Define la interfaz para un proveedor
interface Proveedor {
  id: string; // o number, dependiendo de cómo manejes los IDs
  razonSocial: string;
}
const PaginaCheques = () => {
  const [numeroCheque, setNumeroCheque] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [banco, setBanco] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [error, setError] = useState("");
  const [editingCheque, setEditingCheque] = useState<Cheque | null>(null);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [proveedorId, setProveedorId] = useState<string | null>(null);

  // Tipamos el estado de clientes y proveedores
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  // Obtener cheques, clientes y proveedores al montar el componente
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

    const obtenerClientes = async () => {
      try {
        const respuesta = await fetch("/api/clientes");
        const datos: Cliente[] = await respuesta.json();
        setClientes(datos);
      } catch (err) {
        console.error("Error al obtener los clientes:", err);
      }
    };

    const obtenerProveedores = async () => {
      try {
        const respuesta = await fetch("/api/proveedores");
        const datos: Proveedor[] = await respuesta.json();
        setProveedores(datos);
      } catch (err) {
        console.error("Error al obtener los proveedores:", err);
      }
    };

    obtenerCheques();
    obtenerClientes();
    obtenerProveedores();
  }, []);
  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const datosCheque: Omit<Cheque, "id"> = {
      numero: numeroCheque,
      monto: parseFloat(monto),
      fechaEmision: fechaEmision,
      fechaVencimiento: fechaVencimiento,
      clienteId: clienteId,
      proveedorId: proveedorId,
      banco: banco,
      sucursal: sucursal,
    };

    try {
      const respuesta = editingCheque
        ? await fetch(`/api/cheques/${editingCheque.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosCheque),
          })
        : await fetch("/api/cheques", {
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
      setCheques((prev) => {
        if (editingCheque) {
          return prev.map((cheque) =>
            cheque.id === nuevoCheque.id ? nuevoCheque : cheque
          );
        }
        return [...prev, nuevoCheque];
      });
      // Reiniciar el formulario
      reiniciarFormulario();
    } catch (err) {
      console.error("Error al crear o editar el cheque:", err);
      setError("Error al crear o editar el cheque");
    }
  };

  const reiniciarFormulario = () => {
    setNumeroCheque("");
    setMonto("");
    setFechaEmision("");
    setFechaVencimiento("");
    setBanco("");
    setSucursal("");
    setError("");
    setEditingCheque(null);
    setClienteId(null);
    setProveedorId(null);
  };
  const eliminarCheque = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cheque?")) {
      try {
        const respuesta = await fetch(`/api/cheques/${id}`, {
          method: "DELETE",
        });

        if (!respuesta.ok) {
          const datosError = await respuesta.json();
          setError(datosError.message);
          return;
        }

        setCheques((prev) => prev.filter((cheque) => cheque.id !== id));
      } catch (err) {
        console.error("Error al eliminar el cheque:", err);
        setError("Error al eliminar el cheque");
      }
    }
  };

  const editarCheque = (cheque: Cheque) => {
    setNumeroCheque(cheque.numero);
    setMonto(cheque.monto.toString());
    setFechaEmision(cheque.fechaEmision);
    setFechaVencimiento(cheque.fechaVencimiento);
    setClienteId(cheque.clienteId || null);
    setProveedorId(cheque.proveedorId || null);
    setBanco(cheque.banco);
    setSucursal(cheque.sucursal);
    setEditingCheque(cheque);
  };
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Cheques</h1>
      <form onSubmit={manejarEnvio} className='mb-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <input
            type='text'
            name='numeroCheque'
            placeholder='Número de Cheque'
            value={numeroCheque}
            onChange={(e) => setNumeroCheque(e.target.value)}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='number'
            name='monto'
            placeholder='Monto'
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='date'
            name='fechaEmision'
            placeholder='Fecha de Emisión'
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.target.value)}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='date'
            name='fechaVencimiento'
            placeholder='Fecha de Vencimiento'
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            className='border border-gray-300 rounded p-2'
            required
          />

          {/* Selección de Cliente */}
          <select
            name='clienteId'
            value={clienteId || ""}
            onChange={(e) => setClienteId(e.target.value)}
            className='border border-gray-300 rounded p-2'
            required
          >
            <option value=''>Seleccionar Cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial}
              </option>
            ))}
          </select>

          {/* Selección de Proveedor */}
          <select
            name='proveedorId'
            value={proveedorId || ""}
            onChange={(e) => setProveedorId(e.target.value)}
            className='border border-gray-300 rounded p-2'
            required
          >
            <option value=''>Seleccionar Proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.razonSocial}
              </option>
            ))}
          </select>

          <input
            type='text'
            name='banco'
            placeholder='Banco'
            value={banco}
            onChange={(e) => setBanco(e.target.value)}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='text'
            name='sucursal'
            placeholder='Sucursal'
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
            className='border border-gray-300 rounded p-2'
            required
          />
        </div>
        {error && <p className='text-red-500'>{error}</p>}
        <button
          type='submit'
          className='bg-green-500 text-white rounded p-2 mt-4'
        >
          {editingCheque ? "Actualizar Cheque" : "Agregar Cheque"}
        </button>
      </form>

      <h2 className='text-xl font-bold mb-2'>Lista de Cheques</h2>
      <ul className='list-disc pl-5'>
        {cheques.map((cheque) => (
          <li key={cheque.id} className='mb-2'>
            <span>{`Número: ${cheque.numero}, Monto: ${cheque.monto}, Cliente ID: ${cheque.clienteId}, Proveedor ID: ${cheque.proveedorId}, Banco: ${cheque.banco}, Sucursal: ${cheque.sucursal}`}</span>
            <button
              onClick={() => editarCheque(cheque)}
              className='bg-yellow-500 text-white rounded p-1 ml-2'
            >
              Editar
            </button>
            <button
              onClick={() => eliminarCheque(cheque.id)}
              className='bg-red-500 text-white rounded p-1 ml-2'
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaginaCheques;
