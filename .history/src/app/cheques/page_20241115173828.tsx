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
  const [razonSocialCliente, setRazonSocialCliente] = useState("");
  const [razonSocialProveedor, setRazonSocialProveedor] = useState("");
  const [banco, setBanco] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [error, setError] = useState("");
  const [editingCheque, setEditingCheque] = useState<Cheque | null>(null);

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

    const datosCheque: Omit<Cheque, "id"> = {
      numero: numeroCheque,
      monto: parseFloat(monto),
      fechaEmision: fechaEmision,
      fechaVencimiento: fechaVencimiento,
      clienteId: null, // Aquí puedes buscar el cliente por razón social
      proveedorId: null, // Aquí puedes buscar el proveedor por razón social
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
    setRazonSocialCliente("");
    setRazonSocialProveedor("");
    setBanco("");
    setSucursal("");
    setError("");
    setEditingCheque(null);
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
      case "razonSocialCliente":
        setRazonSocialCliente(value);
        break;
      case "razonSocialProveedor":
        setRazonSocialProveedor(value);
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

  const buscarCliente = async () => {
    if (razonSocialCliente) {
      try {
        const respuesta = await fetch(
          `/api/clientes?razonSocial=${razonSocialCliente}`
        );
        const datos = await respuesta.json();
        if (datos.length > 0) {
          // Suponiendo que solo tomamos el primer cliente encontrado
          datos[0].id && setClienteId(datos[0].id);
        } else {
          setError("Cliente no encontrado.");
        }
      } catch (err) {
        console.error("Error al buscar cliente:", err);
      }
    }
  };

  const buscarProveedor = async () => {
    if (razonSocialProveedor) {
      try {
        const respuesta = await fetch(
          `/api/proveedores?razonSocial=${razonSocialProveedor}`
        );
        const datos = await respuesta.json();
        if (datos.length > 0) {
          // Suponiendo que solo tomamos el primer proveedor encontrado
          datos[0].id && setProveedorId(datos[0].id);
        } else {
          setError("Proveedor no encontrado.");
        }
      } catch (err) {
        console.error("Error al buscar proveedor:", err);
      }
    }
  };

  const eliminarCheque = async (id: number) => {
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
  };

  const editarCheque = (cheque: Cheque) => {
    setNumeroCheque(cheque.numero);
    setMonto(cheque.monto.toString());
    setFechaEmision(cheque.fechaEmision);
    setFechaVencimiento(cheque.fechaVencimiento);
    setRazonSocialCliente(cheque.clienteId || "");
    setRazonSocialProveedor(cheque.proveedorId || "");
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
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='number'
            name='monto'
            placeholder='Monto'
            value={monto}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='date'
            name='fechaEmision'
            placeholder='Fecha de Emisión'
            value={fechaEmision}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='date'
            name='fechaVencimiento'
            placeholder='Fecha de Vencimiento'
            value={fechaVencimiento}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='text'
            name='razonSocialCliente'
            placeholder='Razón Social del Cliente'
            value={razonSocialCliente}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
          />
          <button
            type='button'
            onClick={buscarCliente}
            className='mt-2 bg-green-500 text-white rounded p-2 hover:bg-green-600'
          >
            Buscar Cliente
          </button>
          <input
            type='text'
            name='razonSocialProveedor'
            placeholder='Razón Social del Proveedor'
            value={razonSocialProveedor}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
          />
          <button
            type='button'
            onClick={buscarProveedor}
            className='mt-2 bg-green-500 text-white rounded p-2 hover:bg-green-600'
          >
            Buscar Proveedor
          </button>
          <input
            type='text'
            name='banco'
            placeholder='Banco'
            value={banco}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='text'
            name='sucursal'
            placeholder='Sucursal'
            value={sucursal}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
        </div>
        <button
          type='submit'
          className='mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600'
        >
          {editingCheque ? "Actualizar Cheque" : "Agregar Cheque"}
        </button>
        {error && <p className='text-red-500 mt-2'>{error}</p>}
      </form>

      <h2 className='text-xl font-semibold mb-2'>Lista de Cheques</h2>
      <ul className='space-y-2'>
        {cheques.map((cheque) => (
          <li
            key={cheque.id}
            className='border border-gray-300 rounded p-4 flex justify-between items-center'
          >
            <div>
              <p>
                <strong>Número:</strong> {cheque.numero}
              </p>
              <p>
                <strong>Monto:</strong> $
                {typeof cheque.monto === "number" && !isNaN(cheque.monto)
                  ? cheque.monto.toFixed(2)
                  : "0.00"}
              </p>
              <p>
                <strong>Fecha de Emisión:</strong> {cheque.fechaEmision}
              </p>
              <p>
                <strong>Fecha de Vencimiento:</strong> {cheque.fechaVencimiento}
              </p>
              <p>
                <strong>Banco:</strong> {cheque.banco}
              </p>
              <p>
                <strong>Sucursal:</strong> {cheque.sucursal}
              </p>
            </div>
            <div className='flex space-x-2'>
              <button
                onClick={() => editarCheque(cheque)}
                className='text-blue-500 hover:text-blue-700'
              >
                Editar
              </button>
              <button
                onClick={() => eliminarCheque(cheque.id)}
                className='text-red-500 hover:text-red-700'
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaginaCheques;
