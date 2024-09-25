import './App.css';
import { useEffect, useState } from 'react';

// Configuração dos headers para a API
const headers = {
  'Content-Type': 'application/json',
};

// Função para buscar dados da API
const fetchData = async (url, setData) => {
  try {
    const response = await fetch(url, { method: 'GET', headers });
    if (!response.ok) throw new Error('Erro ao buscar dados');
    const result = await response.json();

    setData(result.content);
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message);
  }
};

// Função para enviar dados para a API
const postData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Se a resposta não for OK, tenta transformar a resposta em JSON
      const errorData = await response.json();
      throw errorData; // Lança o objeto de erro JSON para o catch
    }

    return true;
  } catch (error) {
    // Aqui, `error` é o objeto de erro JSON retornado do backend
    if (error && error.errors) {
      error.errors.forEach(err => {
        console.error('Erro ao enviar dados:', err.defaultMessage);
      });
    } else {
      console.error('Erro genérico ao enviar dados:', error.message || error);
    }
    return false;
  }
};

// Função para deletar dados da API
const deleteData = async (url) => {
  try {
    const response = await fetch(url, { method: 'DELETE', headers });
    if (!response.ok) throw new Error('Erro ao apagar dados');
    return true;
  } catch (error) {
    console.error('Erro ao apagar dados:', error.message);
    return false;
  }
};

// Componente principal
const App = () => {
  const [nome, setNome] = useState('');
  const [login, setEmail] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData('http://localhost:8080/test/', setData);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isSuccess = await postData('http://localhost:8080/test/register', { nome, login });
    if (isSuccess) {
      console.log('Dados enviados com sucesso');
      fetchData('http://localhost:8080/test/', setData);
      setNome('');
      setEmail('');
    }
  };

  const handleDelete = async (id) => {
    const isSuccess = await deleteData(`http://localhost:8080/test/${id}`);
    if (isSuccess) {
      console.log('Usuário apagado com sucesso');
      fetchData('http://localhost:8080/test/', setData);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} />
          <br />
          <label>Login:</label>
          <input type='text' value={login} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <button type='submit'>Enviar</button>
        </form>

        {data.length > 0 ? (
          <div>
            {data.map(({ id, nome, login }) => (
              <p key={id}>
                nome: {nome} | login: {login}
                <button onClick={() => handleDelete(id)}>Apagar</button>
              </p>
            ))}
          </div>
        ) : (
          <p>Nenhum dado encontrado</p>
        )}
      </header>
    </div>
  );
};

export default App;
