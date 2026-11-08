(() => {
  'use strict';

  const config = window.SUPABASE_CONFIG;
  const supabaseApi = window.supabase;
  const gate = document.getElementById('loginGate');
  const app = document.getElementById('appShell');
  const form = document.getElementById('loginForm');
  const username = document.getElementById('loginUsername');
  const password = document.getElementById('loginPassword');
  const submit = document.getElementById('loginSubmit');
  const feedback = document.getElementById('loginFeedback');

  if (!config?.url || !config?.publishableKey || typeof supabaseApi?.createClient !== 'function') {
    showUnavailable();
    return;
  }

  function showUnavailable() {
    feedback.textContent = 'Não foi possível carregar a autenticação. Atualize a página e tente novamente.';
    feedback.hidden = false;
    submit.disabled = true;
  }

  // Identificador interno do Supabase Auth. O usuário só informa "Sanja" na tela.
  const INTERNAL_LOGIN_EMAIL = 'sanja-panel-login@example.com';
  const client = supabaseApi.createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storageKey: 'sanja-manual-panel-auth'
    }
  });

  function showFeedback(message) {
    feedback.textContent = message;
    feedback.hidden = !message;
  }

  function setBusy(busy) {
    submit.disabled = busy;
    submit.textContent = busy ? 'Verificando acesso…' : 'Entrar no painel';
  }

  async function hasAccess() {
    const { data, error } = await client.rpc('has_manual_panel_access', {
      p_establishment_id: config.establishmentId
    });
    if (error) throw error;
    return data === true;
  }

  async function authorizeSession() {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    if (!data.session) return false;

    if (!(await hasAccess())) {
      await client.auth.signOut();
      showFeedback('Esta conta ainda não tem permissão para acessar o painel.');
      return false;
    }

    gate.hidden = true;
    app.hidden = false;
    return true;
  }

  window.SANJA_AUTH = Object.freeze({
    async getAccessToken() {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      if (!data.session?.access_token) {
        throw new Error('Sua sessão expirou. Atualize a página e entre novamente.');
      }
      return data.session.access_token;
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showFeedback('');

    if (username.value.trim().toLocaleLowerCase('pt-BR') !== 'sanja') {
      showFeedback('Usuário ou senha incorretos.');
      password.focus();
      return;
    }

    setBusy(true);
    try {
      const { error } = await client.auth.signInWithPassword({
        email: INTERNAL_LOGIN_EMAIL,
        password: password.value
      });
      if (error) throw error;

      if (!(await hasAccess())) {
        await client.auth.signOut();
        throw new Error('Esta conta ainda não tem permissão para acessar o painel.');
      }

      password.value = '';
      gate.hidden = true;
      app.hidden = false;
    } catch (error) {
      showFeedback(
        error.message?.includes('permissão')
          ? error.message
          : 'Não foi possível entrar. Confira o usuário e a senha.'
      );
    } finally {
      setBusy(false);
    }
  });

  (async () => {
    try {
      await authorizeSession();
    } catch {
      showFeedback('Não foi possível validar sua sessão. Confira sua conexão e tente novamente.');
    }
  })();
})();
