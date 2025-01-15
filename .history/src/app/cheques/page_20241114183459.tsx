"use client";
import { useState, useEffect } from "react";

interface Cliente {
  id: number;
  razonSocial: string;
  saldo: number;
}

interface Proveedor {
  id: number;
  razonSocial: string;
  saldo: number;
}

interface Cheque {
  id: number;
  fecha: string;
  monto: number;
  cliente?: Cliente;
  proveedor?: Proveedor;
}

const AgregarCheque = () => {
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState(0);
  const [entidadTipo, setEntidadTipo] = useState<"cliente" | "proveedor">(
    "cliente"
  );
  const [entidadId, setEntidadId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingCheque, setEditingCheque] = useState<Cheque | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("/api/clientes");
        if (!response.ok) throw new Error("Error al cargar clientes");
        const data: Cliente[] = await response.json();
        setClientes(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    };

    const fetchProveedores = async () => {
      try {
        const response = await fetch("/api/proveedores");
        if (!response.ok) throw new Error("Error al cargar proveedores");
        const data: Proveedor[] = await response.json();
        setProveedores(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    };

    const fetchCheques = async () => {
      try {
        const response = await fetch("/api/cheques");
        if (!response.ok) throw new Error("Error al cargar cheques");
        const data: Cheque[] = await response.json();
        setCheques(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    };

    fetchClientes();
    fetchProveedores();
    fetchCheques();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (entidadId === null) {
      setError("Por favor, asegúrese de que la entidad seleccionada exista.");
      return;
    }

    // Validar que la fecha sea válida
    const fechaValida = new Date(fecha);
    if (isNaN(fechaValida.getTime())) {
      setError("Fecha no válida.");
      return;
    }

    try {
      const requestBody = {
        fecha: fechaValida.toISOString(), // Enviar la fecha en formato ISO
        monto,
        clienteId: entidadTipo === "cliente" ? entidadId : null,
        proveedorId: entidadTipo === "proveedor" ? entidadId : null,
      };

      let response;
      if (editingCheque) {
        // Editar cheque existente
        response = await fetch(`/api/cheques/${editingCheque.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } else {
        // Crear nuevo cheque
        response = await fetch("/api/cheques", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el cheque");
      }

      const nuevoCheque: Cheque = await response.json();
      if (editingCheque) {
        setCheques((prevCheques) =>
          prevCheques.map((cheque) =>
            cheque.id === nuevoCheque.id ? nuevoCheque : cheque
          )
        );
        setSuccess("Cheque editado exitosamente");
      } else {
        setCheques((prevCheques) => [...prevCheques, nuevoCheque]);
        setSuccess("Cheque creado exitosamente");
      }

      // Limpiar campos después de agregar o editar el cheque
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const resetForm = () => {
    setFecha("");
    setMonto(0);
    setEntidadId(null);
    setEditingCheque(null);
  };

  const handleEdit = (cheque: Cheque) => {
    setFecha(cheque.fecha);
    setMonto(cheque.monto);
    setEntidadTipo(cheque.cliente ? "cliente" : "proveedor");
    setEntidadId(
      cheque.cliente ? cheque.cliente.id : cheque.proveedor?.id || null
    );
    setEditingCheque(cheque);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cheque?")) {
      try {
        const response = await fetch(`/api/cheques/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al eliminar el cheque");
        }

        setCheques((prevCheques) =>
          prevCheques.filter((cheque) => cheque.id !== id)
        );
        setSuccess("Cheque eliminado exitosamente");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no válida";
    const date = new Date(dateString + "T00:00:00Z");
    if (isNaN(date.getTime())) {
      return "Fecha no válida";
    }
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("es-AR", options);
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold text-center mb-4'>Agregar Cheque</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Fecha:
          </label>
          <input
            type='date'
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Monto:
          </label>
          <input
            type='number'
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
            min='0'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Tipo de Entidad:
          </label>
          <select
            value={entidadTipo}
            onChange={(e) => {
              setEntidadTipo(e.target.value as "cliente" | "proveedor");
              setEntidadId(null); // Reiniciar entidadId cuando cambia el tipo
            }}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          >
            <option value='cliente'>Cliente</option>
            <option value='proveedor'>Proveedor</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            {entidadTipo === "cliente" ? "Cliente:" : "Proveedor:"}
          </label>
          <select
            value={entidadId !== null ? entidadId : ""}
            onChange={(e) =>
              setEntidadId(e.target.value ? Number(e.target.value) : null)
            }
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          >
            <option value='' disabled>
              Selecciona un {entidadTipo}
            </option>
            {(entidadTipo === "cliente" ? clientes : proveedores).map(
              (entidad) => (
                <option key={entidad.id} value={entidad.id}>
                  {entidad.razonSocial}
                </option>
              )
            )}
          </select>
        </div>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200'
        >
          {editingCheque ? "Actualizar Cheque" : "Agregar Cheque"}
        </button>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        {success && <p className='text-green-500 text-sm'>{success}</p>}
      </form>

      <h2 className='text-xl font-bold mt-6'>Lista de Cheques</h2>
      <ul className='mt-4 space-y-2'>
        {cheques.map((cheque) => (
          <li key={cheque.id} className='border p-2 rounded-md'>
            <p>
              <strong>Fecha:</strong> {formatDate(cheque.fecha)}
            </p>
            <p>
              <strong>Monto:</strong> ${cheque.monto}
            </p>
            <p>
              <strong>Entidad:</strong>{" "}
              {cheque.cliente
                ? cheque.cliente.razonSocial
                : cheque.proveedor?.razonSocial}
            </p>
            <div className='flex space-x-2'>
              <button
                onClick={() => handleEdit(cheque)}
                className='text-blue-600 hover:underline'
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cheque.id)}
                className='text-red-600 hover:underline'
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

export default AgregarCheque;
