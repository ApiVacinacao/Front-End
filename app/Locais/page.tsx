'use client';

import React, { useState } from 'react';
import styles from './locais.module.css';
import modalStyles from './EditModal.module.css';
import Navbar from '../components/navbar/page';

interface Local {
  id: number;
  nome: string;
  endereco: string;
  ativo: boolean;
}

const Locais: React.FC = () => {
  const [locais, setLocais] = useState<Local[]>([
    { id: 1, nome: 'UBS Central', endereco: 'Rua Principal, 123', ativo: true },
    { id: 2, nome: 'Clínica Vida', endereco: 'Av. Saúde, 456', ativo: true },
    { id: 3, nome: 'Posto Jardim', endereco: 'Rua das Flores, 789', ativo: false },
  ]);

  const [localEditando, setLocalEditando] = useState<Local | null>(null);

  const editarLocal = (id: number) => {
    const local = locais.find(l => l.id === id);
    if (local) setLocalEditando(local);
  };

  const salvarEdicao = (atualizado: Local) => {
    setLocais(prev => prev.map(l => l.id === atualizado.id ? atualizado : l));
    setLocalEditando(null);
  };

  const ativarOuInativar = (id: number) => {
    setLocais(prev =>
      prev.map(l =>
        l.id === id ? { ...l, ativo: !l.ativo } : l
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localEditando) {
      setLocalEditando({ ...localEditando, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <Navbar />

      <main className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Lista de Locais</h1>
          <hr className={styles.divider} />

          <div className={styles.lista}>
            {locais.map(local => (
              <div key={local.id} className={styles.item}>
                <div className={styles.info}>
                  <strong>{local.nome}</strong>
                  <p>Endereço: {local.endereco}</p>
                  <p>Status: <span className={local.ativo ? styles.ativo : styles.inativo}>{local.ativo ? 'Ativo' : 'Inativo'}</span></p>
                </div>
                <div className={styles.botoes}>
                  <button className={styles.editButton} onClick={() => editarLocal(local.id)}>Editar</button>
                  <button className={styles.deleteButton} onClick={() => ativarOuInativar(local.id)}>
                    {local.ativo ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {localEditando && (
          <div className={modalStyles.modalOverlay}>
            <div className={modalStyles.modalContent}>
              <h2>Editar Local</h2>

              <label>Nome</label>
              <input type="text" name="nome" value={localEditando.nome} onChange={handleInputChange} />

              <label>Endereço</label>
              <input type="text" name="endereco" value={localEditando.endereco} onChange={handleInputChange} />

              <div className={modalStyles.actions}>
                <button onClick={() => setLocalEditando(null)} className={modalStyles.cancelButton}>Cancelar</button>
                <button onClick={() => salvarEdicao(localEditando)} className={modalStyles.saveButton}>Salvar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Locais;
