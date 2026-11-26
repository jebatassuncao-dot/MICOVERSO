/* MICOVERSO AMAZÔNICO 2.0 — lógica */
"use strict";
const CFG = Object.assign({firebase:null}, window.MICOVERSO_CONFIG||{});
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const esc = s => String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const strip = s => String(s).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const hash = s => {let h=2166136261; for(const c of String(s)){h^=c.charCodeAt(0); h=Math.imul(h,16777619)} return h>>>0};
function shuffle(arr,seed){const a=arr.slice(); let s=hash(seed)||1; for(let i=a.length-1;i>0;i--){s=(Math.imul(s,1103515245)+12345)>>>0; const j=s%(i+1); [a[i],a[j]]=[a[j],a[i]]} return a}
function announce(t){const l=$("#live"); l.textContent=""; setTimeout(()=>l.textContent=t,30)}
function toast(t){$$(".toast").forEach(x=>x.remove()); const el=document.createElement("div"); el.className="toast"; el.setAttribute("role","status"); el.textContent=t; $("#app").appendChild(el); setTimeout(()=>el.remove(),2600)}
const ICON = {
 say:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
 stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 cam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
};

/* ============ ESTADO ============ */
const KEYS="micoverso.v2";
const DEF = ()=>({profile:null, settings:{fs:1,contrast:false,font:"base",spacing:false,motion:true,theme:"system",voice:"",rate:1,libras:false}, done:{}, ex:{}, story:{}, open:{}, diary:{}, maps:{inicial:[],final:[]}});
let S = DEF();
try{const raw=localStorage.getItem(KEYS); if(raw){const p=JSON.parse(raw); S=Object.assign(DEF(),p); S.settings=Object.assign(DEF().settings,p.settings||{}); if(S.profile) delete S.profile.email;}}catch(e){}
function save(){try{localStorage.setItem(KEYS,JSON.stringify(S))}catch(e){toast("Não foi possível salvar neste aparelho.")}}
function applySettings(){
  const r=document.documentElement, st=S.settings;
  r.style.setProperty("--fs",st.fs);
  st.theme==="system"?r.removeAttribute("data-theme"):r.setAttribute("data-theme",st.theme);
  r.setAttribute("data-contrast",st.contrast?"on":"off");
  r.setAttribute("data-font",st.font);
  r.setAttribute("data-spacing",st.spacing?"on":"off");
  r.setAttribute("data-motion",st.motion?"on":"off");
}
applySettings();

/* ============ ILUSTRAÇÕES ============ */
function art(kind,c,bg){
  const B=`<circle cx="50" cy="50" r="48" fill="${bg||"var(--surface2)"}"/>`;
  const S2=x=>`<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${B}${x}</svg>`;
  switch(kind){
   case "orelha": return S2(`<rect x="10" y="62" width="80" height="16" rx="8" fill="#7A5A3A"/><path d="M22 62q14-22 30 0z" fill="${c||'#E2622A'}"/><path d="M44 48q16-20 34 0z" fill="${c||'#E2622A'}"/><path d="M30 40q10-14 22 0z" fill="${c||'#E2622A'}" opacity=".85"/>`);
   case "taca": return S2(`<path d="M28 40q22 34 44 0z" fill="${c||'#E0507A'}"/><ellipse cx="50" cy="40" rx="22" ry="6" fill="#8E2A4C"/><path d="M50 58v18" stroke="#7A5A3A" stroke-width="5"/><rect x="20" y="74" width="60" height="8" rx="4" fill="#7A5A3A"/>`);
   case "veu": return S2(`<path d="M46 34h8v46h-8z" fill="#F4F0E4"/><path d="M38 34q12-22 24 0z" fill="#3A2E22"/><g fill="none" stroke="#BDB39C" stroke-width="1.6"><path d="M38 36q-8 20-6 40h36q2-20-6-40"/><path d="M34 50h32M33 62h34M32 72h36M44 36l-4 40M56 36l4 40M50 36v40"/></g>`);
   case "estrela": return S2(`<g fill="${c||'#B98B5A'}">${Array.from({length:7},(_,i)=>{const a=i*2*Math.PI/7,f=v=>v.toFixed(1);return `<path d="M50 58L${f(50+Math.cos(a-.25)*14)} ${f(58+Math.sin(a-.25)*9)}L${f(50+Math.cos(a)*34)} ${f(58+Math.sin(a)*20)}L${f(50+Math.cos(a+.25)*14)} ${f(58+Math.sin(a+.25)*9)}z"/>`}).join("")}</g><circle cx="50" cy="50" r="13" fill="#8C6A48"/><circle cx="50" cy="38" r="2" fill="#3A2E22"/>`);
   case "formiga": return S2(`<g fill="#EDE3C8">${[[30,66,10],[46,72,12],[64,66,11],[54,58,9],[38,58,8]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}"/>`).join("")}</g><g fill="#8A3A1E"><ellipse cx="40" cy="34" rx="5" ry="4"/><ellipse cx="50" cy="34" rx="5" ry="3.5"/><ellipse cx="62" cy="34" rx="8" ry="5"/></g><path d="M36 30q-6-8-12-6M70 30l10-10" stroke="#8A3A1E" stroke-width="2" fill="none"/><path d="M68 22l14 4-6 10z" fill="#4E9A4A"/>`);
   case "zumbi": return S2(`<path d="M14 70q36-14 72 0" stroke="#4E9A4A" stroke-width="10" fill="none"/><g fill="#5A3A22"><ellipse cx="40" cy="60" rx="5" ry="4"/><ellipse cx="50" cy="60" rx="5" ry="3.5"/><ellipse cx="61" cy="61" rx="7" ry="4.5"/></g><path d="M38 56q-6-20 2-34" stroke="${c||'#C9A13B'}" stroke-width="3" fill="none"/><circle cx="40" cy="22" r="5" fill="${c||'#C9A13B'}"/>`);
   case "vassoura": return S2(`<ellipse cx="54" cy="58" rx="16" ry="24" fill="#D8A13A" transform="rotate(-15 54 58)"/><g fill="#5A3A22"><circle cx="50" cy="52" r="5"/><circle cx="60" cy="66" r="4"/><circle cx="56" cy="44" r="3"/></g><path d="M30 20v28M30 30l-10-8M30 30l9-9M30 40l-8-5" stroke="#6E4A2A" stroke-width="3" fill="none"/>`);
   case "luz": return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="48" fill="${bg||'#132018'}"/><g opacity=".35" fill="${c||'#7FE3A6'}"><circle cx="38" cy="50" r="18"/><circle cx="64" cy="58" r="14"/></g><path d="M37 50v22M63 58v16" stroke="#BDE8CB" stroke-width="3"/><path d="M27 52q11-18 22 0z" fill="${c||'#7FE3A6'}"/><path d="M55 59q8-14 16 0z" fill="${c||'#7FE3A6'}"/><rect x="18" y="74" width="64" height="8" rx="4" fill="#3A2E22"/></svg>`;
   case "levedura": return S2(`<g fill="${c||'#E7C98A'}" stroke="#A9864A" stroke-width="2">${[[40,46,14,11],[62,40,10,8],[56,64,12,9],[32,66,8,6],[72,56,6,5]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="${p[2]}" ry="${p[3]}"/>`).join("")}</g>`);
   case "bolor": return S2(`<path d="M18 70V44q0-16 16-16h32q16 0 16 16v26z" fill="#E6C48E"/><path d="M24 70V46q0-12 12-12h28q12 0 12 12v24z" fill="#F4E3BF"/>${[[40,48],[58,56],[48,62],[64,44],[34,60]].map(p=>`<g fill="${c||'#4F9A8A'}"><circle cx="${p[0]}" cy="${p[1]}" r="6" opacity=".6"/><circle cx="${p[0]}" cy="${p[1]}" r="3"/></g>`).join("")}`);
   case "liquen": return S2(`<rect x="14" y="20" width="22" height="64" rx="4" fill="#7A5A3A"/>${[[40,34,10],[48,52,13],[42,70,9],[60,42,8]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="${c||'#9DB88A'}" stroke="#6E8C5E" stroke-width="2" stroke-dasharray="3 2"/>`).join("")}`);
   case "micorriza": return S2(`<rect x="2" y="44" width="96" height="2" fill="#7A5A3A"/><path d="M50 20v24" stroke="#4E9A4A" stroke-width="4"/><path d="M42 24q8-10 8 0M58 24q-8-10-8 0" fill="#4E9A4A"/><g stroke="#8A6236" stroke-width="3" fill="none"><path d="M50 46v20l-10 14M50 60l12 16M50 52l-14 8"/></g><g stroke="${c||'#D9B26B'}" stroke-width="1.3" fill="none"><path d="M40 80q-12 4-20-6M62 76q10 6 20-2M36 60q-10-4-16 4M62 76q4 10 14 12M40 80q2 8-6 12"/></g>`);
   case "hifa": return S2(`<g stroke="#1E6A5A" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M14 70q20-6 36-24t36-18"/><path d="M32 64q2-14 14-22"/><path d="M50 46q14 10 30 8"/><path d="M62 38q-2-14 8-22"/><path d="M24 68q-2 10 6 16"/><path d="M68 52q4 12 14 16"/></g><circle cx="86" cy="28" r="3" fill="#C7531F"/>`);
   case "esporo": return S2(`${[[30,30,5],[50,22,4],[68,34,6],[40,50,3],[60,56,5],[34,70,4],[72,68,3],[52,76,4],[24,50,3]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#C7531F" opacity="${(0.5+p[2]/12).toFixed(2)}"/>`).join("")}<path d="M14 84q20-8 40-2t32-2" stroke="#8A7F6A" stroke-width="2" fill="none" stroke-dasharray="4 4"/>`);
   case "cogumelo": return S2(`<path d="M44 46h12l2 32H42z" fill="#EFE6D2"/><path d="M18 48q32-46 64 0z" fill="${c||'#B5643A'}"/><g stroke="#6E3A20" stroke-width="1.2" opacity=".6">${Array.from({length:11},(_,i)=>`<path d="M${24+i*5.2} 48l${(i-5)*0.6} 4"/>`).join("")}</g><rect x="20" y="78" width="60" height="6" rx="3" fill="#7A5A3A"/>`);
   case "enzima": return S2(`<rect x="22" y="58" width="56" height="20" rx="6" fill="#8A6236"/><path d="M30 58q4-14 0-30M50 58q-4-16 4-34M70 58q4-12-2-26" stroke="#1E6A5A" stroke-width="3" fill="none"/>${[[38,48],[60,46],[46,40],[66,52]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="#C7531F"/>`).join("")}`);
   case "quitina": return S2(`<g fill="none" stroke="#1E6A5A" stroke-width="2.5">${[[34,40],[52,40],[70,40],[43,56],[61,56],[34,72],[52,72],[70,72]].map(p=>`<path d="M${p[0]-9} ${p[1]}l4.5-8h9l4.5 8-4.5 8h-9z"/>`).join("")}</g>`);
   case "pele": return S2(`<path d="M30 80V40q0-12 10-12h4v52zM46 80V30q0-8 8-8s8 8 8 8v50zM64 80V38q0-8 8-8s6 6 6 10v40z" fill="${c||'#C89A72'}"/>${[[52,50],[58,62],[70,52]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#F3EDE1" opacity=".9"/>`).join("")}`);
   case "alerta": return S2(`<path d="M50 18L84 78H16z" fill="#F6E9C9" stroke="#C7531F" stroke-width="4" stroke-linejoin="round"/><path d="M50 40v20" stroke="#C7531F" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="69" r="3.5" fill="#C7531F"/>`);
   case "saber": return S2(`<path d="M24 74V30l26 8 26-8v44l-26 8z" fill="#F9FAF3" stroke="#1E6A5A" stroke-width="3" stroke-linejoin="round"/><path d="M50 38v44" stroke="#1E6A5A" stroke-width="3"/><path d="M58 56q6-12 12 0z" fill="#E2622A"/><path d="M63 56v8" stroke="#7A5A3A" stroke-width="2"/>`);
   case "ninho": return S2(`<path d="M30 46h40l-8 30H38z" fill="${c||'#9C7B5B'}"/><ellipse cx="50" cy="46" rx="20" ry="6" fill="#5A4430"/>${[[44,46],[52,45],[58,47]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="3.5" ry="2.6" fill="#D9D2C4"/>`).join("")}<rect x="18" y="74" width="64" height="8" rx="4" fill="#7A5A3A"/>`);
   case "xylaria": return S2(`<rect x="16" y="70" width="68" height="10" rx="5" fill="#7A5A3A"/>${[[36,30],[50,22],[64,34]].map(p=>`<path d="M${p[0]-4} 70V${p[1]+6}q4-10 8 0V70z" fill="${c||'#2E2620'}"/><path d="M${p[0]} ${p[1]+2}v-6" stroke="#F1E8D4" stroke-width="2" stroke-linecap="round"/>`).join("")}`);
   case "sapo": return S2(`<ellipse cx="50" cy="60" rx="28" ry="18" fill="${c||'#6BAA5A'}"/><circle cx="38" cy="42" r="8" fill="${c||'#6BAA5A'}"/><circle cx="62" cy="42" r="8" fill="${c||'#6BAA5A'}"/><circle cx="38" cy="41" r="3.5" fill="#1A1A1A"/><circle cx="62" cy="41" r="3.5" fill="#1A1A1A"/><path d="M40 62q10 6 20 0" stroke="#2E5A26" stroke-width="2.5" fill="none" stroke-linecap="round"/>${[[30,66],[70,64],[54,72]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="#E8E4D6"/>`).join("")}`);
   case "lupa": return S2(`<circle cx="44" cy="44" r="18" fill="#F9FAF3" stroke="#1E6A5A" stroke-width="5"/><path d="M57 57l18 18" stroke="#1E6A5A" stroke-width="8" stroke-linecap="round"/><path d="M34 48q10-16 20 0z" fill="#E2622A"/><path d="M43 48v6" stroke="#7A5A3A" stroke-width="2"/>`);
   case "relogio": return S2(`<path d="M30 24h40M30 76h40" stroke="#7A5A3A" stroke-width="5" stroke-linecap="round"/><path d="M34 26q0 18 16 24q16-6 16-24zM34 74q0-18 16-24q16 6 16 24z" fill="#F9FAF3" stroke="#1E6A5A" stroke-width="3"/><path d="M42 72q8-10 16 0z" fill="#E2622A"/>`);
   case "mapa": return S2(`<g stroke="#1E6A5A" stroke-width="2.5"><path d="M30 34L50 60M70 34L50 60M50 60v16"/></g><rect x="16" y="24" width="28" height="14" rx="4" fill="#D3E6DE" stroke="#1E6A5A" stroke-width="2"/><rect x="56" y="24" width="28" height="14" rx="4" fill="#D3E6DE" stroke="#1E6A5A" stroke-width="2"/><rect x="34" y="54" width="32" height="14" rx="4" fill="#F6E9C9" stroke="#C7531F" stroke-width="2"/>`);
   case "lista": return S2(`<rect x="26" y="20" width="48" height="62" rx="6" fill="#F9FAF3" stroke="#1E6A5A" stroke-width="3"/>${[34,48,62].map(y=>`<path d="M34 ${y}l4 4 7-8" stroke="#C7531F" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M50 ${y+1}h16" stroke="#8A7F6A" stroke-width="3" stroke-linecap="round"/>`).join("")}`);
   case "camera": return S2(`<rect x="20" y="34" width="60" height="40" rx="8" fill="#2A2117"/><path d="M38 34l5-8h14l5 8" fill="#2A2117"/><circle cx="50" cy="54" r="13" fill="#F9FAF3"/><circle cx="50" cy="54" r="7" fill="#E2622A"/>`);
  }
  return S2("");
}
function avatarHTML(av){
  if(!av) av="k:0";
  if(av.startsWith("img:")) return `<img src="${esc(av.slice(4))}" alt="">`;
  const i=+(av.split(":")[1]||0), a=AVATARS[i]||AVATARS[0];
  return art(a[0],a[1],a[2]);
}
function ring(pct){const c=2*Math.PI*46; return `<svg class="pr" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="6"/><circle cx="50" cy="50" r="46" fill="none" stroke="#FFE7A8" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(c*pct).toFixed(1)} ${c.toFixed(1)}"/></svg>`}

