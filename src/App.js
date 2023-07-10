import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://pcn662vet2.execute-api.us-east-1.amazonaws.com/dev/disciplina');
      if (Array.isArray(response.data)) {
        setItems(response.data);
        setError(null);
      } else {
        setError('Erro: Os dados retornados pela API não são um array válido.');
      }
    } catch (error) {
      console.log(error);
      setError('Ocorreu um erro ao buscar os dados.');
    }
  };

  const adicionarItem = async () => {
    try {
      const novoItem = {
        codigo,
        descricao
      };

      const response = await axios.post('https://pcn662vet2.execute-api.us-east-1.amazonaws.com/dev/disciplina', novoItem);

      if (Array.isArray(response.data)) {
        setItems(response.data);
        setCodigo('');
        setDescricao('');
        setError(null);
      } else {
        setError('Erro: Os dados retornados pela API após adicionar um item não são um array válido.');
      }
    } catch (error) {
      console.log(error);
      setError('Ocorreu um erro ao adicionar o item.');
    }
  };

  const alterarItem = async (index, codigo, descricao) => {
    try {
      const item = items[index];
      const atualizacaoItem = {
        ...item,
        codigo,
        descricao
      };

      const response = await axios.put(`https://pcn662vet2.execute-api.us-east-1.amazonaws.com/dev/disciplina/${item.id}`, atualizacaoItem);

      if (Array.isArray(response.data)) {
        setItems(response.data);
        setError(null);
      } else {
        setError('Erro: Os dados retornados pela API após alterar um item não são um array válido.');
      }
    } catch (error) {
      console.log(error);
      setError('Ocorreu um erro ao alterar o item.');
    }
  };

  const excluirItem = async (index) => {
    try {
      const item = items[index];
      await axios.delete(`https://pcn662vet2.execute-api.us-east-1.amazonaws.com/dev/disciplina/${item.id}`);
      const novosItems = [...items];
      novosItems.splice(index, 1);
      setItems(novosItems);
      setError(null);
    } catch (error) {
      console.log(error);
      setError('Ocorreu um erro ao excluir o item.');
    }
  };

  return (
    <div className="conteudoTabela">
      <h1 className="titulo">Tabela</h1>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Alterar</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{item.codigo}</td>
              <td>{item.descricao}</td>
              <td>
                <button onClick={() => alterarItem(index, codigo, descricao)}>Alterar</button>
              </td>
              <td>
                <button className="botaoAdicionar" onClick={() => excluirItem(index)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <button onClick={adicionarItem}>Adicionar</button>
      </div>
    </div>
  );
};

export default App;
