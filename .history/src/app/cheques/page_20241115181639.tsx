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
