// src/app/components/ArchiveButton.tsx
"use client"; // Asegúrate de usar 'use client' si usas hooks en este componente

import React from "react";

const ArchiveButton = () => {
  const handleArchive = async () => {
    try {
      const response = await fetch("/api/archive");
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Muestra un mensaje de éxito
      } else {
        alert(data.error); // Muestra un mensaje de error
      }
    } catch (error) {
      alert("Error al archivar datos.");
    }
  };

  return (
    <button
      onClick={handleArchive}
      style={{ padding: "10px", backgroundColor: "blue", color: "white" }}
    >
      Archivar Datos
    </button>
  );
};

export default ArchiveButton;