/* ============ VOZ (leitura em voz alta) ============ */
const TTS = {
  ok: "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
  voices: [], btn: null, queue: [], keep: null,
  init(){ if(!this.ok) return; const load=()=>{ try{this.voices=speechSynthesis.getVoices()||[]}catch(e){this.voices=[]} }; load(); try{speechSynthesis.addEventListener("voiceschanged",load)}catch(e){speechSynthesis.onvoiceschanged=load} },
  ptVoices(){ return this.voices.filter(v=>/^pt/i.test(v.lang)).sort((a,b)=>(/BR/i.test(b.lang)?1:0)-(/BR/i.test(a.lang)?1:0)) },
  pick(){ const id=S.settings.voice; if(id){const v=this.voices.find(x=>x.voiceURI===id||x.name===id); if(v) return v} return this.ptVoices()[0]||null },
  chunks(text){ const out=[]; (strip(text).match(/[^.!?…:;]+[.!?…:;]*\s*/g)||[]).map(x=>x.trim()).forEach(s=>{ while(s.length>220){let k=s.lastIndexOf(",",220); if(k<60) k=s.lastIndexOf(" ",220); if(k<1) k=220; out.push(s.slice(0,k+1)); s=s.slice(k+1).trim()} if(s) out.push(s) }); return out },
  stop(){ if(!this.ok) return; this.queue=[]; clearInterval(this.keep); try{speechSynthesis.cancel()}catch(e){} this.setBtn(null) },
  setBtn(b){ if(this.btn){this.btn.setAttribute("aria-pressed","false"); this.btn.innerHTML=ICON.say+"<span>"+(this.btn.dataset.label||"Ouvir")+"</span>"} this.btn=b; if(b){b.setAttribute("aria-pressed","true"); b.innerHTML=ICON.stop+"<span>Parar</span>"} },
  speak(text,btn){
    if(!this.ok){ toast("Seu navegador não tem leitura em voz alta."); return }
    const was = speechSynthesis.speaking||speechSynthesis.pending;
    if(btn && this.btn===btn){ this.stop(); return }
    this.stop(); this.setBtn(btn||null);
    this.queue=this.chunks(text);
    const run=()=>this.next();
    if(was) setTimeout(run,180); else run();   // falar direto no toque (exigência do iPhone)
    clearInterval(this.keep); this.keep=setInterval(()=>{ try{ if(speechSynthesis.speaking && !speechSynthesis.paused){speechSynthesis.pause(); speechSynthesis.resume()} }catch(e){} },10000);
  },
  next(){
    const t=this.queue.shift(); if(!t){ clearInterval(this.keep); this.setBtn(null); return }
    const u=new SpeechSynthesisUtterance(t); const v=this.pick();
    if(v){u.voice=v; u.lang=v.lang} else u.lang="pt-BR";
    u.rate=S.settings.rate||1; u.pitch=1; u.volume=1;
    u.onend=()=>this.next(); u.onerror=e=>{ if(e.error!=="interrupted"&&e.error!=="canceled"){ this.queue=[]; this.setBtn(null); toast("Não foi possível ler em voz alta. Tente escolher outra voz em Acessibilidade.") } };
    try{ speechSynthesis.speak(u) }catch(e){ this.setBtn(null) }
  }
};
TTS.init();
const SAYS=new Map(); let sayN=0;
function sayBtn(text,label="Ouvir",mini){ const id="s"+(++sayN); SAYS.set(id,text); return `<button type="button" class="say${mini?" mini":""}" data-sid="${id}" data-label="${esc(label)}" aria-pressed="false">${ICON.say}<span>${esc(label)}</span></button>` }
document.addEventListener("click",e=>{ const b=e.target.closest("[data-sid]"); if(b){ e.preventDefault(); TTS.speak(SAYS.get(b.dataset.sid)||"",b) } });

/* ============ FOLHAS (sheets) e navegação ============ */
const sheets=[];
function openSheet({title,sub="",onClose}={}){
  TTS.stop();
  const el=document.createElement("section"); el.className="sheet"; el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true"); el.setAttribute("aria-label",title||"");
  el.innerHTML=`<div class="sheet-head"><button class="iconbtn" data-close aria-label="Voltar">${ICON.back}</button><div class="t"><b></b><small></small><div class="steps" hidden></div></div><span data-right></span></div><div class="sheet-body" tabindex="-1"></div><div class="sheet-foot" hidden></div>`;
  $(".t b",el).textContent=title||""; $(".t small",el).textContent=sub;
  $("#app").appendChild(el);
  const api={el, body:$(".sheet-body",el), foot:$(".sheet-foot",el), steps:$(".steps",el), right:$("[data-right]",el), onClose,
    setTitle(t,s){$(".t b",el).textContent=t; if(s!=null) $(".t small",el).textContent=s},
    close(){ history.back() }};
  $("[data-close]",el).onclick=()=>api.close();
  sheets.push(api); try{history.pushState({sheet:sheets.length},"")}catch(e){}
  setTimeout(()=>$("[data-close]",el).focus(),40);
  return api;
}
function popSheet(){ const s=sheets.pop(); if(!s) return; TTS.stop(); s.el.remove(); s.onClose&&s.onClose(); const top=sheets[sheets.length-1]; if(top&&top.refresh) top.refresh(); if(!top) renderTab() }
let afterPop=null;
function closeThen(fn){ afterPop=fn; history.back() }
let bulkPop=null;
window.addEventListener("popstate",()=>{ if(bulkPop){ const f=bulkPop; bulkPop=null; setTimeout(f,0); return } if(Drawer.open){ Drawer.close(true); return } if(sheets.length) popSheet(); if(afterPop){ const f=afterPop; afterPop=null; setTimeout(f,0) } });
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&(sheets.length||Drawer.open)) history.back() });

