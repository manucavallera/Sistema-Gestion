import React, { useEffect, useState } from "react";

const ClientesComponent = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    razonSocial: "",
    direccion: "",
    cuit: "",
    zona: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Función para cargar los clientes
  const cargarClientes = async () => {
    setLoading(true);
    setError(""); // Limpiar errores previos
    try {
      const response = await fetch("/api/clientes");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setClientes(data.data); // Asegúrate de acceder a la propiedad correcta
    } catch (err) {
      setError("Error al cargar los clientes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo cliente
  const guardarCliente = async () => {
    if (!validarCampos()) return; // Asegúrate de que esta función valide correctamente

    setLoading(true);
    setError(""); // Limpiar errores previos
    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoCliente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el cliente");
      }

      const data = await response.json();
      setClientes((prev) => [...prev, data.data]); // Agrega el nuevo cliente a la lista
      setNuevoCliente({ razonSocial: "", direccion: "", cuit: "", zona: "" }); // Resetea el formulario
    } catch (err) {
      setError("Error al guardar el cliente: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para validar campos
  const validarCampos = () => {
    const { razonSocial, direccion, cuit, zona } = nuevoCliente;
    if (!razonSocial || !direccion || !cuit || !zona) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    return true;
  };

  // Cargar los clientes cuando el componente se monta
  useEffect(() => {
    cargarClientes();
  }, []);

  return (
    <div>
      <h1>Clientes</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.razonSocial}</li>
        ))}
      </ul>
      <h2>Agregar Nuevo Cliente</h2>
      <input
        type='text'
        placeholder='Razón Social'
        value={nuevoCliente.razonSocial}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, razonSocial: e.target.value })
        }
      />
      <input
        type='text'
        placeholder='Dirección'
        value={nuevoCliente.direccion}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
        }
      />
      <input
        type='text'
        placeholder='CUIT'
        value={nuevoCliente.cuit}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, cuit: e.target.value })
        }
      />
      <input
        type='text'
        placeholder='Zona'
        value={nuevoCliente.zona}
        onChange={(e) =>
          setNuevoCliente({ ...nuevoCliente, zona: e.target.value })
        }
      />
      <button onClick={guardarCliente}>Guardar Cliente</button>
    </div>
  );
};

export default ClientesComponent;
