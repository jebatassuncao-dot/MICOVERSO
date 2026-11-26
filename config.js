/* Configurações opcionais do Micoverso. Veja o arquivo LEIA-ME.txt. */
window.MICOVERSO_CONFIG = {
  /* 1) Assistente Batista com IA para toda a turma:
        cole aqui o endereço do seu Cloudflare Worker, entre aspas.
        Exemplo: aiProxyUrl: "https://micoverso-ia.seunome.workers.dev" */
  aiProxyUrl: "",

  /* 2) Login com Google e Facebook:
        troque null pela configuração do seu projeto Firebase.
        Exemplo: firebase: { apiKey: "...", authDomain: "...", projectId: "...", appId: "..." } */
  firebase: null
};