let tab="inicio";
function setTab(t){ tab=t; TTS.stop(); $$("#tabs button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===t?"page":"false")); const v=$("#view"); v.scrollTop=0; renderTab(); }
function renderTab(){ const v=$("#view"); ({inicio:viewInicio,encontros:viewEncontros,micoteca:viewMicoteca,batista:viewBatista,perfil:viewPerfil})[tab](v) }
$$("#tabs button").forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
$("#a11yBtn").onclick=openA11y;

/* ============ PROGRESSO ============ */
const doneCount=()=>MISSIONS.filter(m=>S.done[m.id]).length;
const exCount=()=>Object.keys(S.ex).length + Object.keys(S.open).filter(k=>S.open[k]&&S.open[k].trim()).length;
const firstName=()=>((S.profile&&S.profile.name)||"").split(" ")[0];

/* ============ INÍCIO ============ */
let curI=Math.floor(Math.random()*CURIOS.length);
function viewInicio(v){
  const n=doneCount(), next=MISSIONS.find(m=>!S.done[m.id]);
  const c=CURIOS[curI%CURIOS.length];
  v.innerHTML=`<div class="stack">
   <button class="hero" id="goPerfil" aria-label="Abrir perfil">
     <div class="ring">${ring(n/6)}<div class="av">${avatarHTML(S.profile&&S.profile.avatar)}</div></div>
     <div style="min-width:0"><h1>Olá, ${esc(firstName()||"explorador(a)")}!</h1><p>${n===6?"Você concluiu os 6 encontros.":`${n} de 6 encontros concluídos`}${S.profile&&S.profile.turma?" · "+esc(S.profile.turma):""}</p></div>
   </button>
   ${next?`<button class="box cont" id="goNext"><div class="art">${art(next.art)}</div><div style="min-width:0"><p class="eyebrow">${n?"Continue de onde parou":"Comece por aqui"}</p><h3 style="font-size:1.15rem">Encontro ${MISSIONS.indexOf(next)+1}: ${esc(next.title)}</h3><p class="note">${esc(next.sub)}</p></div></button>`:""}
   <section aria-label="Curiosidades da Amazônia" class="carousel">
     <p class="eyebrow" style="margin-bottom:8px">Você sabia? · Amazônia</p>
     <div class="cur-card pop" aria-live="polite"><div class="art">${art(c.art)}</div><div style="min-width:0;display:flex;flex-direction:column;gap:6px"><h3 style="font-size:1.08rem">${esc(c.t)}</h3><p>${esc(c.p)}</p><div>${sayBtn(c.t+". "+c.p,"Ouvir",true)}</div></div></div>
     <div class="cur-nav"><button class="btn ghost small" id="curPrev" aria-label="Curiosidade anterior">‹ Anterior</button><div class="dots" aria-hidden="true">${CURIOS.map((_,i)=>`<i class="${i===curI%CURIOS.length?"on":""}"></i>`).join("")}</div><button class="btn ghost small" id="curNext" aria-label="Próxima curiosidade">Próxima ›</button></div>
   </section>
   <div><p class="eyebrow" style="margin-bottom:8px">Explorar</p>
   <div class="tiles">
     <button class="tile" data-go="historias"><div class="art">${art("saber")}</div><b>Histórias da floresta</b><span>A saga de Iara em 6 capítulos</span></button>
     <button class="tile" data-go="tempo"><div class="art">${art("relogio")}</div><b>Linha do tempo</b><span>De Teofrasto aos Yanomami</span></button>
     <button class="tile" data-go="palavras"><div class="art">${art("quitina")}</div><b>De onde vêm as palavras</b><span>Micologia, fungo, hifa…</span></button>
     <button class="tile" data-go="fungario"><div class="art">${art("camera")}</div><b>Meu fungário</b><span>Fotografe e classifique</span></button>
     <button class="tile" data-go="revisao"><div class="art">${art("lista")}</div><b>Atividades de fixação</b><span>Revise cada encontro</span></button>
     <button class="tile" data-go="mapa"><div class="art">${art("mapa")}</div><b>Mapa conceitual</b><span>Inicial e final</span></button>
   </div></div></div>`;
  $("#goPerfil").onclick=()=>setTab("perfil");
  const gn=$("#goNext"); if(gn) gn.onclick=()=>openMission(next.id);
  $("#curPrev").onclick=()=>{curI=(curI-1+CURIOS.length)%CURIOS.length; viewInicio(v)};
  $("#curNext").onclick=()=>{curI=(curI+1)%CURIOS.length; viewInicio(v)};
  $$("[data-go]",v).forEach(b=>b.onclick=()=>({historias:openHistorias,tempo:openTimeline,palavras:openPalavras,fungario:()=>{micoMode="fungario";setTab("micoteca")},revisao:openRevisao,mapa:openMapa})[b.dataset.go]());
}

/* ============ ENCONTROS ============ */
function viewEncontros(v){
  const n=doneCount(), next=MISSIONS.find(m=>!S.done[m.id]);
  v.innerHTML=`<div class="stack"><div><p class="eyebrow">Sequência didática</p><h1 style="font-size:1.6rem">Encontros</h1><p class="lead">Cada encontro tem um capítulo da história, conceitos, contexto histórico, curiosidade, atividade prática, atividades de fixação e tarefa do lapbook.</p></div>
   <div><div class="row" style="justify-content:space-between;margin-bottom:6px"><span class="eyebrow">Progresso</span><span style="font-variant-numeric:tabular-nums;font-weight:700">${n} de 6</span></div><div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${n}"><i style="width:${n/6*100}%"></i></div></div>
   <div class="trail">${MISSIONS.map((m,i)=>{const d=S.done[m.id],nx=next&&next.id===m.id;return `<button class="node ${d?"done":""} ${nx?"next":""}" data-m="${m.id}"><span class="num" aria-hidden="true">${d?"✓":i+1}</span><span class="info"><div><span class="tag ${d?"ok":nx?"go":""}">${d?"Concluído":nx?"Próximo":"Encontro "+(i+1)}</span><h3>${esc(m.title)}</h3><p class="meta">${esc(m.sub)}</p></div><span class="art">${art(m.art)}</span></span><span class="sr">Encontro ${i+1}${d?", concluído":""}</span></button>`}).join("")}</div></div>`;
  $$(".node",v).forEach(b=>b.onclick=()=>openMission(b.dataset.m));
}
function missionSteps(m){
  const st=[{k:"story",l:"História"},{k:"words",l:"Palavras e história"}];
  m.cards.forEach((c,i)=>st.push({k:"card",c,i,l:"Conceito"}));
  st.push({k:"curio",l:"Você sabia?"},{k:"pratica",l:"Mão na massa"},{k:"ex",l:"Atividades de fixação"});
  if(m.map) st.push({k:"map",l:"Mapa conceitual"});
  st.push({k:"lap",l:"Lapbook"},{k:"diario",l:"Diário de bordo"},{k:"end",l:"Conclusão"});
  return st;
}
function openMission(id){
  const m=MISSIONS.find(x=>x.id===id), steps=missionSteps(m), idx=MISSIONS.indexOf(m)+1;
  let i=0;
  const sh=openSheet({title:`Encontro ${idx}: ${m.title}`});
  sh.steps.hidden=false; sh.foot.hidden=false;
  function draw(){
    TTS.stop();
    const s=steps[i], b=sh.body;
    sh.setTitle(`Encontro ${idx}: ${m.title}`,`${s.l} · passo ${i+1} de ${steps.length}`);
    sh.steps.innerHTML=steps.map((_,j)=>`<i class="${j<=i?"on":""}"></i>`).join("");
    b.innerHTML=""; b.scrollTop=0;
    const wrap=document.createElement("div"); wrap.className="stack pop"; b.appendChild(wrap);
    if(s.k==="story"){ wrap.innerHTML=`<div><p class="eyebrow">Capítulo ${idx}</p><h2 style="font-size:1.7rem">${esc(m.story.title)}</h2></div><div id="storyHost"></div>`; renderStory(m, $("#storyHost",wrap)); }
    else if(s.k==="words"){ wrap.innerHTML=`<div><p class="eyebrow">Palavras e história</p><h2 style="font-size:1.5rem">De onde vêm as palavras?</h2></div>
       <div class="words">${m.words.map(w=>`<div class="word"><b>${esc(w[0])}</b><p>${esc(w[1])}</p></div>`).join("")}</div>${sayBtn(m.words.map(w=>w[0]+". "+w[1]).join(" "),"Ouvir as palavras")}
       <div><p class="eyebrow" style="margin:8px 0">Na história da ciência</p><div class="tl">${m.hist.map(h=>`<div class="tl-item"><div class="tl-year">${esc(h[0])}</div><p>${esc(h[1])}</p></div>`).join("")}</div></div>
       <button class="btn ghost" id="tlAll" style="align-self:flex-start">Ver a linha do tempo completa</button>`; $("#tlAll",wrap).onclick=openTimeline; }
    else if(s.k==="card"){ wrap.classList.add("concept"); wrap.innerHTML=`<div class="art">${art(s.c.art)}</div><p class="eyebrow">Conceito ${s.i+1} de ${m.cards.length}</p><h2>${esc(s.c.h)}</h2><div class="tablewrap"><p>${s.c.p}</p></div><div>${sayBtn(s.c.h+". "+s.c.p)}</div>`; }
    else if(s.k==="curio"){ wrap.innerHTML=`<div class="curio"><div class="art">${art(m.curio.art)}</div><p class="eyebrow">Você sabia?</p><h2 style="font-size:1.45rem">${esc(m.curio.t)}</h2><p style="font-size:1.06rem">${esc(m.curio.p)}</p><div>${sayBtn(m.curio.t+". "+m.curio.p)}</div></div>`; }
    else if(s.k==="pratica"){ const p=m.pratica; wrap.innerHTML=`<div><p class="eyebrow">Mão na massa</p><h2 style="font-size:1.5rem">${esc(p.t)}</h2><p class="lead" style="margin-top:4px"><b>Objetivo:</b> ${esc(p.obj)}</p></div>
       <div class="box prat"><h3 style="font-size:1.05rem">Materiais</h3><ul>${p.mat.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
       <div class="box prat"><h3 style="font-size:1.05rem">Como fazer</h3><ol>${p.passos.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
       <div class="warnbox"><b>Cuidados:</b> ${esc(p.seg)}</div>
       ${p.reg?`<div class="field"><label for="reg_${m.id}">Registro: ${esc(p.reg)}</label><textarea id="reg_${m.id}" data-open="reg:${m.id}">${esc(S.open["reg:"+m.id]||"")}</textarea></div>`:""}
       <div class="row">${sayBtn(p.t+". Objetivo: "+p.obj+". Materiais: "+p.mat.join(", ")+". Como fazer: "+p.passos.join(" ")+" Cuidados: "+p.seg)}${p.link==="fungario"?`<button class="btn" id="goFg">${ICON.cam}Abrir Meu fungário</button>`:""}</div>`;
       const g=$("#goFg",wrap); if(g) g.onclick=()=>openFungarioForm(); bindOpen(wrap); }
    else if(s.k==="ex"){ wrap.innerHTML=`<div><p class="eyebrow">Atividades de fixação</p><h2 style="font-size:1.5rem">Retome o que estudou</h2><p class="lead">Responda e confira a explicação de cada questão. Você pode refazer quando quiser.</p></div><div class="stack" id="exHost"></div>`; const h=$("#exHost",wrap); m.ex.forEach((e,j)=>h.appendChild(exercise(e,`${m.id}:${j}`))); }
    else if(s.k==="map"){ wrap.innerHTML=`<div><p class="eyebrow">Mapa conceitual ${m.map}</p><h2 style="font-size:1.5rem">${m.map==="inicial"?"O que você já sabe?":"O que você sabe agora?"}</h2><p class="lead">${m.map==="inicial"?"Ligue conceitos com palavras de ligação formando frases (proposições). É o seu ponto de partida; não há certo ou errado.":"Monte o mapa de novo e compare com o do 1º encontro."}</p></div><div id="mapHost"></div>`; mapBuilder($("#mapHost",wrap),m.map); }
    else if(s.k==="lap"){ wrap.innerHTML=`<p class="eyebrow">Lapbook</p><div class="lap"><h3>${esc(m.lap.t)}</h3><p>Registre no seu lapbook:</p><ul>${m.lap.items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>${sayBtn(m.lap.t+". "+m.lap.items.join(" "))}`; }
    else if(s.k==="diario"){ wrap.innerHTML=`<div><p class="eyebrow">Diário de bordo</p><h2 style="font-size:1.5rem">Pense e escreva</h2></div><div class="field"><label for="dia_${m.id}">${esc(m.diario)}</label><textarea id="dia_${m.id}" data-diary="${m.id}" style="min-height:160px">${esc(S.diary[m.id]||"")}</textarea><p class="note" style="margin-top:6px">Fica salvo automaticamente neste aparelho.</p></div>`; const t=$("textarea",wrap); t.oninput=()=>{S.diary[m.id]=t.value; save()}; }
    else { const nm=MISSIONS[idx]; const answered=m.ex.filter((_,j)=>S.ex[`${m.id}:${j}`]||S.open[`${m.id}:${j}`]).length;
      wrap.style.alignItems="center"; wrap.style.textAlign="center";
      wrap.innerHTML=`<div style="width:120px">${art(m.art)}</div><p class="eyebrow">Encontro ${idx} concluído</p><h2 style="font-size:1.7rem">${esc(m.title)}</h2><p class="lead">Você respondeu ${answered} de ${m.ex.length} atividades de fixação.</p>${nm?`<button class="btn" id="nextM">Ir para o Encontro ${idx+1}</button>`:`<p>Parabéns, você completou a sequência!</p>`}`;
      const nb=$("#nextM",wrap); if(nb) nb.onclick=()=>closeThen(()=>openMission(nm.id)); }
    sh.foot.innerHTML=`<button class="btn ghost" id="pv" ${i===0?"disabled":""}>Voltar</button><button class="btn" id="nx">${s.k==="end"?"Fechar":"Continuar"}</button>`;
    $("#pv",sh.foot).onclick=()=>{if(i>0){i--;draw()}};
    $("#nx",sh.foot).onclick=()=>{ if(s.k==="end"){sh.close();return} i++; if(steps[i].k==="end"&&!S.done[m.id]){S.done[m.id]=true; save()} draw(); sh.body.focus&&sh.body.focus() };
  }
  sh.refresh=()=>{}; draw();
}
function bindOpen(root){ $$("[data-open]",root).forEach(t=>t.oninput=()=>{S.open[t.dataset.open]=t.value; save()}) }

/* ---------- História com pausas ---------- */
function renderStory(m,host){
  const st=m.story, sid=m.id;
  const rec=S.story[sid]||(S.story[sid]={n:0,ans:{}});
  function reveal(){ while(rec.n<st.segs.length && st.segs[rec.n].p){ rec.n++ } } // mostra parágrafos até a próxima pausa
  if(rec.n===0) reveal();
  function draw(){
    let h=`<div class="story"><div class="scene">${art(st.art)}</div>`;
    const lim=Math.min(rec.n,st.segs.length-1);
    for(let j=0;j<=lim;j++){
      const sg=st.segs[j]; if(j===rec.n && sg.p) break;
      if(sg.p){ h+=`<div class="para-wrap"><p class="para">${esc(sg.p)}</p><div>${sayBtn(sg.p,"Ouvir trecho",true)}</div></div>` }
      else {
        const a=rec.ans[j];
        h+=`<div class="pause" role="group" aria-label="Pausa para pensar"><p class="eyebrow">Pausa para pensar</p><h3>${esc(sg.q)}</h3>`+
          shuffle(sg.o.map((t,k)=>k),sid+j).map(k=>{let cls="opt"; if(a!=null){ if(k===sg.a) cls+=" right"; else if(k===a) cls+=" wrong"} return `<button class="${cls}" data-j="${j}" data-k="${k}" ${a!=null?"disabled":""}><span class="mk" aria-hidden="true">${a!=null&&k===sg.a?"✓":a===k?"✗":"○"}</span><span>${esc(sg.o[k])}</span></button>`}).join("")+
          (a!=null?`<div class="fb ${a===sg.a?"ok":"no"}" role="status"><b>${a===sg.a?"Isso mesmo!":"Quase! A resposta é: "+esc(sg.o[sg.a])}</b>${esc(sg.e)}</div>`:"")+`</div>`;
        if(a==null) break;
      }
    }
    const atEnd=rec.n>=st.segs.length;
    const pending=st.segs[rec.n]&&!st.segs[rec.n].p&&rec.ans[rec.n]==null;
    if(!atEnd && !pending) h+=`<button class="btn" id="contStory">Continuar a história</button>`;
    if(atEnd) h+=`<p class="note">Fim do capítulo. Toque em Continuar, lá embaixo, para seguir o encontro.</p><button class="btn ghost small" id="reStory" style="align-self:flex-start">Ler o capítulo de novo</button>`;
    h+=`</div>`; host.innerHTML=h;
    $$(".pause .opt",host).forEach(btn=>btn.onclick=()=>{ const j=+btn.dataset.j,k=+btn.dataset.k; rec.ans[j]=k; save(); announce(k===st.segs[j].a?"Resposta correta.":"Resposta incorreta. "+st.segs[j].o[st.segs[j].a]); draw() });
    const c=$("#contStory",host); if(c) c.onclick=()=>{ rec.n++; reveal(); save(); draw(); };
    const r=$("#reStory",host); if(r) r.onclick=()=>{ S.story[sid]={n:0,ans:{}}; renderStory(m,host) };
  }
  // quando a pausa atual foi respondida, o botão "Continuar a história" avança
  draw();
}

/* ---------- Atividades de fixação ---------- */
const KIND={mc:"Múltipla escolha",vf:"Verdadeiro ou falso",assoc:"Associação",lac:"Complete as lacunas",ord:"Ordenação",open:"Questão discursiva"};
function exercise(ex,key){
  const el=document.createElement("div"); el.className="ex"; el.setAttribute("role","group");
  function head(){ return `<span class="kind">${KIND[ex.t]}</span><h3>${esc(ex.q)}</h3>` }
  function redo(){ return S.ex[key]?`<button class="btn ghost small" data-redo style="align-self:flex-start">Refazer</button>`:"" }
  function bindRedo(){ const r=$("[data-redo]",el); if(r) r.onclick=()=>{ delete S.ex[key]; el._v=null; save(); draw() } }
  function draw(){
    const r=S.ex[key];
    if(ex.t==="mc"){
      el.innerHTML=head()+shuffle(ex.o.map((_,i)=>i),key).map(i=>{let cls="opt"; if(r){ if(i===ex.a) cls+=" right"; else if(i===r.v) cls+=" wrong"} return `<button class="${cls}" data-i="${i}" ${r?"disabled":""}><span class="mk" aria-hidden="true">${r&&i===ex.a?"✓":r&&i===r.v?"✗":"○"}</span><span>${esc(ex.o[i])}</span></button>`}).join("")+
        (r?`<div class="fb ${r.ok?"ok":"no"}" role="status"><b>${r.ok?"Correto.":"Incorreto. A resposta é: "+esc(ex.o[ex.a])}</b>${esc(ex.e||"")}</div>`:"")+redo();
      $$("[data-i]",el).forEach(b=>b.onclick=()=>{const v=+b.dataset.i; S.ex[key]={v,ok:v===ex.a}; save(); announce(v===ex.a?"Correto":"Incorreto"); draw()});
    }
    else if(ex.t==="vf"){
      const cur=r?r.v:(el._v||ex.it.map(()=>null)); el._v=cur;
      el.innerHTML=head()+ex.it.map((it,i)=>{const ok=r?cur[i]===it[1]:null; return `<div class="vfrow"><p>${esc(it[0])}${r&&!ok&&it[2]?`<br><span class="note">${esc(it[2])}</span>`:""}</p><div class="vfbtns" role="group" aria-label="Afirmação ${i+1}"><button data-i="${i}" data-b="1" aria-pressed="${cur[i]===true}" ${r?"disabled":""} aria-label="Verdadeiro">V</button><button data-i="${i}" data-b="0" aria-pressed="${cur[i]===false}" ${r?"disabled":""} aria-label="Falso">F</button></div>${r?`<span class="mark ${ok?"ok":"no"}">${ok?"✓ certo":"✗ "+(it[1]?"é V":"é F")}</span>`:""}</div>`}).join("")+
        (r?`<div class="fb ${r.ok?"ok":"no"}" role="status"><b>${r.n} de ${ex.it.length} corretas.</b></div>`:`<button class="btn" data-check ${cur.includes(null)?"disabled":""}>Verificar</button>`)+redo();
      $$("[data-b]",el).forEach(b=>b.onclick=()=>{cur[+b.dataset.i]=b.dataset.b==="1"; draw()});
      const c=$("[data-check]",el); if(c) c.onclick=()=>{const n=ex.it.filter((it,i)=>cur[i]===it[1]).length; S.ex[key]={v:cur.slice(),n,ok:n===ex.it.length}; el._v=null; save(); announce(`${n} de ${ex.it.length} corretas`); draw()};
    }
    else if(ex.t==="assoc"){
      const rights=shuffle(ex.p.map(p=>p[1]),key); const cur=r?r.v:(el._v||ex.p.map(()=>""));
      el._v=cur;
      el.innerHTML=head()+ex.p.map((p,i)=>{const ok=r?cur[i]===p[1]:null; return `<div class="assoc-row"><label for="${key}_a${i}"><b>${esc(p[0])}</b></label><select id="${key}_a${i}" data-i="${i}" ${r?"disabled":""}><option value="">Escolha…</option>${rights.map(x=>`<option ${cur[i]===x?"selected":""}>${esc(x)}</option>`).join("")}</select>${r?`<span class="mark ${ok?"ok":"no"}">${ok?"✓ certo":"✗ correto: "+esc(p[1])}</span>`:""}</div>`}).join("")+
        (r?`<div class="fb ${r.ok?"ok":"no"}" role="status"><b>${r.n} de ${ex.p.length} associações corretas.</b></div>`:`<button class="btn" data-check ${cur.includes("")?"disabled":""}>Verificar</button>`)+redo();
      $$("select",el).forEach(s=>s.onchange=()=>{cur[+s.dataset.i]=s.value; const c=$("[data-check]",el); if(c) c.disabled=cur.includes("")});
      const c=$("[data-check]",el); if(c) c.onclick=()=>{const n=ex.p.filter((p,i)=>cur[i]===p[1]).length; S.ex[key]={v:cur.slice(),n,ok:n===ex.p.length}; el._v=null; save(); announce(`${n} de ${ex.p.length} corretas`); draw()};
    }
    else if(ex.t==="lac"){
      const ans=[...ex.x.matchAll(/\[\[(.+?)\]\]/g)].map(x=>x[1]); const bank=shuffle(ans.concat(ex.bank||[]),key);
      const cur=r?r.v:(el._v||ans.map(()=>"")); el._v=cur; let k=-1;
      const txt=esc(ex.x).replace(/\[\[(.+?)\]\]/g,()=>{k++; const i=k, ok=r?cur[i]===ans[i]:null; return `<label class="sr" for="${key}_l${i}">Lacuna ${i+1}</label><select id="${key}_l${i}" data-i="${i}" ${r?"disabled":""}><option value="">_____</option>${bank.map(w=>`<option ${cur[i]===w?"selected":""}>${esc(w)}</option>`).join("")}</select>${r?` <span class="mark ${ok?"ok":"no"}">${ok?"✓":"✗ "+esc(ans[i])}</span>`:""}`});
      el.innerHTML=head()+`<p class="lac">${txt}</p>`+(r?`<div class="fb ${r.ok?"ok":"no"}" role="status"><b>${r.n} de ${ans.length} lacunas corretas.</b></div>`:`<button class="btn" data-check ${cur.includes("")?"disabled":""}>Verificar</button>`)+redo();
      $$("select",el).forEach(s=>s.onchange=()=>{cur[+s.dataset.i]=s.value; const c=$("[data-check]",el); if(c) c.disabled=cur.includes("")});
      const c=$("[data-check]",el); if(c) c.onclick=()=>{const n=ans.filter((a,i)=>cur[i]===a).length; S.ex[key]={v:cur.slice(),n,ok:n===ans.length}; el._v=null; save(); announce(`${n} de ${ans.length} corretas`); draw()};
    }
    else if(ex.t==="ord"){
      let cur=r?r.v:(el._v||shuffle(ex.it.map((_,i)=>i),key)); if(!r && cur.every((v,i)=>v===i)) cur=cur.slice().reverse(); el._v=cur;
      el.innerHTML=head()+`<p class="note">Use as setas para mover os itens.</p><ol class="ordlist">${cur.map((it,pos)=>{const ok=r?it===pos:null; return `<li class="${r?(ok?"right":"wrong"):""}"><span class="n">${pos+1}.</span><span>${esc(ex.it[it])}</span>${r?`<span class="mark ${ok?"ok":"no"}">${ok?"✓":"✗"}</span>`:`<button data-u="${pos}" aria-label="Mover para cima" ${pos===0?"disabled":""}>▲</button><button data-d="${pos}" aria-label="Mover para baixo" ${pos===cur.length-1?"disabled":""}>▼</button>`}</li>`}).join("")}</ol>`+
        (r?`<div class="fb ${r.ok?"ok":"no"}" role="status"><b>${r.ok?"Sequência correta!":`${r.n} de ${ex.it.length} na posição certa.`}</b>${r.ok?"":"Ordem correta: "+ex.it.map((t,i)=>(i+1)+". "+esc(t)).join(" · ")}</div>`:`<button class="btn" data-check>Verificar</button>`)+redo();
      $$("[data-u]",el).forEach(b=>b.onclick=()=>{const p=+b.dataset.u; [cur[p-1],cur[p]]=[cur[p],cur[p-1]]; draw(); const nb=$(`[data-u="${p-1}"]`,el)||$(`[data-d="${p-1}"]`,el); nb&&nb.focus()});
      $$("[data-d]",el).forEach(b=>b.onclick=()=>{const p=+b.dataset.d; [cur[p+1],cur[p]]=[cur[p],cur[p+1]]; draw(); const nb=$(`[data-d="${p+1}"]`,el)||$(`[data-u="${p+1}"]`,el); nb&&nb.focus()});
      const c=$("[data-check]",el); if(c) c.onclick=()=>{const n=cur.filter((v,i)=>v===i).length; S.ex[key]={v:cur.slice(),n,ok:n===cur.length}; el._v=null; save(); announce(n===cur.length?"Sequência correta":`${n} na posição certa`); draw()};
    }
    else if(ex.t==="open"){
      el.innerHTML=head()+`<label class="sr" for="${key}_o">Sua resposta</label><textarea id="${key}_o" data-open="${key}" placeholder="Escreva sua resposta">${esc(S.open[key]||"")}</textarea><button class="btn ghost small" data-model style="align-self:flex-start" aria-expanded="false">Ver resposta esperada</button><div class="model" hidden><b>Resposta esperada:</b> ${esc(ex.m)}</div>`;
      bindOpen(el); const b=$("[data-model]",el); b.onclick=()=>{const md=$(".model",el); md.hidden=!md.hidden; b.setAttribute("aria-expanded",String(!md.hidden)); b.textContent=md.hidden?"Ver resposta esperada":"Esconder resposta esperada"};
    }
    bindRedo();
  }
  draw(); return el;
}

/* ============ MICOTECA ============ */
let micoMode="catalogo", micoQ="", micoRole="Todos", micoPhy="Todos";
function viewMicoteca(v){
  v.innerHTML=`<div class="stack"><div><p class="eyebrow">Micoteca amazônica</p><h1 style="font-size:1.6rem">Fungos e identificação</h1></div>
    <div class="seg" role="group" aria-label="Seção da Micoteca"><button data-mm="catalogo" aria-pressed="${micoMode==="catalogo"}">Catálogo</button><button data-mm="fungario" aria-pressed="${micoMode==="fungario"}">Meu fungário</button><button data-mm="chave" aria-pressed="${micoMode==="chave"}">Chave</button></div>
    <div id="micoHost"></div></div>`;
  $$("[data-mm]",v).forEach(b=>b.onclick=()=>{micoMode=b.dataset.mm; viewMicoteca(v)});
  const h=$("#micoHost",v);
  if(micoMode==="catalogo") catalogo(h); else if(micoMode==="fungario") fungarioList(h); else keyView(h,null);
}
function catalogo(h){
  h.innerHTML=`<div class="stack" style="gap:12px">
    <div class="field"><label for="mq" class="sr">Buscar fungo</label><input type="search" id="mq" placeholder="Buscar por nome popular ou científico" value="${esc(micoQ)}" autocomplete="off"></div>
    <div class="chips" role="group" aria-label="Filtrar por papel">${["Todos"].concat(ROLES).map(r=>`<button class="chip" aria-pressed="${r===micoRole}" data-r="${r}">${r}</button>`).join("")}</div>
    <div class="field"><label for="mp">Filo</label><select id="mp"><option>Todos</option>${PHYLA.map(p=>`<option ${p===micoPhy?"selected":""}>${p}</option>`).join("")}</select></div>
    <p class="note" id="mcount"></p><div class="grid" id="mgrid"></div>
    <p class="note">Fotos reais carregadas do iNaturalist quando houver internet, com o crédito de cada autor. Sem internet, aparecem ilustrações.</p></div>`;
  const draw=()=>{
    const q=norm(micoQ);
    const list=SPECIES.filter(s=>(micoRole==="Todos"||s.role===micoRole)&&(micoPhy==="Todos"||s.tx[0]===micoPhy)&&(!q||norm(s.pop+" "+s.sci+" "+s.tx.join(" ")).includes(q)));
    $("#mcount",h).textContent=`${list.length} ${list.length===1?"fungo":"fungos"}`;
    $("#mgrid",h).innerHTML=list.map(s=>`<button class="spc" data-s="${s.id}"><div class="ph" data-ph="${esc(s.sci)}">${art(s.art,s.c)}</div><b>${esc(s.pop)}</b><i>${esc(s.sci)}${/ /.test(s.sci)?"":" spp."}</i><span class="row" style="gap:4px"><span class="tag ${s.toxic?"warn":""}">${esc(s.role)}</span></span></button>`).join("")||`<p class="note">Nenhum fungo encontrado.</p>`;
    $$(".spc",h).forEach(b=>b.onclick=()=>openFicha(b.dataset.s));
    Photos.fill(h);
  };
  $("#mq",h).oninput=e=>{micoQ=e.target.value; draw()};
  $("#mp",h).onchange=e=>{micoPhy=e.target.value; draw()};
  $$(".chip",h).forEach(b=>b.onclick=()=>{micoRole=b.dataset.r; $$(".chip",h).forEach(c=>c.setAttribute("aria-pressed",String(c===b))); draw()});
  draw();
}
const Photos={
  cache:(()=>{try{return JSON.parse(localStorage.getItem("micoverso.photos")||"{}")}catch(e){return {}}})(),
  pending:{}, active:0, q:[],
  get(sci){ return this.cache[sci] },
  fill(root){ $$("[data-ph]",root).forEach(el=>{ const sci=el.dataset.ph; const p=this.cache[sci]; if(p&&p.u) this.put(el,p); else if(!p) this.load(sci) }) },
  put(el,p){ if(el.querySelector("img")) return; const img=new Image(); img.alt="Foto de "+el.dataset.ph; img.loading="lazy"; img.onload=()=>el.appendChild(img); img.onerror=()=>{}; img.src=p.u },
  load(sci){ if(this.pending[sci]||!navigator.onLine) return; this.pending[sci]=1; this.q.push(sci); this.pump() },
  pump(){ while(this.active<3&&this.q.length){ const sci=this.q.shift(); this.active++; this.fetch(sci).finally(()=>{this.active--; this.pump()}) } },
  async fetch(sci){
    try{
      const r=await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(sci)}&per_page=6&is_active=true`);
      if(!r.ok) throw 0; const j=await r.json(); const res=(j.results||[]);
      const t=res.find(x=>norm(x.name)===norm(sci))||res.find(x=>norm(x.name).startsWith(norm(sci.split(" ")[0])))||null;
      const ph=t&&t.default_photo;
      this.cache[sci]= ph&&ph.medium_url ? {u:ph.medium_url, a:ph.attribution||"", id:t.id} : {u:"", id:t?t.id:0};
      try{localStorage.setItem("micoverso.photos",JSON.stringify(this.cache))}catch(e){}
      $$(`[data-ph="${CSS.escape(sci)}"]`).forEach(el=>{ if(this.cache[sci].u) this.put(el,this.cache[sci]); const cr=el.parentElement&&el.parentElement.querySelector("[data-credit]"); if(cr&&this.cache[sci].a) cr.textContent="Foto: "+this.cache[sci].a+" · via iNaturalist" });
    }catch(e){ delete this.pending[sci] }
  }
};
function openFicha(id){
  const s=SPECIES.find(x=>x.id===id); const sh=openSheet({title:s.pop,sub:"Ficha da Micoteca"});
  const p=Photos.get(s.sci)||{}; const L=["Reino","Filo","Classe","Ordem","Família","Gênero","Espécie"]; const vals=["Fungi"].concat(s.tx);
  const fmt=(k,v)=>k>=5&&v!=="—"?`<i>${esc(v)}</i>`:esc(v);
  sh.body.innerHTML=`<div class="stack ficha pop">
    <div><div class="ph" data-ph="${esc(s.sci)}">${art(s.art,s.c)}</div><p class="credit" data-credit>${p.a?"Foto: "+esc(p.a)+" · via iNaturalist":"Ilustração"}</p></div>
    <div><h2 style="font-size:1.7rem">${esc(s.pop)}</h2><p style="font-style:italic;color:var(--muted);font-size:1.1rem">${esc(s.sci)}${/ /.test(s.sci)?"":" spp."}</p><div class="row" style="margin-top:8px"><span class="tag ${s.toxic?"warn":""}">${esc(s.role)}</span><span class="tag">${esc(s.tx[0])}</span></div></div>
    ${s.toxic?`<div class="warnbox"><b>Atenção:</b> fungo tóxico. Não toque na boca e nunca consuma.</div>`:""}
    <div><p class="eyebrow" style="margin-bottom:8px">Classificação taxonômica</p><div class="taxo">${L.map((l,k)=>`<div class="k">${l}</div><div class="v">${fmt(k,vals[k])}</div>`).join("")}</div></div>
    <div class="box"><p class="eyebrow" style="margin-bottom:4px">Onde vive</p><p>${esc(s.onde)}</p></div>
    <div class="box"><p class="eyebrow" style="margin-bottom:4px">Curiosidade</p><p>${esc(s.curio)}</p></div>
    <div class="row">${sayBtn(`${s.pop}. Nome científico: ${s.sci}. Classificação: reino Fungi, filo ${s.tx[0]}, classe ${s.tx[1]}, ordem ${s.tx[2]}, família ${s.tx[3]}. Onde vive: ${s.onde} Curiosidade: ${s.curio}`,"Ouvir ficha")}${p.id?`<a class="btn ghost small" href="https://www.inaturalist.org/taxa/${p.id}" target="_blank" rel="noopener">Ver no iNaturalist</a>`:""}</div>
    ${["pyc","pha","coo","cos","myc","gea","len","fav","mar","neo","agr","ple","aur","chl"].includes(s.id)?`<p class="note">Observe na natureza, mas nunca coma cogumelos silvestres.</p>`:""}</div>`;
  Photos.fill(sh.body);
}

/* ---------- Meu fungário (IndexedDB) ---------- */
const DB={
  db:null,
  open(){ if(this.db) return Promise.resolve(this.db); return new Promise((res,rej)=>{ try{ const r=indexedDB.open("micoverso",1); r.onupgradeneeded=()=>r.result.createObjectStore("fungario",{keyPath:"id"}); r.onsuccess=()=>{this.db=r.result; res(this.db)}; r.onerror=()=>rej(r.error) }catch(e){rej(e)} }) },
  async all(){ const d=await this.open(); return new Promise((res,rej)=>{ const t=d.transaction("fungario").objectStore("fungario").getAll(); t.onsuccess=()=>res(t.result.sort((a,b)=>b.created-a.created)); t.onerror=()=>rej(t.error) }) },
  async put(o){ const d=await this.open(); return new Promise((res,rej)=>{ const t=d.transaction("fungario","readwrite"); t.objectStore("fungario").put(o); t.oncomplete=()=>res(); t.onerror=()=>rej(t.error) }) },
  async del(id){ const d=await this.open(); return new Promise((res,rej)=>{ const t=d.transaction("fungario","readwrite"); t.objectStore("fungario").delete(id); t.oncomplete=()=>res(); t.onerror=()=>rej(t.error) }) }
};
let fgCount=0; DB.all().then(a=>{fgCount=a.length}).catch(()=>{});
const urls=[]; function objURL(b){ const u=URL.createObjectURL(b); urls.push(u); if(urls.length>80) URL.revokeObjectURL(urls.shift()); return u }
function resizeImage(file,max=1280,q=.82){ return new Promise((res,rej)=>{ const img=new Image(); const u=URL.createObjectURL(file); img.onload=()=>{ const sc=Math.min(1,max/Math.max(img.width,img.height)); const c=document.createElement("canvas"); c.width=Math.round(img.width*sc); c.height=Math.round(img.height*sc); c.getContext("2d").drawImage(img,0,0,c.width,c.height); URL.revokeObjectURL(u); c.toBlob(b=>b?res(b):rej(new Error("img")),"image/jpeg",q) }; img.onerror=()=>{URL.revokeObjectURL(u); rej(new Error("img"))}; img.src=u }) }
const binom=tx=>tx&&tx.genero?`<i>${esc(tx.genero)}${tx.especie?" "+esc(tx.especie):" sp."}</i>`:"Sem identificação";
async function fungarioList(h){
  h.innerHTML=`<div class="stack" style="gap:12px"><p class="lead">Fotografe fungos, registre onde estavam e tente classificá-los. Tudo fica salvo só neste aparelho.</p><button class="btn" id="fgNew">${ICON.cam}Novo registro</button><div class="fg-list" id="fgl"><p class="note">Carregando…</p></div></div>`;
  $("#fgNew",h).onclick=()=>openFungarioForm();
  try{
    const all=await DB.all(); fgCount=all.length; const L=$("#fgl",h); if(!L) return;
    L.innerHTML=all.length?all.map(r=>`<button class="fg-item" data-id="${r.id}"><div class="thumb"><img alt="" data-blob="${r.id}"></div><div><b>${esc(r.name||"Fungo sem nome")}</b><p class="note">${binom(r.tx)}</p><p class="note">${esc(r.local||"")}${r.data?" · "+esc(new Date(r.data+"T12:00").toLocaleDateString("pt-BR")):""}</p></div></button>`).join("")
      :`<div class="box" style="text-align:center"><div style="width:90px;margin:0 auto">${art("camera")}</div><p style="margin-top:8px"><b>Seu fungário está vazio.</b></p><p class="note">Toque em “Novo registro” para fotografar o primeiro fungo.</p></div>`;
    all.forEach(r=>{ const img=$(`img[data-blob="${r.id}"]`,L); if(img&&r.blob) img.src=objURL(r.blob) });
    $$(".fg-item",L).forEach(b=>b.onclick=()=>openFungarioView(all.find(r=>r.id===b.dataset.id)));
  }catch(e){ const L=$("#fgl",h); if(L) L.innerHTML=`<p class="note">O fungário não está disponível neste navegador (armazenamento bloqueado ou modo privado).</p>` }
}
function openFungarioForm(rec){
  const r=rec?JSON.parse(JSON.stringify(Object.assign({},rec,{blob:null}))):{id:"f"+Date.now(),created:Date.now(),name:"",local:"",data:new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10),substrato:"",notas:"",tx:{filo:"",classe:"",ordem:"",familia:"",genero:"",especie:""}};
  let blob=rec?rec.blob:null;
  const sh=openSheet({title:rec?"Editar registro":"Novo registro",sub:"Meu fungário"});
  const dl=(id,arr)=>`<datalist id="${id}">${[...new Set(arr)].filter(x=>x&&x!=="—").map(x=>`<option value="${esc(x)}">`).join("")}</datalist>`;
  sh.body.innerHTML=`<form class="stack" id="fgf" novalidate>
    <div class="field"><label>Foto</label><div id="pv" class="box" style="text-align:center">${blob?`<img class="preview" alt="Foto do fungo" id="pimg">`:`<div style="width:80px;margin:0 auto">${art("camera")}</div><p class="note">Nenhuma foto ainda</p>`}</div>
      <div class="row" style="margin-top:8px"><label class="btn" for="fcam" style="margin:0">${ICON.cam}Tirar foto</label><input type="file" id="fcam" accept="image/*" capture="environment" class="sr"><label class="btn ghost" for="fgal" style="margin:0">Escolher da galeria</label><input type="file" id="fgal" accept="image/*" class="sr"></div>
      <p class="note" style="margin-top:6px">Dica: fotografe de cima, de lado e por baixo, com uma moeda para dar escala.</p></div>
    <div class="field"><label for="fn">Nome popular ou apelido</label><input type="text" id="fn" value="${esc(r.name)}" maxlength="60" placeholder="ex.: orelha-de-pau do quintal"></div>
    <div class="field"><label for="fl">Onde encontrou</label><input type="text" id="fl" value="${esc(r.local)}" maxlength="80" placeholder="ex.: quintal de casa, Salvaterra"></div>
    <div class="row"><div class="field" style="flex:1 1 140px"><label for="fd">Data</label><input type="date" id="fd" value="${esc(r.data)}"></div><div class="field" style="flex:1 1 160px"><label for="fs">Substrato</label><select id="fs">${["","Tronco ou galho","Folhas no chão","Solo","Alimento","Inseto","Planta viva","Outro"].map(o=>`<option ${o===r.substrato?"selected":""}>${o}</option>`).join("")}</select></div></div>
    <div class="box stack" style="gap:10px"><div class="row" style="justify-content:space-between"><h3 style="font-size:1.05rem">Classificação taxonômica</h3><button type="button" class="btn ghost small" id="useKey">Usar a chave</button></div>
      <p class="note">Reino: Fungi. Preencha até onde conseguir.</p>
      <div class="field"><label for="tfilo">Filo</label><select id="tfilo"><option value="">Não sei</option>${PHYLA.map(p=>`<option ${p===r.tx.filo?"selected":""}>${p}</option>`).join("")}</select></div>
      <div class="field"><label for="tclasse">Classe</label><input type="text" id="tclasse" list="dlc" value="${esc(r.tx.classe)}"></div>
      <div class="field"><label for="tordem">Ordem</label><input type="text" id="tordem" list="dlo" value="${esc(r.tx.ordem)}"></div>
      <div class="field"><label for="tfamilia">Família</label><input type="text" id="tfamilia" list="dlf" value="${esc(r.tx.familia)}"></div>
      <div class="field"><label for="tgenero">Gênero</label><input type="text" id="tgenero" list="dlg" value="${esc(r.tx.genero)}"></div>
      <div class="field"><label for="tespecie">Epíteto específico</label><input type="text" id="tespecie" value="${esc(r.tx.especie)}" placeholder="ex.: sanguineus"></div>
      <p class="note">Nome da espécie: <span id="bn">${binom(r.tx)}</span></p>
      ${dl("dlc",SPECIES.map(s=>s.tx[1]))}${dl("dlo",SPECIES.map(s=>s.tx[2]))}${dl("dlf",SPECIES.map(s=>s.tx[3]))}${dl("dlg",SPECIES.map(s=>s.tx[4]))}</div>
    <div class="field"><label for="fo">Observações</label><textarea id="fo" maxlength="600" placeholder="Cor, cheiro, tamanho, o que há embaixo do chapéu…">${esc(r.notas)}</textarea></div>
    <p class="note" id="ferr" role="alert"></p>
    <button class="btn" type="submit">Salvar registro</button></form>`;
  if(blob) $("#pimg",sh.body).src=objURL(blob);
  const onFile=async e=>{ const f=e.target.files&&e.target.files[0]; if(!f) return; try{ blob=await resizeImage(f); $("#pv",sh.body).innerHTML=`<img class="preview" alt="Foto do fungo" src="${objURL(blob)}">` }catch(err){ $("#ferr",sh.body).textContent="Não foi possível abrir essa imagem. Tente outra foto." } };
  $("#fcam",sh.body).onchange=onFile; $("#fgal",sh.body).onchange=onFile;
  const upd=()=>{ $("#bn",sh.body).innerHTML=binom({genero:$("#tgenero",sh.body).value.trim(),especie:$("#tespecie",sh.body).value.trim().toLowerCase()}) };
  $("#tgenero",sh.body).oninput=upd; $("#tespecie",sh.body).oninput=upd;
  $("#useKey",sh.body).onclick=()=>{ const ks=openSheet({title:"Chave de identificação",sub:"Escolha a opção que mais se parece"}); keyView(ks.body,res=>{ const t=res.tx; $("#tfilo",sh.body).value=t[0]||""; $("#tclasse",sh.body).value=t[1]||""; $("#tordem",sh.body).value=(t[2]||"").includes(" ou ")?"":(t[2]||""); history.back(); toast("Classificação preenchida pela chave") }) };
  $("#fgf",sh.body).onsubmit=async e=>{ e.preventDefault();
    if(!blob){ $("#ferr",sh.body).textContent="Adicione uma foto do fungo para salvar."; return }
    const g=id=>$("#"+id,sh.body).value.trim();
    const o={id:r.id,created:r.created,blob,name:g("fn"),local:g("fl"),data:g("fd"),substrato:g("fs"),notas:g("fo"),ai:rec&&rec.ai||"",tx:{filo:g("tfilo"),classe:g("tclasse"),ordem:g("tordem"),familia:g("tfamilia"),genero:g("tgenero").replace(/^./,c=>c.toUpperCase()),especie:g("tespecie").toLowerCase()}};
    try{ await DB.put(o); if(!rec) fgCount++; if(sheets.length<=1) micoMode="fungario"; toast("Registro salvo"); history.back() }catch(err){ $("#ferr",sh.body).textContent="Não foi possível salvar. O armazenamento deste navegador pode estar cheio ou bloqueado." }
  };
}
function openFungarioView(r){
  const sh=openSheet({title:r.name||"Fungo sem nome",sub:"Meu fungário"}); let confirming=false;
  const L=["Reino","Filo","Classe","Ordem","Família","Gênero","Espécie"];
  function draw(){
    const t=r.tx||{}; const vals=["Fungi",t.filo,t.classe,t.ordem,t.familia,t.genero,t.genero&&t.especie?t.genero+" "+t.especie:""];
    sh.body.innerHTML=`<div class="stack pop"><img class="preview" alt="Foto de ${esc(r.name||"fungo")}" id="vimg">
      <div><h2 style="font-size:1.5rem">${esc(r.name||"Fungo sem nome")}</h2><p class="note">${esc(r.local||"Local não informado")}${r.data?" · "+esc(new Date(r.data+"T12:00").toLocaleDateString("pt-BR")):""}${r.substrato?" · "+esc(r.substrato):""}</p></div>
      <div><p class="eyebrow" style="margin-bottom:8px">Classificação taxonômica</p><div class="taxo">${L.map((l,k)=>`<div class="k">${l}</div><div class="v">${vals[k]?(k>=5?`<i>${esc(vals[k])}</i>`:esc(vals[k])):'<span class="note">—</span>'}</div>`).join("")}</div></div>
      ${r.notas?`<div class="box"><p class="eyebrow" style="margin-bottom:4px">Observações</p><p>${esc(r.notas)}</p></div>`:""}
      <div class="row"><button class="btn" id="edit">Editar</button>${confirming?"":`<button class="btn ghost" id="del">Excluir</button>`}</div>
      ${confirming?`<div class="confirm"><p><b>Excluir este registro?</b> A foto e as informações serão apagadas deste aparelho.</p><div class="row"><button class="btn danger" id="yes">Excluir</button><button class="btn ghost" id="no">Cancelar</button></div></div>`:""}</div>`;
    $("#vimg",sh.body).src=objURL(r.blob);
    $("#edit",sh.body).onclick=()=>closeThen(()=>openFungarioForm(r));
    const d=$("#del",sh.body); if(d) d.onclick=()=>{confirming=true; draw()};
    const y=$("#yes",sh.body); if(y) y.onclick=async()=>{ await DB.del(r.id).catch(()=>{}); fgCount=Math.max(0,fgCount-1); toast("Registro excluído"); history.back() };
    const n=$("#no",sh.body); if(n) n.onclick=()=>{confirming=false; draw()};
  }
  draw();
}
function blobToB64(b){ return new Promise((res,rej)=>{ const fr=new FileReader(); fr.onload=()=>res(String(fr.result).split(",")[1]); fr.onerror=rej; fr.readAsDataURL(b) }) }

/* ---------- Chave de identificação ---------- */
function keyView(h,onApply){
  let path=["start"];
  function draw(){
    const cur=path[path.length-1];
    if(KEYRES[cur]){ const r=KEYRES[cur];
      h.innerHTML=`<div class="stack pop"><p class="eyebrow">Resultado provável</p><h2 style="font-size:1.5rem">${esc(r.t)}</h2>
        <div class="taxo"><div class="k">Reino</div><div class="v">Fungi</div>${["Filo","Classe","Ordem"].map((l,k)=>r.tx[k]?`<div class="k">${l}</div><div class="v">${esc(r.tx[k])}</div>`:"").join("")}</div>
        <p>${esc(r.d)}</p>
        <div><p class="eyebrow" style="margin-bottom:8px">Compare com a Micoteca</p><div class="chips" style="flex-wrap:wrap">${r.sp.map(id=>{const s=SPECIES.find(x=>x.id===id);return `<button class="chip" data-sp="${id}">${esc(s.pop)}</button>`}).join("")}</div></div>
        <div class="warnbox"><b>Importante:</b> a chave indica um grupo provável. A espécie só é confirmada com análise detalhada, microscópio ou DNA. Nunca coma fungos silvestres.</div>
        <div class="row">${onApply?`<button class="btn" id="apply">Usar no meu registro</button>`:""}<button class="btn ghost" id="restart">Recomeçar</button></div></div>`;
      $$("[data-sp]",h).forEach(b=>b.onclick=()=>openFicha(b.dataset.sp));
      const ap=$("#apply",h); if(ap) ap.onclick=()=>onApply(r);
      $("#restart",h).onclick=()=>{path=["start"]; draw()};
      return;
    }
    const k=KEY[cur];
    h.innerHTML=`<div class="stack pop">${onApply?"":`<p class="lead">Responda olhando o fungo (ou a foto). A chave leva a um grupo provável.</p>`}<p class="eyebrow">Pergunta ${path.length}</p><h2 style="font-size:1.35rem">${esc(k.q)}</h2><div class="stack" style="gap:8px">${k.o.map((o,i)=>`<button class="keyopt" data-i="${i}">${esc(o[0])}</button>`).join("")}</div>${path.length>1?`<button class="btn ghost small" id="kback" style="align-self:flex-start">‹ Pergunta anterior</button>`:""}</div>`;
    $$(".keyopt",h).forEach(b=>b.onclick=()=>{path.push(k.o[+b.dataset.i][1]); draw()});
    const bk=$("#kback",h); if(bk) bk.onclick=()=>{path.pop(); draw()};
  }
  draw();
}

/* ============ BATISTA (assistente) ============ */
function offlineAnswer(q){
  const nq=norm(q); const words=nq.split(/[^a-z0-9]+/).filter(w=>w.length>2);
  if(!words.length) return null;
  let best=null,bs=0;
  FAQ.forEach(f=>{ const kw=norm(f[2]+" "+f[0]); let s=0; words.forEach(w=>{ if(kw.includes(w)) s+= w.length>5?2:1 }); if(s>bs){bs=s;best=f} });
  const sp=SPECIES.find(s=>words.some(w=>w.length>4&&norm(s.pop+" "+s.sci).includes(w)));
  if(sp && bs<3) return `${sp.pop} (${sp.sci}${/ /.test(sp.sci)?"":" spp."}) é um fungo do filo ${sp.tx[0]}, ordem ${sp.tx[2]}. Papel: ${sp.role.toLowerCase()}. ${sp.onde} ${sp.curio}`;
  const wd=WORDS.find(w=>words.includes(norm(w[0])));
  if(wd && bs<3) return `${wd[0]}: ${wd[1]}`;
  if(best&&bs>=2) return best[1];
  return null;
}
let chat=[], aiBusy=false, showBio=false;
function viewBatista(v){
  const sugg=["Por que os cogumelos aparecem depois da chuva?","De onde vem a palavra fungo?","Como as saúvas cultivam fungos?","Existe fungo que brilha?","Quem foi Augusto Chaves Batista?"];
  v.innerHTML=`<div class="stack">
    <div class="row" style="flex-wrap:nowrap;align-items:center"><div class="portrait">${art("lupa",null,"#D3E6DE")}</div><div style="min-width:0;flex:1"><p class="eyebrow">Assistente</p><h1 style="font-size:1.45rem">Batista</h1></div></div>
    <div class="box"><button class="btn ghost small" id="bio" aria-expanded="${showBio}">${showBio?"Esconder":"Por que me chamo Batista?"}</button>${showBio?`<p style="margin-top:10px">Meu nome é uma homenagem a <b>Augusto Chaves Batista</b> (1916–1967), um dos maiores micólogos do Brasil. Ele publicou mais de 600 trabalhos científicos, descreveu muitos fungos tropicais e dirigiu o Instituto de Micologia da Universidade Federal de Pernambuco, em Recife. Um gênero de fungos, <i>Batistia</i>, leva o nome dele.</p>`:""}</div>
    <div class="chat" id="chat" aria-live="polite">${chat.length?chat.map(m=>`<div class="msg ${m.role==="user"?"u":"a"}">${esc(m.content)}${m.role!=="user"&&m.content!=="Pensando…"?`<div>${sayBtn(m.content,"Ouvir",true)}</div>`:""}</div>`).join(""):`<div class="msg a">Oi${firstName()?", "+esc(firstName()):""}! Eu sou o Batista. Pergunte o que quiser sobre fungos: da orelha-de-pau do quintal ao fungo que faz chover na Amazônia.</div>`}</div>
    <div class="chips">${sugg.map(s=>`<button class="chip" data-q="${esc(s)}">${esc(s)}</button>`).join("")}</div>
    <form class="ask" id="af"><label for="aq" class="sr">Sua pergunta</label><input type="text" id="aq" placeholder="Escreva sua pergunta" maxlength="300" autocomplete="off"><button class="btn" ${aiBusy?"disabled":""}>Enviar</button></form>
    <p class="note">Respondo com uma base de perguntas sobre fungos que funciona até sem internet. Se eu não souber, anote a dúvida no lapbook e leve para a professora.</p></div>`;
  $("#bio",v).onclick=()=>{showBio=!showBio; viewBatista(v)};
  $("#af",v).onsubmit=e=>{e.preventDefault(); const q=$("#aq",v).value.trim(); if(q) askBatista(q)};
  $$("[data-q]",v).forEach(b=>b.onclick=()=>askBatista(b.dataset.q));
}
function askBatista(q){
  if(aiBusy) return;
  chat.push({role:"user",content:q});
  const a=offlineAnswer(q);
  chat.push({role:"assistant",content:a||"Ainda não sei responder essa. Tente perguntar de outro jeito, use as sugestões acima ou anote a dúvida no bolso de perguntas do lapbook para a professora."});
  renderBat();
}
function renderBat(){ if(tab==="batista"&&!sheets.length){ renderTab(); const v=$("#view"); v.scrollTop=v.scrollHeight; const i=$("#aq"); i&&i.focus() } }

/* ============ PERFIL ============ */
function viewPerfil(v){
  const p=S.profile||{}; const n=doneCount();
  v.innerHTML=`<div class="stack">
    <div class="phero"><div class="big">${ring(n/6)}<div class="av">${avatarHTML(p.avatar)}</div></div><h1>${esc(p.name||"Explorador(a)")}</h1><p>${esc(p.turma||"1º ano do Ensino Médio")}</p>${p.provider?`<span class="tag" style="background:rgba(255,255,255,.2);color:#fff">Conectado com ${esc(p.provider)}</span>`:""}<button class="btn" id="editP" style="background:#fff;color:#1E6A5A;margin-top:4px">Editar perfil</button></div>
    <div class="stats"><div class="stat"><b>${n}/6</b><span>encontros concluídos</span></div><div class="stat"><b>${exCount()}</b><span>atividades respondidas</span></div><div class="stat"><b>${fgCount}</b><span>fungos no fungário</span></div><div class="stat"><b>${Object.values(S.diary).filter(x=>x&&x.trim()).length}</b><span>registros no diário</span></div></div>
    <div class="box stack" style="gap:10px"><h3 style="font-size:1.05rem">Enviar minhas respostas à professora</h3><p class="note">Junta respostas discursivas, diário de bordo, registros de experimentos e mapas conceituais num texto para enviar por WhatsApp ou e-mail.</p><button class="btn" id="share">Compartilhar meu registro</button></div>
    <div class="box"><div class="setrow"><div><b>Acessibilidade</b><p class="note">Tamanho do texto, contraste, Libras, leitura em voz alta</p></div><button class="btn ghost small" id="a11y2">Abrir</button></div>
      <div class="setrow"><div><b>Sobre o aplicativo</b><p class="note">Pesquisa, autoria e créditos</p></div><button class="btn ghost small" id="about">Abrir</button></div></div>
    <button class="btn ghost" id="logout">Sair e trocar de usuário</button>
    <div id="lo"></div></div>`;
  $("#editP",v).onclick=()=>openLogin(true);
  $("#share",v).onclick=shareRegistro;
  $("#a11y2",v).onclick=openA11y; $("#about",v).onclick=openAbout;
  $("#logout",v).onclick=()=>{ $("#lo",v).innerHTML=`<div class="confirm"><p><b>Sair deste perfil?</b> Escolha se quer manter o progresso neste aparelho.</p><div class="row"><button class="btn" id="lk">Sair e manter progresso</button><button class="btn danger" id="lx">Sair e apagar tudo</button><button class="btn ghost" id="lc">Cancelar</button></div></div>`;
    $("#lk",v).onclick=()=>{ S.profile=null; save(); Auth.signOut(); openLogin() };
    $("#lx",v).onclick=async()=>{ const st=S.settings; S=DEF(); S.settings=st; save(); try{ for(const r of await DB.all()) await DB.del(r.id) }catch(e){} fgCount=0; Auth.signOut(); openLogin() };
    $("#lc",v).onclick=()=>{$("#lo",v).innerHTML=""}; };
}
function registroText(){
  const p=S.profile||{}; let t=`MICOVERSO AMAZÔNICO — Registro de ${p.name||"estudante"}${p.turma?" ("+p.turma+")":""}\n`;
  t+=`Encontros concluídos: ${doneCount()}/6\n`;
  MISSIONS.forEach((m,i)=>{
    const lines=[];
    m.ex.forEach((e,j)=>{ const k=`${m.id}:${j}`; if(e.t==="open"&&S.open[k]) lines.push(`- ${e.q}\n  ${S.open[k]}`); else if(S.ex[k]) lines.push(`- ${KIND[e.t]}: ${S.ex[k].ok?"acertou":S.ex[k].n!=null?S.ex[k].n+" corretas":"errou"}`) });
    if(S.open["reg:"+m.id]) lines.push(`- Registro do experimento: ${S.open["reg:"+m.id]}`);
    if(S.diary[m.id]) lines.push(`- Diário: ${S.diary[m.id]}`);
    if(lines.length) t+=`\nEncontro ${i+1} — ${m.title}\n`+lines.join("\n")+"\n";
  });
  ["inicial","final"].forEach(mm=>{ if(S.maps[mm].length) t+=`\nMapa conceitual ${mm}:\n`+S.maps[mm].map(x=>`- ${x[0]} ${x[1]} ${x[2]}`).join("\n")+"\n" });
  return t;
}
async function shareRegistro(){
  const t=registroText();
  if(navigator.share){ try{ await navigator.share({title:"Meu registro no Micoverso",text:t}); return }catch(e){ if(e&&e.name==="AbortError") return } }
  try{ await navigator.clipboard.writeText(t); toast("Registro copiado. Cole no WhatsApp ou e-mail.") }
  catch(e){ const sh=openSheet({title:"Meu registro"}); sh.body.innerHTML=`<p class="note" style="margin-bottom:8px">Selecione o texto e copie.</p><textarea id="regt" style="min-height:60vh">${esc(t)}</textarea>`; $("#regt",sh.body).select() }
}

/* ---------- Login / perfil ---------- */
const Auth={
  ready:false, fb:null,
  enabled(){ return !!(CFG.firebase&&CFG.firebase.apiKey) },
  load(){ if(!this.enabled()) return Promise.resolve(null); if(this.fb) return Promise.resolve(this.fb);
    const add=src=>new Promise((res,rej)=>{const s=document.createElement("script"); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s)});
    return add("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js").then(()=>add("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js")).then(()=>{ firebase.initializeApp(CFG.firebase); this.fb=firebase; return firebase }) },
  async signIn(kind){
    const fb=await this.load(); const prov=kind==="google"?new fb.auth.GoogleAuthProvider():new fb.auth.FacebookAuthProvider();
    let cred; try{ cred=await fb.auth().signInWithPopup(prov) }catch(e){ if(e&&/popup/i.test(e.code||"")){ await fb.auth().signInWithRedirect(prov); return null } throw e }
    return cred&&cred.user;
  },
  async redirectResult(){ if(!this.enabled()) return null; try{ const fb=await this.load(); const r=await fb.auth().getRedirectResult(); return r&&r.user }catch(e){ return null } },
  signOut(){ if(this.fb) try{this.fb.auth().signOut()}catch(e){} }
};
function openLogin(editing){
  const p=Object.assign({name:"",turma:"",avatar:"k:0"},S.profile||{});
  const sh=openSheet({title:editing?"Editar perfil":"Entrar no Micoverso"});
  if(!editing){ $("[data-close]",sh.el).hidden=true }
  function draw(){
    sh.body.innerHTML=`<div class="stack">
      ${editing?"":`<div class="cover"><div class="scene">${amazonScene()}</div><div class="ttl"><b>Bem-vindo(a) ao Micoverso</b><span>Crie seu perfil para guardar seu progresso.</span></div></div>`}
      ${Auth.enabled()&&!editing?`<div class="stack" style="gap:8px"><button class="prov" id="lg"><svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.8 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-16.6z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-8 6.2C6.5 42.6 14.6 48 24 48z"/></svg>Entrar com Google</button><button class="prov" id="lf"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M13.4 19.5v-6.3h2.1l.3-2.5h-2.4V9.2c0-.7.2-1.2 1.2-1.2h1.3V5.8c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.8H8.7v2.5h2.1v6.3z"/></svg>Entrar com Facebook</button><p class="note" id="lerr" role="alert"></p><div class="divider">ou crie um perfil neste aparelho</div></div>`:""}
      <div class="field"><label>Escolha sua foto de perfil</label><div class="avgrid" role="group" aria-label="Avatares">${AVATARS.map((a,i)=>`<button type="button" class="avbtn" data-av="k:${i}" aria-pressed="${p.avatar==="k:"+i}" aria-label="Avatar ${i+1}">${art(a[0],a[1],a[2])}</button>`).join("")}${p.avatar.startsWith("img:")?`<button type="button" class="avbtn" data-av="${esc(p.avatar)}" aria-pressed="true" aria-label="Sua foto"><img src="${esc(p.avatar.slice(4))}" alt=""></button>`:""}</div>
        <div class="row" style="margin-top:10px"><label class="btn ghost small" for="avf" style="margin:0">${ICON.cam}Usar uma foto minha</label><input type="file" id="avf" accept="image/*" class="sr"></div></div>
      <form class="stack" id="lform" novalidate>
        <div class="field"><label for="ln">Nome ou apelido</label><input type="text" id="ln" value="${esc(p.name)}" maxlength="40" autocomplete="nickname" required></div>
        <div class="field"><label for="lt">Turma</label><input type="text" id="lt" value="${esc(p.turma)}" maxlength="30" placeholder="ex.: 1º ano A"></div>
        <p class="note" id="lmsg" role="alert"></p>
        <button class="btn" type="submit">${editing?"Salvar perfil":"Entrar"}</button>
      </form>
      ${editing?"":`<button class="btn ghost" id="guest">Continuar sem cadastro</button>`}
      <p class="note">Seus dados ficam salvos apenas neste aparelho${Auth.enabled()?", exceto quando você entra com Google ou Facebook":""}.</p></div>`;
    $$(".avbtn",sh.body).forEach(b=>b.onclick=()=>{p.avatar=b.dataset.av; $$(".avbtn",sh.body).forEach(x=>x.setAttribute("aria-pressed",String(x===b)))});
    $("#avf",sh.body).onchange=async e=>{ const f=e.target.files&&e.target.files[0]; if(!f) return; try{ const b=await resizeImage(f,256,.8); p.avatar="img:"+await new Promise(r=>{const fr=new FileReader(); fr.onload=()=>r(fr.result); fr.readAsDataURL(b)}); keep(); draw() }catch(err){ $("#lmsg",sh.body).textContent="Não foi possível usar essa imagem." } };
    const keep=()=>{ p.name=$("#ln",sh.body).value; p.turma=$("#lt",sh.body).value };
    $("#lform",sh.body).onsubmit=e=>{ e.preventDefault(); keep(); p.name=p.name.trim(); p.turma=p.turma.trim();
      if(!p.name){ $("#lmsg",sh.body).textContent="Escreva seu nome ou apelido."; $("#ln",sh.body).focus(); return }
      S.profile=Object.assign({},S.profile||{},p); save(); toast(editing?"Perfil salvo":"Bem-vindo(a), "+firstName()+"!"); history.back() };
    const g=$("#guest",sh.body); if(g) g.onclick=()=>{ S.profile={name:"Explorador(a)",turma:"",avatar:p.avatar,guest:true}; save(); history.back() };
    const lg=$("#lg",sh.body), lf=$("#lf",sh.body);
    const go=kind=>async()=>{ try{ const u=await Auth.signIn(kind); if(u){ S.profile={name:u.displayName||"Estudante",turma:p.turma||"",avatar:u.photoURL?"img:"+u.photoURL:p.avatar,provider:kind==="google"?"Google":"Facebook",uid:u.uid}; save(); history.back() } }catch(err){ $("#lerr",sh.body).textContent="Não foi possível entrar agora. Tente de novo ou crie um perfil neste aparelho." } };
    if(lg) lg.onclick=go("google"); if(lf) lf.onclick=go("facebook");
  }
  draw();
}

/* ---------- Acessibilidade ---------- */
function openA11y(){
  const sh=openSheet({title:"Acessibilidade",sub:"Ajuste o aplicativo para você"});
  function sw(id,on,label,desc){ return `<div class="setrow"><div><b id="${id}_l">${label}</b>${desc?`<p class="note">${desc}</p>`:""}</div><button class="switch" role="switch" id="${id}" aria-checked="${on}" aria-labelledby="${id}_l"></button></div>` }
  function draw(){
    const st=S.settings; const pv=TTS.ok?TTS.ptVoices():[]; const showAll=sh._all; const vs=showAll?TTS.voices:pv;
    sh.body.innerHTML=`<div class="stack">
      <div class="box"><div class="setrow"><div><b>Tamanho do texto</b><p class="note">${Math.round(st.fs*100)}%</p></div><div class="sizebtns"><button id="fsm" aria-label="Diminuir texto">A−</button><button id="fsp" aria-label="Aumentar texto">A+</button></div></div>
        ${sw("ct",st.contrast,"Alto contraste","Preto, branco e amarelo, para baixa visão")}
        <div class="setrow"><div><b>Tema</b></div><div class="seg" role="group" aria-label="Tema" style="min-width:210px"><button data-th="system" aria-pressed="${st.theme==="system"}">Auto</button><button data-th="light" aria-pressed="${st.theme==="light"}">Claro</button><button data-th="dark" aria-pressed="${st.theme==="dark"}">Escuro</button></div></div>
        ${sw("fo",st.font==="lexend","Fonte de leitura facilitada","Letras mais abertas, indicada para dislexia")}
        ${sw("sp",st.spacing,"Espaçamento ampliado","Mais espaço entre linhas, letras e palavras")}
        ${sw("mo",!st.motion,"Reduzir animações","")}</div>
      <div class="box stack" style="gap:10px"><h3 style="font-size:1.05rem">Leitura em voz alta</h3>
        ${TTS.ok?`<div class="field"><label for="vsel">Voz</label><select id="vsel"><option value="">Automática (português)</option>${vs.map(v=>`<option value="${esc(v.voiceURI)}" ${st.voice===v.voiceURI?"selected":""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("")}</select>
          <p class="note" style="margin-top:4px">${pv.length?pv.length+" vozes em português encontradas.":"Nenhuma voz em português encontrada neste aparelho. No iPhone: Ajustes › Acessibilidade › Conteúdo Falado › Vozes › Português. No Android: Configurações › Acessibilidade › Conversão de texto em voz."}</p>
          <button class="btn ghost small" id="allv" style="align-self:flex-start;margin-top:6px">${showAll?"Mostrar só vozes em português":"Mostrar todas as vozes"}</button></div>
        <div class="field"><label for="rate">Velocidade: <span id="rv">${st.rate.toFixed(1)}×</span></label><input type="range" id="rate" min="0.6" max="1.6" step="0.1" value="${st.rate}" style="width:100%"></div>
        <div>${sayBtn("Olá! Eu sou a voz do Micoverso Amazônico. Os fungos formam um reino próprio, o Reino Fungi.","Testar voz")}</div>`:`<p class="note">Este navegador não oferece leitura em voz alta.</p>`}</div>
      <div class="box">${sw("lb",st.libras,"Tradução em Libras (VLibras)","Mostra o botão do VLibras, do Governo Federal, que traduz textos para Libras. Toque em um texto depois de abrir o VLibras. Precisa de internet.")}</div>
      <p class="note">Todas as funções podem ser usadas com leitores de tela (VoiceOver e TalkBack) e com teclado.</p></div>`;
    const set=(k,val)=>{S.settings[k]=val; save(); applySettings(); draw()};
    $("#fsm",sh.body).onclick=()=>set("fs",Math.max(.85,+(st.fs-.1).toFixed(2)));
    $("#fsp",sh.body).onclick=()=>set("fs",Math.min(1.6,+(st.fs+.1).toFixed(2)));
    $("#ct",sh.body).onclick=()=>set("contrast",!st.contrast);
    $("#fo",sh.body).onclick=()=>set("font",st.font==="lexend"?"base":"lexend");
    $("#sp",sh.body).onclick=()=>set("spacing",!st.spacing);
    $("#mo",sh.body).onclick=()=>set("motion",!st.motion);
    $$("[data-th]",sh.body).forEach(b=>b.onclick=()=>set("theme",b.dataset.th));
    $("#lb",sh.body).onclick=()=>{ S.settings.libras=!st.libras; save(); if(S.settings.libras){ Libras.load(); toast("VLibras ativado") } else { Libras.hide(); toast("VLibras desativado") } draw() };
    if(TTS.ok){ $("#vsel",sh.body).onchange=e=>{S.settings.voice=e.target.value; save()}; $("#rate",sh.body).oninput=e=>{S.settings.rate=+e.target.value; $("#rv",sh.body).textContent=S.settings.rate.toFixed(1)+"×"; save()}; $("#allv",sh.body).onclick=()=>{sh._all=!sh._all; draw()} }
  }
  draw();
  if(TTS.ok&&!TTS.voices.length) setTimeout(()=>{ TTS.init(); if(sheets[sheets.length-1]===sh) draw() },700);
}
const Libras={
  loaded:false,
  load(){ const w=$("[vw]"); if(w){ w.hidden=false; return } if(this.loaded) return; this.loaded=true;
    const d=document.createElement("div"); d.setAttribute("vw",""); d.className="enabled"; d.innerHTML='<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>'; document.body.appendChild(d); this.watch();
    const s=document.createElement("script"); s.src="https://vlibras.gov.br/app/vlibras-plugin.js"; s.onload=()=>{ try{ new window.VLibras.Widget("https://vlibras.gov.br/app"); if(document.readyState==="complete") window.dispatchEvent(new Event("load")) }catch(e){} }; s.onerror=()=>{ this.loaded=false; d.remove(); toast("Não foi possível carregar o VLibras. Verifique a internet.") }; document.body.appendChild(s) },
  hide(){ const w=$("[vw]"); if(w) w.hidden=true; this.sync(false) },
  btn:null, obs:null,
  watch(){ const wr=$("[vw-plugin-wrapper]"); if(!wr) return; if(!this.obs){ this.obs=new MutationObserver(()=>this.sync()); this.obs.observe(wr,{attributes:true,attributeFilter:["class"]}) } this.sync() },
  sync(force){ const wr=$("[vw-plugin-wrapper]"); const open=force===false?false:!!(wr&&wr.classList.contains("active"));
    if(!this.btn){ const b=document.createElement("button"); b.className="librasx"; b.type="button"; b.innerHTML=ICON.close+"<span>Fechar Libras</span>"; b.setAttribute("aria-label","Fechar a janela do VLibras"); b.onclick=()=>this.close(); document.body.appendChild(b); this.btn=b }
    this.btn.hidden=!open },
  close(){ const wr=$("[vw-plugin-wrapper]"), ab=$("[vw-access-button]"); if(wr) wr.classList.remove("active"); if(ab) ab.classList.add("active"); this.sync(false); announce("Janela do VLibras fechada") }
};


/* ---------- Professora / Sobre ---------- */
function openAbout(){
  const sh=openSheet({title:"Sobre o aplicativo"});
  sh.body.innerHTML=`<div class="stack">
    <div class="cover"><div class="scene">${amazonScene()}</div><div class="ttl"><b>MICOVERSO AMAZÔNICO</b><span>Versão 2.2 · Fungos da nossa floresta</span></div></div>
    <div class="box"><p>Produto educacional da pesquisa de mestrado “Ensino de Micologia na Educação Básica: Desenvolvimento e Validação de um Artefato Pedagógico Digital Interativo Baseado em Inteligência Artificial sobre a Biodiversidade Fúngica Amazônica” (PPGEECA/UEPA).</p><p style="margin-top:8px"><b>Autora:</b> Jéssica Batista de Assunção<br><b>Orientador:</b> Prof. Dr. Alcindo da Silva Martins Junior</p><p style="margin-top:8px"><b>Público:</b> 1º ano do Ensino Médio · E.E.E.M. Salomão Matos, Salvaterra, Marajó (PA).</p><p class="note" style="margin-top:8px">Usado junto com o lapbook físico, em 6 encontros.</p></div>
    <div class="box"><p class="eyebrow" style="margin-bottom:4px">Créditos</p><p class="note">Fotos da Micoteca: iNaturalist e seus autores, com crédito em cada ficha. Tradução em Libras: VLibras (Governo Federal). Personagens e história: criação original para este aplicativo.</p></div></div>`;
}

/* ============ EXTRAS: histórias, linha do tempo, palavras, revisão, mapa ============ */
function openHistorias(){
  const sh=openSheet({title:"Histórias da floresta",sub:"A saga de Iara em 6 capítulos"});
  sh.body.innerHTML=`<div class="stack"><p class="lead">Iara, estudante do 1º ano em Salvaterra, descobre o mundo dos fungos com a avó, o primo Kauã e a turma. Cada capítulo tem pausas para pensar.</p>${MISSIONS.map((m,i)=>{const r=S.story[m.id]; const done=r&&r.n>=m.story.segs.length; return `<button class="box cont" data-h="${m.id}"><div class="art">${art(m.story.art)}</div><div style="min-width:0"><p class="eyebrow">Capítulo ${i+1}${done?" · lido":""}</p><h3 style="font-size:1.1rem">${esc(m.story.title)}</h3></div></button>`}).join("")}</div>`;
  $$("[data-h]",sh.body).forEach(b=>b.onclick=()=>{ const m=MISSIONS.find(x=>x.id===b.dataset.h); const s2=openSheet({title:m.story.title,sub:"Capítulo "+(MISSIONS.indexOf(m)+1)}); renderStory(m,s2.body) });
  sh.refresh=()=>{};
}
function openTimeline(){
  const sh=openSheet({title:"Linha do tempo da micologia"}); let f="Todos";
  function draw(){
    const L=TIMELINE.filter(t=>f==="Todos"||t[1]===f);
    sh.body.innerHTML=`<div class="stack"><div class="chips" role="group" aria-label="Filtrar">${["Todos","Mundo","Brasil","Amazônia"].map(x=>`<button class="chip" aria-pressed="${x===f}" data-f="${x}">${x}</button>`).join("")}</div>
      <p class="note">Bolinha verde-escura: mundo · laranja: Brasil · verde cheia: Amazônia</p>
      <div class="tl">${L.map(t=>`<div class="tl-item ${t[1]==="Brasil"?"br":t[1]==="Amazônia"?"am":""}"><div class="tl-year">${esc(t[0])} <span class="tag">${esc(t[1])}</span></div><h3 style="font-size:1.05rem;margin:2px 0">${esc(t[2])}</h3><p>${esc(t[3])}</p><div style="margin-top:4px">${sayBtn(t[0]+". "+t[2]+". "+t[3],"Ouvir",true)}</div></div>`).join("")}</div></div>`;
    $$("[data-f]",sh.body).forEach(b=>b.onclick=()=>{f=b.dataset.f; draw()});
  }
  draw();
}
function openPalavras(){
  const sh=openSheet({title:"De onde vêm as palavras",sub:"Etimologia da micologia"});
  sh.body.innerHTML=`<div class="stack"><p class="lead">Muitos termos da micologia vêm do grego e do latim. Conhecer a origem ajuda a entender e lembrar o significado.</p><div class="words">${WORDS.map(w=>`<div class="word"><b>${esc(w[0])}</b><p>${esc(w[1])}</p><div style="margin-top:4px">${sayBtn(w[0]+". "+w[1],"Ouvir",true)}</div></div>`).join("")}</div></div>`;
}
function openRevisao(){
  const sh=openSheet({title:"Atividades de fixação",sub:"Revisão por encontro"}); let open=null;
  function draw(){
    sh.body.innerHTML=`<div class="stack"><p class="lead">Escolha um encontro para revisar. As respostas da revisão são independentes das feitas no encontro.</p>${MISSIONS.map((m,i)=>`<div class="box stack" style="gap:10px"><button class="row" data-r="${m.id}" style="background:none;border:0;padding:0;text-align:left;flex-wrap:nowrap" aria-expanded="${open===m.id}"><div style="width:48px;flex:none">${art(m.art)}</div><div style="min-width:0;flex:1"><p class="eyebrow">Encontro ${i+1}</p><b>${esc(m.title)}</b></div><span aria-hidden="true">${open===m.id?"▲":"▼"}</span></button>${open===m.id?`<div class="stack" data-host="${m.id}"></div>`:""}</div>`).join("")}</div>`;
    $$("[data-r]",sh.body).forEach(b=>b.onclick=()=>{open=open===b.dataset.r?null:b.dataset.r; draw()});
    const h=open&&$(`[data-host="${open}"]`,sh.body); if(h){ const m=MISSIONS.find(x=>x.id===open); m.ex.forEach((e,j)=>h.appendChild(exercise(e,`rev:${m.id}:${j}`))) }
  }
  draw();
}
const CONCEPTS=["Fungos","Reino Fungi","Eucariontes","Heterotróficos","Absorção","Enzimas","Quitina","Glicogênio","Hifas","Micélio","Esporos","Corpo de frutificação","Reprodução sexuada","Reprodução assexuada","Leveduras","Fermentação","Bolores","Cogumelos","Basidiomycota","Ascomycota","Liquens","Micorrizas","Decompositores","Parasitas","Mutualismo","Floresta amazônica","Solo","Saúvas","Bioluminescência","Penicilina","Micoses","Vassoura-de-bruxa","Alimentos","Ser humano","Etnomicologia"];
const LINKS=["são","formam","possuem","produzem","se reproduzem por","vivem em","atuam como","se associam a","causam","originam","dependem de","ajudam","decompõem","são usados em"];
function openMapa(){
  const sh=openSheet({title:"Mapa conceitual"}); let mode="inicial";
  function draw(){
    const u=l=>{const s=new Set(); l.forEach(p=>{s.add(p[0]);s.add(p[2])}); return s.size};
    sh.body.innerHTML=`<div class="stack"><p class="lead">Cada ligação é uma proposição: conceito + palavra de ligação + conceito (Novak; Moreira).</p>
      <div class="seg" role="group" aria-label="Versão do mapa"><button aria-pressed="${mode==="inicial"}" data-mm="inicial">Inicial</button><button aria-pressed="${mode==="final"}" data-mm="final">Final</button></div><div id="mapHost"></div>
      <div><p class="eyebrow" style="margin-bottom:8px">Comparação</p><div class="stats"><div class="stat"><b>${S.maps.inicial.length} → ${S.maps.final.length}</b><span>proposições (inicial → final)</span></div><div class="stat"><b>${u(S.maps.inicial)} → ${u(S.maps.final)}</b><span>conceitos diferentes</span></div></div></div></div>`;
    $$("[data-mm]",sh.body).forEach(b=>b.onclick=()=>{mode=b.dataset.mm; draw()});
    mapBuilder($("#mapHost",sh.body),mode,draw);
  }
  draw();
}
function mapBuilder(host,mode,onChange){
  const opts=CONCEPTS.map(c=>`<option>${esc(c)}</option>`).join("");
  function draw(){
    const L=S.maps[mode];
    host.innerHTML=`<div class="stack" style="gap:12px"><form class="box stack" id="pf_${mode}" style="gap:10px">
      <div class="field"><label for="ca_${mode}">Conceito</label><select id="ca_${mode}">${opts}</select></div>
      <div class="field"><label for="lk_${mode}">Palavra de ligação</label><input type="text" id="lk_${mode}" list="lkl" placeholder="ex.: são, formam, vivem em" maxlength="30" autocomplete="off"><datalist id="lkl">${LINKS.map(l=>`<option value="${esc(l)}">`).join("")}</datalist></div>
      <div class="field"><label for="cb_${mode}">Conceito</label><select id="cb_${mode}">${opts}</select></div>
      <p class="note" id="pe_${mode}" role="alert"></p>
      <button class="btn">Adicionar ligação</button></form>
      ${L.length?mapSvg(L):`<p class="note">Seu mapa ${mode} ainda está vazio. Comece ligando “Fungos” a outro conceito.</p>`}
      <div class="stack" style="gap:8px">${L.map((p,i)=>`<div class="prop"><span class="c">${esc(p[0])}</span><span class="l">${esc(p[1])}</span><span class="c">${esc(p[2])}</span><button class="x" data-del="${i}" aria-label="Remover ligação ${esc(p[0]+" "+p[1]+" "+p[2])}">×</button></div>`).join("")}</div></div>`;
    $(`#cb_${mode}`,host).selectedIndex=8;
    $(`#pf_${mode}`,host).onsubmit=e=>{ e.preventDefault(); const a=$(`#ca_${mode}`,host).value,b=$(`#cb_${mode}`,host).value,l=$(`#lk_${mode}`,host).value.trim(); const er=$(`#pe_${mode}`,host);
      if(a===b){er.textContent="Escolha dois conceitos diferentes."; return} if(!l){er.textContent="Escreva a palavra de ligação."; $(`#lk_${mode}`,host).focus(); return}
      S.maps[mode].push([a,l,b]); save(); announce("Ligação adicionada"); onChange?onChange():draw() };
    $$("[data-del]",host).forEach(b=>b.onclick=()=>{S.maps[mode].splice(+b.dataset.del,1); save(); onChange?onChange():draw()});
  }
  draw();
}
function mapSvg(L){
  const nodes=[]; L.forEach(p=>[p[0],p[2]].forEach(c=>{if(!nodes.includes(c)) nodes.push(c)}));
  const n=nodes.length, W=560, H=Math.max(320,n*30+120), cx=W/2, cy=H/2, R=Math.min(W,H)/2-60;
  const pos={}; nodes.forEach((c,i)=>{const a=-Math.PI/2+i*2*Math.PI/n; pos[c]=[cx+Math.cos(a)*(n>1?R:0), cy+Math.sin(a)*(n>1?R:0)]});
  const edges=L.map(p=>{const [x1,y1]=pos[p[0]],[x2,y2]=pos[p[2]];return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--muted)" stroke-width="1.6" marker-end="url(#ar)"/><text x="${(x1+x2)/2}" y="${(y1+y2)/2-4}" text-anchor="middle" font-size="12" font-style="italic" fill="var(--muted)" style="paint-order:stroke" stroke="var(--surface)" stroke-width="4">${esc(p[1])}</text>`}).join("");
  const ns=nodes.map(c=>{const [x,y]=pos[c];const w=Math.max(60,c.length*7.4+18);return `<rect x="${x-w/2}" y="${y-15}" width="${w}" height="30" rx="8" fill="var(--accent-soft)" stroke="var(--accent)"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="13" font-weight="700" fill="var(--accent)">${esc(c)}</text>`}).join("");
  return `<div class="mapwrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Desenho do mapa conceitual com ${n} conceitos" style="display:block;max-width:none;min-width:100%" font-family="Atkinson Hyperlegible, sans-serif"><defs><marker id="ar" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--muted)"/></marker></defs>${edges}${ns}</svg></div>`;
}

/* ============ MENU LATERAL ============ */
const DI={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
 trail:'<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8 17c6 0 2-9 8-10" stroke-dasharray="2 2.5"/>',
 mush:'<path d="M3 12a9 6 0 0 1 18 0z"/><path d="M10 12v6a2 2 0 0 0 4 0v-6"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 key:'<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 book:'<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 abc:'<path d="M4 18l4-12 4 12M5.5 14h5M15 6h3a2.5 2.5 0 0 1 0 5h-3zm0 5h3.5a2.5 2.5 0 0 1 0 5H15z"/>',
 list:'<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
 map:'<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="16" width="7" height="5" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><path d="M10 5.5h4M17.5 8v8"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 a11y:'<circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M12 14.5l-3.5 6M12 14.5l3.5 6"/>',
 hand:'<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-5.5a1.5 1.5 0 0 1 3 0V13c0 4-2.5 7-6 7-2.5 0-4-1.5-5.5-4L4 13a1.5 1.5 0 0 1 2.5-1.5L8 13"/>',
 share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>'
};
const Drawer={
  open:false, el:null,
  show(){
    if(this.open) return; TTS.stop(); this.open=true;
    const p=S.profile||{}; const cur=sheets.length?"":tab;
    const it=(id,ic,label,on)=>`<button class="dr-item" data-d="${id}" ${on?'aria-current="page"':""}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${DI[ic]}</svg><span>${label}</span></button>`;
    const w=document.createElement("div");
    w.innerHTML=`<div class="scrim" data-d="x"></div><nav class="drawer" id="drawer" aria-label="Menu" role="dialog" aria-modal="true">
      <div class="dr-head"><div class="scene">${amazonScene()}</div><button class="dr-close" data-d="x" aria-label="Fechar menu">${ICON.close}</button>
        <button class="who" data-d="perfil"><div class="av">${avatarHTML(p.avatar)}</div><div style="min-width:0"><b>${esc(p.name||"Explorador(a)")}</b><span>${esc(p.turma||"Ver meu perfil")}</span></div></button></div>
      <div class="dr-list">
        <p class="dr-sec">Navegar</p>
        ${it("inicio","home","Início",cur==="inicio")}${it("encontros","trail","Encontros",cur==="encontros")}${it("micoteca","mush","Micoteca",cur==="micoteca")}${it("fungario","cam","Meu fungário")}${it("chave","key","Chave de identificação")}${it("batista","chat","Batista, o assistente",cur==="batista")}
        <p class="dr-sec">Aprender mais</p>
        ${it("historias","book","Histórias da floresta")}${it("tempo","clock","Linha do tempo")}${it("palavras","abc","De onde vêm as palavras")}${it("revisao","list","Atividades de fixação")}${it("mapa","map","Mapa conceitual")}
        <p class="dr-sec">Minha conta</p>
        ${it("perfil","user","Meu perfil",cur==="perfil")}${it("share","share","Enviar respostas à professora")}${it("a11y","a11y","Acessibilidade")}${it("libras","hand",S.settings.libras?"Desligar Libras (VLibras)":"Ligar Libras (VLibras)")}
        <p class="dr-sec">Sobre</p>
        ${it("about","info","Sobre o aplicativo")}
      </div></nav>`;
    document.body.appendChild(w); this.el=w; $("#menuBtn").setAttribute("aria-expanded","true");
    try{history.pushState({drawer:1},"")}catch(e){}
    $$("[data-d]",w).forEach(b=>b.onclick=()=>this.go(b.dataset.d));
    setTimeout(()=>{const f=$(".dr-close",w); f&&f.focus()},30);
  },
  close(fromPop){ if(!this.open) return; this.open=false; this.el&&this.el.remove(); this.el=null; $("#menuBtn").setAttribute("aria-expanded","false"); if(!fromPop) history.back() },
  go(d){
    const act={
      x:null,
      inicio:()=>setTab("inicio"), encontros:()=>setTab("encontros"), micoteca:()=>{micoMode="catalogo";setTab("micoteca")}, batista:()=>setTab("batista"), perfil:()=>setTab("perfil"),
      fungario:()=>{micoMode="fungario";setTab("micoteca")}, chave:()=>{micoMode="chave";setTab("micoteca")},
      historias:openHistorias, tempo:openTimeline, palavras:openPalavras, revisao:openRevisao, mapa:openMapa,
      share:shareRegistro, a11y:openA11y, about:openAbout,
      libras:()=>{ S.settings.libras=!S.settings.libras; save(); if(S.settings.libras){Libras.load(); toast("VLibras ativado: toque no botão azul de Libras na lateral da tela")} else {Libras.hide(); toast("VLibras desligado")} }
    }[d];
    const tabAct=["inicio","encontros","micoteca","batista","perfil","fungario","chave"].includes(d);
    closeAll(()=>{ act&&act(); if(!act) $("#menuBtn").focus() }, tabAct);
  }
};
function closeAll(then,alsoSheets){
  let n=0;
  if(Drawer.open){ Drawer.open=false; Drawer.el&&Drawer.el.remove(); Drawer.el=null; $("#menuBtn").setAttribute("aria-expanded","false"); n++ }
  if(alsoSheets) while(sheets.length){ const sh=sheets.pop(); sh.el.remove(); sh.onClose&&sh.onClose(); n++ }
  TTS.stop();
  if(!n){ then&&then(); return }
  bulkPop=()=>{ if(alsoSheets&&!then) renderTab(); then&&then() };
  history.go(-n);
}
$("#menuBtn").onclick=()=>Drawer.show();

/* ============ CAPA DE ABERTURA ============ */
function showSplash(){
  return new Promise(res=>{
    const el=document.createElement("div"); el.className="splash"; el.setAttribute("role","dialog"); el.setAttribute("aria-label","Micoverso Amazônico");
    el.innerHTML=`<div class="head"><svg class="stars" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><circle cx="30" cy="40" r="1.2" fill="#FFF4CF" opacity="0.8"/><circle cx="80" cy="90" r="0.8" fill="#FFF4CF" opacity="0.6"/><circle cx="140" cy="30" r="1" fill="#FFF4CF" opacity="0.7"/><circle cx="250" cy="60" r="1.3" fill="#FFF4CF" opacity="0.8"/><circle cx="320" cy="25" r="0.9" fill="#FFF4CF" opacity="0.6"/><circle cx="360" cy="100" r="1.1" fill="#FFF4CF" opacity="0.7"/><circle cx="200" cy="120" r="0.7" fill="#FFF4CF" opacity="0.5"/><circle cx="60" cy="150" r="0.9" fill="#FFF4CF" opacity="0.6"/><circle cx="300" cy="160" r="0.8" fill="#FFF4CF" opacity="0.5"/></svg><h1>MICOVERSO<span>AMAZÔNICO</span></h1><p>Os fungos da nossa floresta</p></div><div class="scene">${amazonScene()}</div><div class="foot"><button class="btn" type="button">Entrar</button></div>`;
    document.body.appendChild(el);
    let done=false; const end=()=>{ if(done) return; done=true; el.classList.add("out"); setTimeout(()=>{el.remove(); res()},S.settings.motion?400:0) };
    el.onclick=end; setTimeout(end,2600); setTimeout(()=>{const b=$(".btn",el); b&&b.focus()},50);
  });
}

/* ============ INÍCIO DO APP ============ */
(async function boot(){
  setTab("inicio");
  await showSplash();
  if(S.settings.libras) Libras.load();
  if(!S.profile){
    const u=await Auth.redirectResult();
    if(u){ S.profile={name:u.displayName||"Estudante",turma:"",avatar:u.photoURL?"img:"+u.photoURL:"k:0",provider:"Google ou Facebook",uid:u.uid}; save(); renderTab() }
    else openLogin();
  }
  if("serviceWorker" in navigator && location.protocol==="https:") window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
})();
