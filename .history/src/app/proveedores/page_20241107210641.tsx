"use client";
import React, { useState, useEffect } from "react";
import {
  getAllProviders,
  createProvider,
  updateProvider,
  deleteProvider,
} from "@/services/providerService";

interface Proveedor {
  id: number;
  razonSocial: string; // Cambiado de nombre a razonSocial
  direccion: string;
  cuit: string;
  zona: string;
}

// Definimos un nuevo tipo para el proveedor sin el id
type NuevoProveedor = Omit<Proveedor, "id">;

const ProveedoresPage: React.FC = (): JSX.Element => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nuevoProveedor, setNuevoProveedor] = useState<NuevoProveedor>({
    razonSocial: "", // Cambiado de nombre a razonSocial
    direccion: "",
    cuit: "",
    zona: "",
  });
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Inicialmente en true

  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const response = await getAllProviders();
        setProveedores(response);
      } catch (err) {
        setError("Error al cargar los proveedores");
      } finally {
        setLoading(false); // Cambiar a false después de cargar
      }
    };
    cargarProveedores();
  }, []);

  const esCuitValido = (cuit: string) => {
    return /^\d{2}-\d{8}-\d{1}$/.test(cuit);
  };

  const guardarProveedor = async () => {
    if (
      nuevoProveedor.razonSocial && // Cambiado de nombre a razonSocial
      nuevoProveedor.direccion &&
      esCuitValido(nuevoProveedor.cuit) &&
      nuevoProveedor.zona
    ) {
      setError(null);
      setLoading(true);
      try {
        if (proveedorEditando) {
          const updatedProveedor = await updateProvider(
            proveedorEditando.id,
            nuevoProveedor
          );
          setProveedores(
            proveedores.map((proveedor) =>
              proveedor.id === updatedProveedor.id
                ? updatedProveedor
                : proveedor
            )
          );
        } else {
          const proveedorCreado = await createProvider(nuevoProveedor);
          setProveedores([...proveedores, proveedorCreado]);
        }
        setNuevoProveedor({
          razonSocial: "",
          direccion: "",
          cuit: "",
          zona: "",
        }); // Cambiado de nombre a razonSocial
        setProveedorEditando(null);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al guardar el proveedor");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Por favor, completa todos los campos correctamente.");
    }
  };

  const eliminarProveedor = async (id: number) => {
    setLoading(true);
    try {
      await deleteProvider(id);
      setProveedores(proveedores.filter((proveedor) => proveedor.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error al eliminar el proveedor: ${err.message}`);
      } else {
        setError("Error desconocido al eliminar el proveedor");
      }
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (proveedor: Proveedor) => {
    setNuevoProveedor({
      razonSocial: proveedor.razonSocial, // Cambiado de nombre a razonSocial
      direccion: proveedor.direccion,
      cuit: proveedor.cuit,
      zona: proveedor.zona,
    });
    setProveedorEditando(proveedor);
    setError(null);
  };

  return (
    <div className='p-4 bg-background'>
      <h1 className='text-2xl font-bold mb-4'>Lista de Proveedores</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {loading && <div className='text-blue-500 mb-4'>Cargando...</div>}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Razón Social' // Cambiado de Nombre a Razón Social
          value={nuevoProveedor.razonSocial} // Cambiado de nombre a razonSocial
          onChange={
            (e) =>
              setNuevoProveedor({
                ...nuevoProveedor,
                razonSocial: e.target.value,
              }) // Cambiado de nombre a razonSocial
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input
          type='text'
          placeholder='Dirección'
          value={nuevoProveedor.direccion}
          onChange={(e) =>
            setNuevoProveedor({ ...nuevoProveedor, direccion: e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input
          type='text'
          placeholder='CUIT'
          value={nuevoProveedor.cuit}
          onChange={(e) =>
            setNuevoProveedor({ ...nuevoProveedor, cuit: e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input
          type='text'
          placeholder='Zona'
          value={nuevoProveedor.zona}
          onChange={(e) =>
            setNuevoProveedor({ ...nuevoProveedor, zona: e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <button
          onClick={guardarProveedor}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'
        >
          {proveedorEditando ? "Editar" : "Agregar"}
        </button>
      </div>
      <table className='min-w-full border border-gray-200'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='px-4 py-2'>Razón Social</th>{" "}
            {/* Cambiado de Nombre a Razón Social */}
            <th className='px-4 py-2'>Dirección</th>
            <th className='px-4 py-2'>CUIT</th>
            <th className='px-4 py-2'>Zona</th>
            <th className='px-4 py-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id} className='hover:bg-gray-50'>
              <td className='px-4 py-2'>{proveedor.razonSocial}</td>{" "}
              {/* Cambiado de nombre a razonSocial */}
              <td className='px-4 py-2'>{proveedor.direccion}</td>
              <td className='px-4 py-2'>{proveedor.cuit}</td>
              <td className='px-4 py-2'>{proveedor.zona}</td>
              <td className='px-4 py-2'>
                <button
                  onClick={() => iniciarEdicion(proveedor)}
                  className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md'
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarProveedor(proveedor.id)}
                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md'
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedoresPage;
