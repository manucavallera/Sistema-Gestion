"use client";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

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
    const fechaValida = parseISO(fecha);
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

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Fecha:</label>
        <input
          type='date'
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Monto:</label>
        <input
          type='number'
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Tipo de Entidad:</label>
        <select
          value={entidadTipo}
          onChange={(e) =>
            setEntidadTipo(e.target.value as "cliente" | "proveedor")
          }
        >
          <option value='cliente'>Cliente</option>
          <option value='proveedor'>Proveedor</option>
        </select>
      </div>
      <div>
        <label>Entidad:</label>
        <select
          value={entidadId || ""}
          onChange={(e) => setEntidadId(Number(e.target.value))}
          required
        >
          <option value='' disabled>
            Seleccione una entidad
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
      <button type='submit'>
        {editingCheque ? "Editar Cheque" : "Agregar Cheque"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default AgregarCheque;
