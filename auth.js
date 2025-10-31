<script type="module">
// =============================
// LS STORE — LOGIN / CADASTRO Firebase (isolado, sem travar splash)
// =============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Config do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAcBWElBXwkN5ynO9JJwelb34ds1GkCEkE",
  authDomain: "ls-store-8d77b.firebaseapp.com",
  projectId: "ls-store-8d77b",
  storageBucket: "ls-store-8d77b.firebasestorage.app",
  messagingSenderId: "267417239385",
  appId: "1:267417239385:web:ce97e459ce7c17584e1648",
  measurementId: "G-VSKFJFGY75"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
import { onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } 
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Garante que o login fique salvo mesmo após atualizar o site
await setPersistence(auth, browserLocalPersistence);

const loginBtn = document.getElementById('login-btn');

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.textContent = 'Sair';
    loginBtn.onclick = async () => {
      await signOut(auth);
      showAlert('Você saiu da sua conta.');
    };
  } else {
    loginBtn.textContent = 'Entrar';
    loginBtn.onclick = abrirLogin;
  }
});
function abrirLogin() {
  const area = document.getElementById('account-area');
  area.innerHTML = `
  <div class="auth-card">
    <div class="auth-title">
      <h3>Entrar</h3>
      <button class="close-auth">✕</button>
    </div>
    <label>Email
      <input type="email" id="emailLogin" placeholder="seuemail@email.com">
    </label>
    <label>Senha
      <div class="password-field">
        <input type="password" id="senhaLogin" placeholder="••••••••">
        <button class="toggle-pass" type="button">👁</button>
      </div>
    </label>
    <button id="entrarBtn" class="add-btn">Entrar</button>
    <button id="abrirCadastro" class="add-btn" style="background:linear-gradient(90deg,#E96BA8,#7A3BFD)">Criar Conta</button>
    <button id="esqueciSenha" class="add-btn" style="background:#f2e6ff;color:#7A3BFD">Esqueci minha senha</button>
  </div>`;

  area.querySelector('.close-auth').onclick = () => area.innerHTML = '';

  const senhaInput = area.querySelector('#senhaLogin');
  area.querySelector('.toggle-pass').onclick = () =>
    senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';

  area.querySelector('#entrarBtn').onclick = async () => {
    const email = document.getElementById('emailLogin').value.trim();
    const senha = document.getElementById('senhaLogin').value.trim();
    if (!email || !senha) return showAlert('Preencha email e senha.');
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      showAlert('Login realizado com sucesso 💜');
      area.innerHTML = '';
    } catch {
      showAlert('Senha ou e-mail incorretos.');
    }
  };

  area.querySelector('#abrirCadastro').onclick = () => abrirCadastro();

  area.querySelector('#esqueciSenha').onclick = async () => {
    const email = document.getElementById('emailLogin').value.trim();
    if (!email) return showAlert('Digite seu email para redefinir a senha.');
    try {
      await sendPasswordResetEmail(auth, email);
      showAlert('Um link foi enviado para redefinir sua senha.');
    } catch {
      showAlert('Erro ao enviar e-mail.');
    }
  };
}

// Cadastro
function abrirCadastro() {
  const area = document.getElementById('account-area');
  area.innerHTML = `
  <div class="auth-card">
    <div class="auth-title">
      <h3>Criar Conta</h3>
      <button class="close-auth">✕</button>
    </div>
    <label>Nome Completo
      <input type="text" id="nomeCadastro" placeholder="Seu nome completo">
    </label>
    <label>Email
      <input type="email" id="emailCadastro" placeholder="seuemail@email.com">
    </label>
    <label>Telefone
      <input type="tel" id="telefoneCadastro" placeholder="(51) 99999-9999">
    </label>
    <label>Senha
      <div class="password-field">
        <input type="password" id="senhaCadastro" placeholder="••••••••">
        <button class="toggle-pass" type="button">👁</button>
      </div>
    </label>
    <button id="criarContaBtn" class="add-btn">Cadastrar</button>
  </div>`;

  area.querySelector('.close-auth').onclick = () => area.innerHTML = '';

  const senhaInput = area.querySelector('#senhaCadastro');
  area.querySelector('.toggle-pass').onclick = () =>
    senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';

  area.querySelector('#criarContaBtn').onclick = async () => {
    const nome = document.getElementById('nomeCadastro').value.trim();
    const email = document.getElementById('emailCadastro').value.trim();
    const tel = document.getElementById('telefoneCadastro').value.trim();
    const senha = document.getElementById('senhaCadastro').value.trim();
    if (!nome || !email || !tel || !senha) return showAlert('Preencha todos os campos.');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      await setDoc(doc(db, 'usuarios', cred.user.uid), { nome, email, telefone: tel, criadoEm: new Date().toISOString() });
      showAlert('Conta criada com sucesso 💖');
      area.innerHTML = '';
    } catch {
      showAlert('Erro ao criar conta. Tente novamente.');
    }
  };
}
// =======================================
// ALERTA LS PREMIUM
// =======================================
function showAlert(msg, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `ls-alert ${type}`;
  alert.textContent = msg;
  document.body.appendChild(alert);
  setTimeout(() => alert.classList.add('visible'), 10);
  setTimeout(() => {
    alert.classList.remove('visible');
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}
</script>
