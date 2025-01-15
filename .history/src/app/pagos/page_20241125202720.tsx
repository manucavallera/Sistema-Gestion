import { useEffect, useState } from "react";

const PagosPage = () => {
  const [movimientoId, setMovimientoId] = useState("");
  const [metodoPago, setMetodoPago] = useState("EFECTIVO");
  const [pagos, setPagos] = useState([]);
  const [movimientos, setMovimientos] = useState([]);

  useEffect(() => {
    // Función para obtener movimientos desde la API
    const fetchMovimientos = async () => {
      try {
        const response = await fetch("/api/movimientos"); // Ajusta la URL según tu API
        const data = await response.json();
        setMovimientos(data);
      } catch (error) {
        console.error("Error al obtener movimientos:", error);
      }
    };

    fetchMovimientos();
  }, []);

  useEffect(() => {
    // Función para obtener pagos desde la API
    const fetchPagos = async () => {
      try {
        const response = await fetch("/api/pagos"); // Ajusta la URL según tu API
        const data = await response.json();
        setPagos(data);
      } catch (error) {
        console.error("Error al obtener pagos:", error);
      }
    };

    fetchPagos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monto: 1000, movimientoId, metodoPago }), // Ajusta el monto según sea necesario
      });

      if (response.ok) {
        const nuevoPago = await response.json();
        setPagos((prevPagos) => [...prevPagos, nuevoPago]);
        setMovimientoId(""); // Reinicia el estado del movimientoId
        setMetodoPago("EFECTIVO"); // Reinicia el estado del método de pago
      } else {
        const errorData = await response.json();
        console.error("Error al crear el pago:", errorData.error);
      }
    } catch (error) {
      console.error("Error al crear el pago:", error);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Crear Pago</h1>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='movimientoId'
          >
            Movimiento
          </label>
          <select
            id='movimientoId'
            value={movimientoId}
            onChange={(e) => setMovimientoId(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            <option value=''>Selecciona un movimiento</option>
            {movimientos.map((movimiento) => (
              <option key={movimiento.id} value={movimiento.id}>
                {movimiento.tipo} - {movimiento.monto}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='metodoPago'
          >
            Método de Pago
          </label>
          <select
            id='metodoPago'
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            <option value='EFECTIVO'>Efectivo</option>
            <option value='TARJETA'>Tarjeta</option>
            <option value='TRANSFERENCIA'>Transferencia</option>
          </select>
        </div>
        <div className='flex items-center justify-between'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Crear Pago
          </button>
        </div>
      </form>
      <ul className='list-disc pl-5 mt-4'>
        {pagos.map((pago) => (
          <li key={pago.id} className='mb-2'>
            Monto: {pago.monto}, Movimiento ID: {pago.movimientoId}, Método de
            Pago: {pago.metodoPago}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PagosPage;
