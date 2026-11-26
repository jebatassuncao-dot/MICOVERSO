/* Ilustração da Amazônia (capa e ícone) */
(function(){
  function crowns(y,x0,x1,step,rmin,rmax,fill,seed){
    let s=seed, out="";
    for(let x=x0;x<=x1;x+=step){ s=(s*9301+49297)%233280; const r=rmin+(s/233280)*(rmax-rmin); out+=`<circle cx="${x.toFixed(1)}" cy="${(y-r*0.35).toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}"/>`; }
    return out;
  }
  function palm(x,y,h,c){ // açaizeiro
    const tx=x+h*0.12, ty=y-h;
    let f=""; for(let i=0;i<7;i++){ const a=-Math.PI*0.95+i*(Math.PI*0.9/6); const ex=tx+Math.cos(a)*h*0.34, ey=ty+Math.sin(a)*h*0.22+h*0.08; f+=`<path d="M${tx} ${ty} Q${((tx+ex)/2).toFixed(1)} ${(Math.min(ty,ey)-h*0.06).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${c}" stroke-width="${(h*0.035).toFixed(2)}" fill="none" stroke-linecap="round"/>`; }
    return `<path d="M${x} ${y} Q${x+h*0.02} ${y-h*0.5} ${tx} ${ty}" stroke="${c}" stroke-width="${(h*0.03).toFixed(2)}" fill="none"/>${f}`;
  }
  function samauma(x,y,h,c){
    return `<path d="M${x-h*0.03} ${y} L${x-h*0.015} ${y-h} L${x+h*0.015} ${y-h} L${x+h*0.03} ${y}Z" fill="${c}"/><path d="M${x} ${y-h*0.75} L${x-h*0.25} ${y-h*0.95} M${x} ${y-h*0.8} L${x+h*0.22} ${y-h*0.98}" stroke="${c}" stroke-width="${h*0.02}"/><ellipse cx="${x}" cy="${y-h}" rx="${h*0.42}" ry="${h*0.1}" fill="${c}"/><ellipse cx="${x-h*0.22}" cy="${y-h*0.97}" rx="${h*0.2}" ry="${h*0.08}" fill="${c}"/><ellipse cx="${x+h*0.2}" cy="${y-h*0.98}" rx="${h*0.2}" ry="${h*0.08}" fill="${c}"/>`;
  }
  function bracket(x,y,w,c){ return `<path d="M${x} ${y} q${w/2} ${-w*0.55} ${w} 0 z" fill="${c}"/><path d="M${x+w*0.12} ${y-w*0.08} q${w*0.38} ${-w*0.36} ${w*0.76} 0" stroke="#F6A06A" stroke-width="${w*0.05}" fill="none" opacity=".7"/>`; }
  function mush(x,y,h,cap){ return `<path d="M${x-h*0.09} ${y} L${x-h*0.06} ${y-h*0.7} L${x+h*0.06} ${y-h*0.7} L${x+h*0.09} ${y}Z" fill="#F3EAD6"/><path d="M${x-h*0.42} ${y-h*0.62} Q${x} ${y-h*1.25} ${x+h*0.42} ${y-h*0.62} Z" fill="${cap}"/><circle cx="${x-h*0.15}" cy="${y-h*0.82}" r="${h*0.05}" fill="#FCEBD2"/><circle cx="${x+h*0.12}" cy="${y-h*0.9}" r="${h*0.04}" fill="#FCEBD2"/>`; }
  function veu(x,y,h){ // véu-de-noiva (Phallus indusiatus)
    const w=h*0.32, cy=y-h*0.8, hem=y-h*0.22; let mesh="";
    const top=cy+h*0.07;
    for(let i=1;i<6;i++){ const t=i/6, yy=top+(hem-top)*t, ww=w*(0.3+0.7*t); mesh+=`<path d="M${(x-ww).toFixed(2)} ${yy.toFixed(2)} Q${x} ${(yy+h*0.025).toFixed(2)} ${(x+ww).toFixed(2)} ${yy.toFixed(2)}" stroke="#BFAF8A" stroke-width="${(h*0.011).toFixed(2)}" fill="none"/>`; }
    for(let i=-4;i<=4;i++){ mesh+=`<path d="M${(x+i*w*0.07).toFixed(2)} ${top.toFixed(2)} L${(x+i*w*0.24).toFixed(2)} ${hem.toFixed(2)}" stroke="#BFAF8A" stroke-width="${(h*0.011).toFixed(2)}"/>`; }
    let wave=""; const n=8; for(let k=0;k<n;k++){ const x0=x+w-(2*w)*k/n, x1=x+w-(2*w)*(k+1)/n; wave+=` Q${((x0+x1)/2).toFixed(2)} ${(hem+h*0.045).toFixed(2)} ${x1.toFixed(2)} ${hem.toFixed(2)}`; }
    return `<path d="M${x-h*0.045} ${y} L${x-h*0.035} ${cy} L${x+h*0.035} ${cy} L${x+h*0.045} ${y}Z" fill="#FBF6EA"/>
      <path d="M${x-w*0.3} ${top} Q${x-w*0.85} ${(top+hem)/2} ${x-w} ${hem} L${x+w} ${hem}${wave.replace(/^ Q/," L"+(x+w)+" "+hem+" Q")} Z" fill="#FBF6EA" opacity=".001"/>
      <path d="M${x-w*0.3} ${top} Q${x-w*0.85} ${(top+hem)/2} ${x-w} ${hem}${(function(){let r="";for(let k=0;k<n;k++){const x0=x-w+(2*w)*k/n,x1=x-w+(2*w)*(k+1)/n;r+=` Q${((x0+x1)/2).toFixed(2)} ${(hem+h*0.045).toFixed(2)} ${x1.toFixed(2)} ${hem.toFixed(2)}`}return r})()} Q${x+w*0.85} ${(top+hem)/2} ${x+w*0.3} ${top}Z" fill="#FBF6EA" opacity=".72"/>${mesh}
      <path d="M${x-h*0.1} ${cy+h*0.08} Q${x-h*0.11} ${cy-h*0.14} ${x} ${cy-h*0.16} Q${x+h*0.11} ${cy-h*0.14} ${x+h*0.1} ${cy+h*0.08}Z" fill="#5A4426"/><path d="M${x-h*0.06} ${cy-h*0.02} h${h*0.12} M${x-h*0.075} ${cy+h*0.03} h${h*0.15}" stroke="#3E2E18" stroke-width="${h*0.012}"/><circle cx="${x}" cy="${cy-h*0.15}" r="${h*0.022}" fill="#FBF6EA"/>`;
  }
  function taca(x,y,s,c){ return `<path d="M${x} ${y} L${x} ${y-s*0.5}" stroke="#E9D8C0" stroke-width="${s*0.12}"/><path d="M${x-s*0.5} ${y-s*1.05} Q${x} ${y-s*0.25} ${x+s*0.5} ${y-s*1.05}Z" fill="${c}"/><ellipse cx="${x}" cy="${y-s*1.05}" rx="${s*0.5}" ry="${s*0.14}" fill="#8E2A4C"/>`; }
  function glow(x,y,s){ return `<circle cx="${x}" cy="${y-s*0.6}" r="${s*1.3}" fill="#9CF5B8" opacity=".22"/><path d="M${x} ${y} L${x} ${y-s*0.7}" stroke="#D5F7DF" stroke-width="${s*0.14}"/><path d="M${x-s*0.42} ${y-s*0.62} Q${x} ${y-s*1.25} ${x+s*0.42} ${y-s*0.62}Z" fill="#8EF0AE"/>`; }
  const skyStops=`<stop offset="0" stop-color="#174F49"/><stop offset=".45" stop-color="#E58C4F"/><stop offset=".8" stop-color="#F9D58F"/>`;

  window.amazonScene=function(){
    return `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" style="display:block;width:100%;height:100%">
    <defs><linearGradient id="amzSky" x1="0" y1="0" x2="0" y2="1">${skyStops}</linearGradient>
    <radialGradient id="amzSun"><stop offset="0" stop-color="#FFF4CF"/><stop offset="1" stop-color="#FFF4CF" stop-opacity="0"/></radialGradient>
    <linearGradient id="amzRiver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9B887"/><stop offset=".35" stop-color="#7FA9A8"/><stop offset="1" stop-color="#3E7C80"/></linearGradient></defs>
    <rect width="400" height="260" fill="url(#amzSky)"/>
    <circle cx="300" cy="128" r="60" fill="url(#amzSun)"/><circle cx="300" cy="128" r="24" fill="#FFF1C1"/>
    <path d="M60 60q5-5 10 0q5-5 10 0M90 46q4-4 8 0q4-4 8 0" stroke="#1C3A33" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${samauma(110,150,70,"#4F7F63")}${samauma(250,150,48,"#4F7F63")}
    <rect x="0" y="140" width="400" height="40" fill="#5F8E70"/>${crowns(142,-6,406,13,8,15,"#5F8E70",7)}
    ${palm(40,175,62,"#2C5E47")}${palm(352,172,56,"#2C5E47")}${palm(372,176,44,"#2C5E47")}
    <rect x="0" y="162" width="400" height="30" fill="#2E654B"/>${crowns(165,-8,408,16,9,17,"#2E654B",31)}
    <path d="M0 188 Q120 176 230 183 T400 180 V260 H0Z" fill="url(#amzRiver)"/>
    <g fill="#FFF1C1" opacity=".75"><rect x="286" y="186" width="28" height="2" rx="1"/><rect x="280" y="194" width="40" height="2" rx="1"/><rect x="290" y="202" width="22" height="2" rx="1"/><rect x="276" y="212" width="46" height="2" rx="1"/></g>
    <path d="M150 230 q22-8 44 0" stroke="#D6EAE6" stroke-width="2" fill="none" opacity=".6"/>
    <path d="M0 206 Q70 196 128 214 Q160 226 170 260 H0Z" fill="#1C4A38"/>
    <g transform="rotate(-6 70 222)"><rect x="12" y="214" width="124" height="20" rx="10" fill="#6E4A2A"/><circle cx="136" cy="224" r="10" fill="#8C6440"/><circle cx="136" cy="224" r="5" fill="#6E4A2A"/></g>
    ${bracket(30,214,26,"#E2622A")}${bracket(58,208,32,"#E8702F")}${bracket(96,212,22,"#D9561F")}
    <path d="M400 202 Q330 206 296 260 H400Z" fill="#1C4A38"/>
    ${veu(346,240,52)}${taca(316,238,13,"#E0507A")}${taca(380,240,10,"#F08A3B")}${glow(326,250,6)}${glow(394,252,5)}
    <g fill="#FFE7A8">${[[340,170,1.6],[352,158,1.2],[332,150,1.4],[360,140,1],[346,128,1.3],[322,136,.9]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" opacity=".85"/>`).join("")}</g>
    <path d="M0 260 Q14 220 46 214 Q26 236 22 260Z" fill="#123B2E"/><path d="M400 260 Q392 226 366 218 Q380 240 380 260Z" fill="#123B2E"/>
    </svg>`;
  };

  window.amazonIcon=function(){
    let leaves="";
    [[-6,12,40,-35],[106,10,40,215],[-8,70,34,10],[108,66,34,170],[50,-8,30,95]].forEach(l=>{ leaves+=`<g transform="translate(${l[0]} ${l[1]}) rotate(${l[3]})"><path d="M0 0 Q${l[2]*0.5} ${-l[2]*0.28} ${l[2]} 0 Q${l[2]*0.5} ${l[2]*0.28} 0 0Z" fill="#1A5440"/><path d="M0 0 L${l[2]} 0" stroke="#0F3A2C" stroke-width="1"/></g>`; });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">
    <defs><radialGradient id="bg" cx="50%" cy="42%" r="70%"><stop offset="0" stop-color="#2F7A5C"/><stop offset=".55" stop-color="#174A3A"/><stop offset="1" stop-color="#0A2620"/></radialGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF3C8" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3C8" stop-opacity="0"/></radialGradient></defs>
    <rect width="100" height="100" fill="url(#bg)"/>${leaves}
    <circle cx="50" cy="44" r="34" fill="url(#halo)"/>
    <g fill="#FFE7A8">${[[24,22,.9],[78,26,.8],[66,14,.7],[32,40,.6],[74,44,.7],[18,48,.6]].map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" opacity=".9"/>`).join("")}</g>
    <rect x="4" y="80" width="92" height="12" rx="6" fill="#6E4A2A"/><rect x="4" y="80" width="92" height="3.5" rx="1.75" fill="#4E8A4A"/>
    <circle cx="94" cy="86" r="5.4" fill="#8C6440"/><circle cx="94" cy="86" r="2.6" fill="#6E4A2A"/>
    ${veu(50,81,62)}
    ${bracket(4,80,20,"#E2622A")}${bracket(10,72,16,"#E8702F")}${bracket(6,65,12,"#D9561F")}
    ${taca(72,81,9,"#E0507A")}${taca(84,81,7,"#F08A3B")}
    ${glow(28,81,5)}${glow(36,81,3.6)}
    </svg>`;
  };
})();
