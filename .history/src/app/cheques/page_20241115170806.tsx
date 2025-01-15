import { useState, useEffect } from "react";
import { format, parseISO, isValid } from "date-fns";

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
  fechaEmision: string;
  monto: number;
  banco?: string;
  sucursal?: string;
  numero?: string;
  cliente?: Cliente;
  proveedor?: Proveedor;
}

const ChequesPage = () => {
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [monto, setMonto] = useState(0);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [proveedorId, setProveedorId] = useState<number | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    const fechaEmisionDate = parseISO(fechaEmision);
    const fechaVencimientoDate = parseISO(fechaVencimiento);
    if (!isValid(fechaEmisionDate) || !isValid(fechaVencimientoDate)) {
      setError("Las fechas son inválidas.");
      return;
    }

    if (monto <= 0) {
      setError("El monto debe ser un número positivo.");
      return;
    }

    try {
      const requestBody = {
        fechaEmision: fechaEmisionDate.toISOString(),
        fechaVencimiento: fechaVencimientoDate.toISOString(),
        monto,
        clienteId,
        proveedorId,
      };

      const response = await fetch("/api/cheques", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al guardar el cheque");
      }

      const nuevoCheque: Cheque = await response.json();
      setCheques((prevCheques) => [...prevCheques, nuevoCheque]);
      setSuccess("Cheque creado exitosamente");
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const resetForm = () => {
    setFechaEmision("");
    setFechaVencimiento("");
    setMonto(0);
    setClienteId(null);
    setProveedorId(null);
  };

  