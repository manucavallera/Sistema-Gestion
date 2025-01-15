// src/app/page.tsx
import Link from "next/link";

const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-background'>
      <h1 className='text-5xl font-bold'>Sistema de Gestión</h1>
      <p className='mt-4 text-lg'>
        Bienvenido al sistema de gestión de clientes, proveedores y más.
      </p>

      <div className='mt-8 space-y-4'>
        {/* Botones de navegación */}
        <div className='flex flex-wrap justify-center space-x-4'>
          <Link href='/inicio'>
            <a className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200'>
              Ir al Inicio
            </a>
          </Link>
          <Link href='/clientes'>
            <a className='px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors duration-200'>
              Gestión de Clientes
            </a>
          </Link>
          <Link href='/proveedores'>
            <a className='px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 transition-colors duration-200'>
              Gestión de Proveedores
            </a>
          </Link>
          <Link href='/compras'>
            <a className='px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600 transition-colors duration-200'>
              Gestión de Compras
            </a>
          </Link>
          <Link href='/ventas'>
            <a className='px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors duration-200'>
              Gestión de Ventas
            </a>
          </Link>
        </div>

        {/* Agrega enlaces adicionales aquí si es necesario */}
        {/* <Link href='/nueva-seccion'>
              <a className='px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600'>
                Nueva Sección
              </a>
          </Link> */}
      </div>
    </div>
  );
};

export default HomePage;
