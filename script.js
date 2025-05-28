document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroAlunoForm');

  const estados = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
    'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso',
    'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná',
    'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte',
    'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo',
    'Sergipe', 'Tocantins'
  ];

  const cursos = [
    'Desenvolvimento de sistemas', 'Administração', 'Enfermagem',
    'Estética', 'Formação de docentes', 'Ensino médio'
  ];

  const estrutura = [
  {
    titulo: 'Dados do Empréstimo',
    campos: [
      { label: 'CGM do Aluno*', tipo: 'text', id: 'cgm', required: true },
      { label: 'Nome do Aluno*', tipo: 'text', id: 'nome', required: true },
      { label: 'Título do Livro*', tipo: 'text', id: 'livro', required: true },
      { label: 'Autor do Livro', tipo: 'text', id: 'autor', required: false },
      { label: 'Gênero', tipo: 'text', id: 'genero', required: false },
      { label: 'Data do Empréstimo*', tipo: 'date', id: 'data_emprestimo', required: true },
      { label: 'Data de Devolução Prevista*', tipo: 'date', id: 'data_devolucao', required: true },
      { label: 'Observações', tipo: 'textarea', id: 'observacoes', required: false }
    ]
  },
   
  {
    titulo: '',
    campos: [
      {
        label: 'Confirmo que os dados estão corretos*',
        tipo: 'checkbox', id: 'termos', required: true
      }
    ]
  }
];


  estrutura.forEach(secao => {
    const section = document.createElement('section');
    if (secao.titulo) {
      const titulo = document.createElement('h2');
      titulo.textContent = secao.titulo;
      section.appendChild(titulo);
    }

    secao.campos.forEach(campo => {
      if (campo.tipo === 'checkbox') {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.className = 'checkbox-container';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = campo.id;
        input.name = campo.id;
        if (campo.required) input.required = true;

        const label = document.createElement('label');
        label.htmlFor = campo.id;
        label.textContent = campo.label;

        checkboxWrapper.appendChild(input);
        checkboxWrapper.appendChild(label);
        section.appendChild(checkboxWrapper);
      } else {
        const label = document.createElement('label');
        label.htmlFor = campo.id;
        label.textContent = campo.label;

        let elemento;
        if (campo.tipo === 'select') {
          elemento = document.createElement('select');
          campo.opcoes.forEach(opcao => {
            const opt = document.createElement('option');
            opt.value = opcao;
            opt.textContent = opcao;
            elemento.appendChild(opt);
          });
        } else if (campo.tipo === 'textarea') {
          elemento = document.createElement('textarea');
          elemento.rows = 3;
        } else {
          elemento = document.createElement('input');
          elemento.type = campo.tipo;
        }

        elemento.id = campo.id;
        elemento.name = campo.id;
        if (campo.required) elemento.required = true;
        if (campo.placeholder) elemento.placeholder = campo.placeholder;

        label.appendChild(elemento);
        section.appendChild(label);
      }
    });

    form.appendChild(section);
  });

  const botoes = document.createElement('div');
  botoes.className = 'buttons';

  const btnReset = document.createElement('button');
  btnReset.type = 'reset';
  btnReset.textContent = 'Excluir';

  const btnSubmit = document.createElement('button');
  btnSubmit.type = 'submit';
  btnSubmit.textContent = 'Cadastrar';

  const btnCancelar = document.createElement('button');
  btnCancelar.type = 'button';
  btnCancelar.textContent = 'Cancelar';
  btnCancelar.onclick = () => history.back();

  botoes.append(btnReset, btnSubmit, btnCancelar);
  form.appendChild(botoes);

  form.addEventListener('submit', async e => {
    e.preventDefault();

    let valido = true;
    const mensagens = [];

    form.querySelectorAll('[required]').forEach(el => {
      if ((el.type === 'checkbox' && !el.checked) || el.value.trim() === '') {
        valido = false;
        el.style.borderColor = 'red';
        mensagens.push(`O campo "${el.name}" é obrigatório.`);
      } else {
        el.style.borderColor = '';
      }
    });

    const cel = document.getElementById('celular');
    if (cel && !/^\(\d{2}\) \d{5}-\d{4}$/.test(cel.value.trim())) {
      valido = false;
      mensagens.push('Formato de celular inválido. Use (00) 00000-0000.');
      cel.style.borderColor = 'red';
    } else if (cel) {
      cel.style.borderColor = '';
    }

    const cep = document.getElementById('cep');
    if (cep && !/^\d{5}-\d{3}$/.test(cep.value.trim())) {
      valido = false;
      mensagens.push('Formato de CEP inválido. Use 00000-000.');
      cep.style.borderColor = 'red';
    } else if (cep) {
      cep.style.borderColor = '';
    }

    if (!valido) {
      alert(mensagens.join('\n'));
      return;
    }

    const dados = {};
    form.querySelectorAll('input, select, textarea').forEach(el => {
      dados[el.id] = el.type === 'checkbox' ? el.checked : el.value.trim();
    });

    try {
      const resposta = await fetch('/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (resposta.ok) {
        const data = await resposta.json();
        if (data.sucesso) {
          alert('Cadastro realizado com sucesso!');
          form.reset();
        } else {
          alert('Erro ao salvar no banco de dados.');
        }
      } else {
        alert('Erro ao enviar os dados. Tente novamente.');
      }
    } catch (erro) {
      alert('Erro na comunicação com o servidor.');
      console.error(erro);
    }
  });
});
