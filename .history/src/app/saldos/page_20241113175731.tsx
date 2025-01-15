"use client";
import { useEffect, useState } from "react";

const SaldosPage = () => {
  const [saldos, setSaldos] = useState([]);

  useEffect(() => {
    const fetchSaldos = async () => {
      const response = await fetch("/api/saldos");
      const data = await response.json();
      setSaldos(data);
    };

    fetchSaldos();
  }, []);

  return (
    <div>
      <h1>Saldos</h1>
      <ul>
        {saldos.map((saldo) => (
          <li key={saldo.id}>{saldo.monto}</li>
        ))}
      </ul>
    </div>
  );
};

export default SaldosPage;
