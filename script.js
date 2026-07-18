// Filtro de categoria dos animais
const chips = document.querySelectorAll('.chip');
const petCards = document.querySelectorAll('.pet-card');

chips.forEach(chip => {
chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;

    petCards.forEach(card => {
    if (filter === 'todos') {
        card.hidden = false;
        return;
    }
        const categories = (card.dataset.categories || '').split(' ');
        card.hidden = !categories.includes(filter);
    });
});
});

// Favoritar (coração)
document.querySelectorAll('.heart').forEach(btn => {
btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    btn.setAttribute('aria-pressed', btn.classList.contains('active'));
});
});

// ---------- CADASTRO (Adotante / Instituição) ----------
const modalCadastro = document.getElementById('modalCadastro');
const btnAbrirCadastro = document.getElementById('btnAbrirCadastro');
const linkAbrirCadastroMobile = document.querySelector('.abrir-cadastro-link');
const btnFecharCadastro = document.getElementById('btnFecharCadastro');
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.cadastro-form');
const formMsg = document.getElementById('formMsg');

function abrirModalCadastro(tabInicial) {
modalCadastro.hidden = false;
document.body.style.overflow = 'hidden';
if (tabInicial) trocarAba(tabInicial);
}

function fecharModalCadastro() {
modalCadastro.hidden = true;
document.body.style.overflow = '';
esconderMensagem();
}

function trocarAba(nomeAba) {
tabs.forEach(tab => {
    const ativa = tab.dataset.tab === nomeAba;
    tab.classList.toggle('active', ativa);
    tab.setAttribute('aria-selected', ativa);
});
forms.forEach(form => {
    const ativo = form.dataset.tabPanel === nomeAba;
    form.classList.toggle('active', ativo);
    form.hidden = !ativo;
});
esconderMensagem();
}

function mostrarMensagem(texto, tipo) {
    formMsg.textContent = texto;
    formMsg.className = 'form-msg ' + tipo;
    formMsg.hidden = false;
}

function esconderMensagem() {
    formMsg.hidden = true;
    formMsg.textContent = '';
}

if (btnAbrirCadastro) {
btnAbrirCadastro.addEventListener('click', () => abrirModalCadastro('adotante'));
}
if (linkAbrirCadastroMobile) {
linkAbrirCadastroMobile.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.nav-links')?.classList.remove('open');
    abrirModalCadastro('adotante');
});
}
if (btnFecharCadastro) {
btnFecharCadastro.addEventListener('click', fecharModalCadastro);
}
if (modalCadastro) {
modalCadastro.addEventListener('click', (e) => {
    if (e.target === modalCadastro) fecharModalCadastro();
});
}
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && modalCadastro && !modalCadastro.hidden) fecharModalCadastro();
if (e.key === 'Escape' && modalPerfil && !modalPerfil.hidden) fecharModalPerfil();
});

tabs.forEach(tab => {
tab.addEventListener('click', () => trocarAba(tab.dataset.tab));
});

// ---------- PERFIL ----------
const CHAVE_PERFIL = 'pethome_perfil';

const LABELS_ADOTANTE = {
nome: 'Nome completo', cpf: 'CPF', email: 'E-mail', telefone: 'Telefone / WhatsApp',
cidade: 'Cidade', estado: 'Estado', endereco: 'Endereço', moradia: 'Tipo de moradia',
quintal: 'Quintal / área externa', experiencia: 'Já teve pets antes'
};
const LABELS_INSTITUICAO = {
nomeInstituicao: 'Instituição', cnpj: 'CNPJ', responsavel: 'Responsável',
emailInstituicao: 'E-mail', telefoneInstituicao: 'Telefone / WhatsApp',
cidadeInstituicao: 'Cidade', estadoInstituicao: 'Estado', enderecoInstituicao: 'Endereço',
site: 'Site / Instagram', qtdAnimais: 'Animais sob cuidado'
};
const VALORES_LEGIVEIS = {
casa: 'Casa', apartamento: 'Apartamento', sitio: 'Sítio / Chácara',
sim: 'Sim', nao: 'Não'
};

const modalPerfil = document.getElementById('modalPerfil');
const btnAbrirPerfil = document.getElementById('btnAbrirPerfil');
const linkAbrirPerfilMobile = document.getElementById('linkAbrirPerfilMobile');
const btnFecharPerfil = document.getElementById('btnFecharPerfil');
const btnEditarPerfil = document.getElementById('btnEditarPerfil');
const btnSairPerfil = document.getElementById('btnSairPerfil');
const perfilAvatarIniciais = document.getElementById('perfilAvatarIniciais');
const perfilNomeCurto = document.getElementById('perfilNomeCurto');
const perfilAvatarGrande = document.getElementById('perfilAvatarGrande');
const perfilBadgeTipo = document.getElementById('perfilBadgeTipo');
const perfilTitulo = document.getElementById('perfilTitulo');
const perfilSubtitulo = document.getElementById('perfilSubtitulo');
const perfilLista = document.getElementById('perfilLista');

