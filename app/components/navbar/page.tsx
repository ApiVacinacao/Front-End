'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "../navbar/navbar.module.css";

import {
  MdEditNote,
  MdLocalHospital,
  MdPerson,
  MdEvent,
  MdLocationOn,
  MdMedicalServices,
  MdAssessment,
  MdSettings,
  MdLogout,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();
  const [cadastroOpen, setCadastroOpen] = useState(false);

  useEffect(() => {
    setCadastroOpen(pathname.startsWith("/Cadastro"));
  }, [pathname]);

  const toggleCadastro = () => setCadastroOpen(!cadastroOpen);
  const isActive = (link: string) => pathname === link || pathname.startsWith(link + "/");

  const handleLogout = () => {
    localStorage.clear(); // substitua pelo seu método real de logout
    window.location.href = "/";
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src="../aa.png" alt="Logo" className={styles.logo} />
      </div>
      <nav className={styles.navContainer}>
        <ul className={styles.navList}>

          <li className={styles.navItem}>
            <Link href="/Agendamento" className={`${styles.navLink} ${isActive("/Agendamento") ? styles.active : ""}`}>
              <MdEvent size={24} className={styles.icon} />
              <span className={styles.navText}>Agendamentos</span>
            </Link>
          </li>

          <li className={styles.navItem}>
            <button className={`${styles.navLink} ${cadastroOpen ? styles.active : ""}`} onClick={toggleCadastro} aria-expanded={cadastroOpen}>
              <MdEditNote size={24} className={styles.icon} />
              <span className={styles.navText}>Cadastro</span>
              <span className={styles.chevron}>{cadastroOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}</span>
            </button>
            {cadastroOpen && (
              <ul className={styles.subList}>
                <li>
                  <Link href="/Cadastro/agendamento" className={`${styles.subLink} ${isActive("/Cadastro/agendamento") ? styles.activeSubLink : ""}`}>
                    <MdEvent size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Agendamento
                  </Link>
                </li>
                <li>
                  <Link href="/Cadastro/local" className={`${styles.subLink} ${isActive("/Cadastro/local") ? styles.activeSubLink : ""}`}>
                    <MdLocationOn size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Local de Atendimento
                  </Link>
                </li>
                <li>
                  <Link href="/Cadastro/especialidade" className={`${styles.subLink} ${isActive("/Cadastro/especialidade") ? styles.activeSubLink : ""}`}>
                    <MdLocationOn size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Cadastro de Especialidade
                  </Link>
                </li>
                <li>
                  <Link href="/Cadastro/profissional" className={`${styles.subLink} ${isActive("/Cadastro/profissional") ? styles.activeSubLink : ""}`}>
                    <MdLocalHospital size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Médico
                  </Link>
                </li>
                <li>
                  <Link href="/Cadastro/paciente" className={`${styles.subLink} ${isActive("/Cadastro/paciente") ? styles.activeSubLink : ""}`}>
                    <MdPerson size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Paciente
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className={styles.navItem}>
            <Link href="/Consulta" className={`${styles.navLink} ${isActive("/Consulta") ? styles.active : ""}`}>
              <MdMedicalServices size={24} className={styles.icon} />
              <span className={styles.navText}>Consultas</span>
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link href="/Locais" className={`${styles.navLink} ${isActive("/Locais") ? styles.active : ""}`}>
              <MdLocationOn size={24} className={styles.icon} />
              <span className={styles.navText}>Locais</span>
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link href="/Medicos" className={`${styles.navLink} ${isActive("/Medicos") ? styles.active : ""}`}>
              <MdLocalHospital size={24} className={styles.icon} />
              <span className={styles.navText}>Médicos</span>
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link href="/Pacientes" className={`${styles.navLink} ${isActive("/Pacientes") ? styles.active : ""}`}>
              <MdPerson size={24} className={styles.icon} />
              <span className={styles.navText}>Pacientes</span>
            </Link>
          </li>

          <li className={styles.navItem}>
            <Link href="/relatorios" className={`${styles.navLink} ${isActive("/relatorios") ? styles.active : ""}`}>
              <MdAssessment size={24} className={styles.icon} />
              <span className={styles.navText}>Relatórios</span>
            </Link>
          </li>

          {/* <li className={styles.navItem}>
            <Link href="/configuracoes" className={`${styles.navLink} ${isActive("/configuracoes") ? styles.active : ""}`}>
              <MdSettings size={24} className={styles.icon} />
              <span className={styles.navText}>Configurações</span>
            </Link>
          </li> */}

          <li className={styles.navItem}>
            <button className={styles.navLink} onClick={handleLogout}>
              <MdLogout size={24} className={styles.icon} />
              <span className={styles.navText}>Deslogar</span>
            </button>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
