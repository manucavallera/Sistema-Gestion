 Sistema de Gestión Contable

Este es un sistema de gestión contable en desarrollo, construido con **Next.js**, **Prisma**, **PostgreSQL** y **TypeScript**. El sistema está diseñado para facilitar la gestión de cuentas corrientes, proveedores, clientes, compras, ventas, pagos y más, ayudando a automatizar tareas administrativas y mejorar la eficiencia en la contabilidad de cualquier negocio.

## Tecnologías

- **Next.js**: Framework de React para la construcción de la interfaz de usuario y la API del servidor.
- **Prisma**: ORM para interactuar con la base de datos PostgreSQL.
- **PostgreSQL**: Base de datos relacional utilizada para almacenar la información contable.
- **TypeScript**: Lenguaje de programación que ofrece tipado estático para mejorar la calidad y mantenibilidad del código.

## Funcionalidades

El sistema cuenta con los siguientes módulos y funcionalidades:

- **Clientes**: CRUD completo de clientes y la capacidad de obtener clientes con saldo.
- **Proveedores**: CRUD completo de proveedores y la capacidad de obtener proveedores con saldo.
- **Compras**: CRUD completo y actualización automática del saldo del proveedor al realizar compras.
- **Ventas**: CRUD completo y actualización automática del saldo del cliente al realizar ventas.
- **Movimientos de Cuenta Corriente**: CRUD completo y la capacidad de obtener movimientos específicos por cliente o proveedor.
- **Formas de Pago**: Visualización de todas las formas de pago disponibles, con opción de agregar y eliminar.
- **Historial de Pagos**: CRUD completo y la capacidad de obtener pagos específicos de un cliente o proveedor.
- **Impresión de Documentos**: Generación de recibos y remitos para impresión.