function iniciaisDoNome(nome) {
const partes = (nome || '').trim().split(/\s+/).filter(Boolean);
if (partes.length === 0) return '?';
if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function salvarPerfil(tipo, dados) {
const { senha, confirmarSenha, senhaInstituicao, confirmarSenhaInstituicao, termos, termosInstituicao, ...dadosSemSenha } = dados;
const perfil = { tipo, dados: dadosSemSenha };
localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
return perfil;
}

function carregarPerfil() {
try {
    const bruto = localStorage.getItem(CHAVE_PERFIL);
    return bruto ? JSON.parse(bruto) : null;
} catch {
    return null;
}
}

function removerPerfil() {
localStorage.removeItem(CHAVE_PERFIL);
}

function aplicarEstadoLogado(perfil) {
if (!perfil) {
    document.body.classList.remove('logado');
    return;
}
document.body.classList.add('logado');

const nomeExibicao = perfil.tipo === 'adotante'
    ? perfil.dados.nome
    : perfil.dados.nomeInstituicao;
const iniciais = iniciaisDoNome(nomeExibicao);

if (perfilAvatarIniciais) perfilAvatarIniciais.textContent = iniciais;
if (perfilNomeCurto) perfilNomeCurto.textContent = (nomeExibicao || '').split(' ')[0] || 'Perfil';
}

function renderizarPerfil(perfil) {
const ehAdotante = perfil.tipo === 'adotante';
const labels = ehAdotante ? LABELS_ADOTANTE : LABELS_INSTITUICAO;
const nomeExibicao = ehAdotante ? perfil.dados.nome : perfil.dados.nomeInstituicao;

perfilBadgeTipo.textContent = ehAdotante ? 'Adotante' : 'Instituição parceira';
perfilAvatarGrande.textContent = iniciaisDoNome(nomeExibicao);
perfilTitulo.textContent = nomeExibicao || 'Meu perfil';
perfilSubtitulo.textContent = ehAdotante
    ? (perfil.dados.cidade ? `${perfil.dados.cidade} · ${perfil.dados.estado || ''}` : 'Adotante PetHome')
    : (perfil.dados.cidadeInstituicao ? `${perfil.dados.cidadeInstituicao} · ${perfil.dados.estadoInstituicao || ''}` : 'Instituição parceira PetHome');

perfilLista.innerHTML = '';
Object.entries(labels).forEach(([chave, rotulo]) => {
    const valorBruto = perfil.dados[chave];
    if (!valorBruto) return;
    const valor = VALORES_LEGIVEIS[valorBruto] || valorBruto;

    const item = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = rotulo;
    const dd = document.createElement('dd');
    dd.textContent = valor;
    item.append(dt, dd);
    perfilLista.appendChild(item);
});
}

function abrirModalPerfil() {
const perfil = carregarPerfil();
if (!perfil) {
    abrirModalCadastro('adotante');
    return;
}
renderizarPerfil(perfil);
modalPerfil.hidden = false;
document.body.style.overflow = 'hidden';
}

function fecharModalPerfil() {
modalPerfil.hidden = true;
document.body.style.overflow = '';
}

function preencherFormulario(form, dados) {
Object.entries(dados).forEach(([chave, valor]) => {
    if (form.elements[chave]) form.elements[chave].value = valor;
});
}

if (btnAbrirPerfil) btnAbrirPerfil.addEventListener('click', abrirModalPerfil);
if (linkAbrirPerfilMobile) {
linkAbrirPerfilMobile.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.nav-links')?.classList.remove('open');
    abrirModalPerfil();
});
}
if (btnFecharPerfil) btnFecharPerfil.addEventListener('click', fecharModalPerfil);
if (modalPerfil) {
modalPerfil.addEventListener('click', (e) => {
    if (e.target === modalPerfil) fecharModalPerfil();
});
}
if (btnSairPerfil) {
btnSairPerfil.addEventListener('click', () => {
    removerPerfil();
    aplicarEstadoLogado(null);
    fecharModalPerfil();
});
}
if (btnEditarPerfil) {
btnEditarPerfil.addEventListener('click', () => {
    const perfil = carregarPerfil();
    if (!perfil) return;
    fecharModalPerfil();
    abrirModalCadastro(perfil.tipo);
    const form = perfil.tipo === 'adotante' ? formAdotante : formInstituicao;
    preencherFormulario(form, perfil.dados);
});
}

// Cadastro do adotante
const formAdotante = document.getElementById('formAdotante');
if (formAdotante) {
formAdotante.addEventListener('submit', (e) => {
    e.preventDefault();
    const senha = formAdotante.senha.value;
    const confirmar = formAdotante.confirmarSenha.value;

    if (senha !== confirmar) {
        mostrarMensagem('As senhas informadas não coincidem.', 'error');
        return;
    }
    if (!formAdotante.checkValidity()) {
        formAdotante.reportValidity();
        return;
    }

    const dados = Object.fromEntries(new FormData(formAdotante).entries());
    const perfil = salvarPerfil('adotante', dados);
    aplicarEstadoLogado(perfil);

    mostrarMensagem('Cadastro de adotante realizado com sucesso! Bem-vindo(a) ao PetHome.', 'success');
    formAdotante.reset();
    setTimeout(() => {
        fecharModalCadastro();
        abrirModalPerfil();
    }, 900);
});
}

// Cadastro da instituição
const formInstituicao = document.getElementById('formInstituicao');
if (formInstituicao) {
formInstituicao.addEventListener('submit', (e) => {
    e.preventDefault();
    const senha = formInstituicao.senhaInstituicao.value;
    const confirmar = formInstituicao.confirmarSenhaInstituicao.value;

    if (senha !== confirmar) {
        mostrarMensagem('As senhas informadas não coincidem.', 'error');
        return;
    }
    if (!formInstituicao.checkValidity()) {
        formInstituicao.reportValidity();
        return;
    }

    const dados = Object.fromEntries(new FormData(formInstituicao).entries());
    const perfil = salvarPerfil('instituicao', dados);
    aplicarEstadoLogado(perfil);

    mostrarMensagem('Cadastro de instituição enviado com sucesso! Em breve entraremos em contato.', 'success');
    formInstituicao.reset();
    setTimeout(() => {
        fecharModalCadastro();
        abrirModalPerfil();
    }, 900);
});
}

// Restaura sessão salva ao carregar a página
aplicarEstadoLogado(carregarPerfil());

// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
 menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
});

  // fecha o menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});
}