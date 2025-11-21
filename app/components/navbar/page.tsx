'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "../navbar/navbar.module.css";
import { 
  MdLocalHospital, MdEditNote, MdPerson, MdEvent, MdLocationOn, 
  MdMedicalServices, MdAssessment, MdLogout, MdExpandMore, MdExpandLess, MdAnalytics 
} from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const [cadastroOpen, setCadastroOpen] = useState(false);
  const [relatoriosOpen, setRelatoriosOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  useEffect(() => {
    setCadastroOpen(pathname.startsWith("/Cadastro"));
    setRelatoriosOpen(pathname.startsWith("/Relatorios"));
  }, [pathname]);

  const isActive = (link: string) => pathname === link || pathname.startsWith(link + "/");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Hamburger mobile */}
      <div className={styles.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span></span>
      </div>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
        <div className={styles.logoContainer}>
          <img src="../aa.png" alt="Logo" className={styles.logo} />
        </div>

        <nav className={styles.navContainer}>
          <ul className={styles.navList}>

            {/* USUÁRIO NORMAL */}
            {role !== "admin" && (
              <>
                <li className={styles.navItem}>
                  <Link href="/Agendamento" className={`${styles.navLink} ${isActive("/Agendamento") ? styles.active : ""}`}>
                    <MdEvent size={14} className={styles.icon} />
                    <span className={styles.navText}>Meus Agendamentos</span>
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <button className={styles.navLink} onClick={handleLogout}>
                    <MdLogout size={14} className={styles.icon} />
                    <span className={styles.navText}>Deslogar</span>
                  </button>
                </li>
              </>
            )}

            {/* ADMIN */}
            {role === "admin" && (
              <>
                <li className={styles.navItem}>
                  <Link href="/Agendamento" className={`${styles.navLink} ${isActive("/Agendamento") ? styles.active : ""}`}>
                    <MdEvent size={24} className={styles.icon} />
                    <span className={styles.navText}>Agendamentos</span>
                  </Link>
                </li>

                <li className={styles.navItem}>
                  <button className={`${styles.navLink} ${cadastroOpen ? styles.active : ""}`} onClick={() => setCadastroOpen(!cadastroOpen)}>
                    <MdEditNote size={24} className={styles.icon} />
                    <span className={styles.navText}>Cadastro</span>
                    {cadastroOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                  </button>

                  {cadastroOpen && (
                    <ul className={styles.subList}>
                      <li><Link href="/Cadastro/agendamento" className={`${styles.subLink} ${isActive("/Cadastro/agendamento") ? styles.activeSubLink : ""}`}><MdEvent size={18} /> Agendamento</Link></li>
                      <li><Link href="/Cadastro/local" className={`${styles.subLink} ${isActive("/Cadastro/local") ? styles.activeSubLink : ""}`}><MdLocationOn size={18} /> Local de Atendimento</Link></li>
                      <li><Link href="/Cadastro/consulta" className={`${styles.subLink} ${isActive("/Cadastro/consulta") ? styles.activeSubLink : ""}`}><MdMedicalServices size={18} /> Tipo de Consulta</Link></li>
                      <li><Link href="/Cadastro/especialidade" className={`${styles.subLink} ${isActive("/Cadastro/especialidade") ? styles.activeSubLink : ""}`}><FaStethoscope size={18} /> Especialidade</Link></li>
                      <li><Link href="/Cadastro/profissional" className={`${styles.subLink} ${isActive("/Cadastro/profissional") ? styles.activeSubLink : ""}`}><MdLocalHospital size={18} /> Médico</Link></li>
                      <li><Link href="/Cadastro/paciente" className={`${styles.subLink} ${isActive("/Cadastro/paciente") ? styles.activeSubLink : ""}`}><MdPerson size={18} /> Paciente</Link></li>
                    </ul>
                  )}
                </li>

                {/* Consultas */}
                <li className={styles.navItem}><Link href="/Consulta" className={`${styles.navLink} ${isActive("/Consulta") ? styles.active : ""}`}><MdMedicalServices size={24} /><span className={styles.navText}>Consultas</span></Link></li>
                <li className={styles.navItem}><Link href="/Locais" className={`${styles.navLink} ${isActive("/Locais") ? styles.active : ""}`}><MdLocationOn size={24} /><span className={styles.navText}>Locais</span></Link></li>
                <li className={styles.navItem}><Link href="/Especialidade" className={`${styles.navLink} ${isActive("/Especialidade") ? styles.active : ""}`}><FaStethoscope size={24} /><span className={styles.navText}>Especialidade</span></Link></li>
                <li className={styles.navItem}><Link href="/Medicos" className={`${styles.navLink} ${isActive("/Medicos") ? styles.active : ""}`}><MdLocalHospital size={24} /><span className={styles.navText}>Médicos</span></Link></li>
                <li className={styles.navItem}><Link href="/Pacientes" className={`${styles.navLink} ${isActive("/Pacientes") ? styles.active : ""}`}><MdPerson size={24} /><span className={styles.navText}>Pacientes</span></Link></li>

                {/* Relatórios */}
                <li className={styles.navItem}>
                  <button className={`${styles.navLink} ${relatoriosOpen ? styles.active : ""}`} onClick={() => setRelatoriosOpen(!relatoriosOpen)}>
                    <MdAssessment size={24} />
                    <span className={styles.navText}>Relatórios</span>
                    {relatoriosOpen ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                  </button>
                  {relatoriosOpen && (
                    <ul className={styles.subList}>
                      <li><Link href="/relatorios/medicos" className={`${styles.subLink} ${isActive("/relatorios/medicos") ? styles.activeSubLink : ""}`}><MdLocalHospital size={18} /> Relatório de Médicos</Link></li>
                      <li><Link href="/relatorios/pacientes" className={`${styles.subLink} ${isActive("/relatorios/pacientes") ? styles.activeSubLink : ""}`}><MdPerson size={18} /> Relatório de Pacientes</Link></li>
                      <li><Link href="/relatorios/locais" className={`${styles.subLink} ${isActive("/relatorios/locais") ? styles.activeSubLink : ""}`}><MdAnalytics size={18} /> Relatório de Locais</Link></li>
                    </ul>
                  )}
                </li>

                {/* Logout */}
                <li className={styles.navItem}><button className={styles.navLink} onClick={handleLogout}><MdLogout size={24} /><span className={styles.navText}>Deslogar</span></button></li>
              </>
            )}

          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
