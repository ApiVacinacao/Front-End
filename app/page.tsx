"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    router.replace("/Login");
    return;
  }

  // Usuário comum → vai direto pra agendamentos
  if (role !== "admin") {
    router.replace("/Agendamento");
    return;
  }

  // Admin → mostra dashboard normal
  setIsAuthenticated(true);
  setIsChecking(false);
}, []);
 // <- sem router aqui

  if (isChecking) {
    return (
      <div className="loadingWrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // evita renderização duplicada

  const options = [
    { title: "Agendamentos", description: "Gerencie todos os agendamentos do sistema.", path: "/Cadastro/agendamento", icon: "📅" },
    { title: "Relatórios", description: "Visualize relatórios completos.", path: "/relatorios", icon: "📊" },
    { title: "Locais", description: "Gerencie locais do sistema.", path: "/Locais", icon: "📍" },
    { title: "Tipos de Consulta", description: "Configure tipos de consulta.", path: "/Cadastro/consulta", icon: "🩺" },
  ];

  return (
    <div className="bgContainer">
      <main className="homePage">

        <header className="header">
          <Image src="/aa.png" alt="Logo IAITEA" width={80} height={80} />
          <h1 className="title">Sistema IAITEA</h1>
          <p className="subtitle">Organização, controle e praticidade</p>
        </header>

        <section className="optionsContainer">
          {options.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="optionCard floating"
              style={{
                animation: `fadeUp 0.5s ease forwards`,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="access">Acessar →</span>
            </Link>
          ))}
        </section>

      </main>
    </div>
  );
}
