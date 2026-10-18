const T=[
`Em "Triste Fim de Policarpo Quaresma", de Lima Barreto, o protagonista dedica a vida a projetos para o desenvolvimento do Brasil, mas vê suas propostas serem ignoradas pelo governo e ridicularizadas pela sociedade. Essa trajetória revela um país em que os desafios nacionais esbarram tanto na indiferença do poder público quanto no desinteresse coletivo. Tal realidade persiste no que diz respeito a [FRASE TEMÁTICA COMPLETA], problemática que [VERBO + IMPACTO NEGATIVO DO TEMA - ex: compromete o futuro de milhares de jovens], mas que, assim como os projetos de Policarpo, segue à margem das prioridades nacionais. Nesse contexto, esse quadro decorre do descaso governamental e da negligência social.`,
`Diante desse panorama, é relevante destacar a insuficiência da ação estatal. Sob esse viés, o economista Anthony Downs, em "Uma Teoria Econômica da Democracia", afirma que os governantes orientam suas decisões pela busca de votos e pela manutenção do poder, relegando o bem comum a segundo plano. No caso de [PROBLEMA CENTRAL DO TEMA], essa lógica é evidente: medidas como [MEDIDA PRÁTICA QUE O GOVERNO DEVERIA TOMAR - ex: a criação de... / a ampliação de...] exigem investimentos contínuos e produzem resultados pouco visíveis a curto prazo, razão pela qual rendem poucos votos e são constantemente adiadas. Prova disso é [EXEMPLO REAL DA FALHA DO GOVERNO NO TEMA - ex: a escassez de recursos / a falta de fiscalização em...]. Por conseguinte, [FRASE COMPLETA DA CONSEQUÊNCIA - ex: a população afetada permanece desamparada], o que confirma a tese de Downs: quando a lógica eleitoral prevalece, o bem comum é negligenciado.`,
`Ademais, a omissão social diante de [SINÔNIMO 1 DO PROBLEMA] contribui de forma decisiva para sua persistência. Nesse sentido, o sociólogo Stanley Cohen, ao formular o conceito de "negação implicatória", explica que muitas pessoas reconhecem a existência de um problema, mas negam suas implicações morais, convencendo-se de que ele não lhes diz respeito ou de que nada podem fazer. É exatamente esse mecanismo que se observa em relação a [SINÔNIMO 2 DO PROBLEMA]: a sociedade não ignora [EXEMPLO DO PROBLEMA], mas minimiza como algo natural, atitude reforçada por [CRENÇA OU DESCULPA QUE NORMALIZA O PROBLEMA - ex: visões preconceituosas / a ideia equivocada de que...]. Consequentemente, o tema perde espaço nas conversas familiares, nas escolas e nas redes sociais, o que converte [PROBLEMA] em uma rotina socialmente aceita e transmitida de geração em geração.`,
`Diante do exposto, [PROPOSTA DE INTERVENÇÃO]. Assim, será possível evitar que o combate à (ou ao) [SINÔNIMO DO PROBLEMA] tenha o mesmo triste fim dos projetos de Policarpo Quaresma.`
];
const L=/[\p{L}\p{N}]/u,toks=[];
T.forEach((t,pi)=>t.split(/(\[[^\]]*\])/).filter(Boolean).forEach(s=>{
  if(s[0]==='['){const b=s.slice(1,-1).split(/ - ex:/);toks.push({free:1,label:b[0].trim(),hint:(b[1]||'').trim(),p:pi})}
  else s.split(/\s+/).forEach(w=>{if(w&&L.test(w))toks.push({w,ans:w.replace(/["“”'‘’()]/g,''),p:pi})})}));
const $=id=>document.getElementById(id);
let pos=0,free={},best=0;
try{best=JSON.parse(localStorage.getItem('decore2')||'{}').best||0}catch(e){}
const norm=s=>{s=s.replace(/["“”'‘’()\s]/g,'');return $('acc').checked?s.normalize('NFD').replace(/\p{M}/gu,''):s};
function render(){
  const box=$('txt');$('hold').append($('w'),$('fp'));box.innerHTML='';const para=document.createElement('p');box.append(para);
  for(let i=0;i<pos;i++){const t=toks[i];
    
    if(t.free){const c=document.createElement('span');c.className='chip';c.textContent=free[i];para.append(c,' ')}
    else para.append(t.w+' ')}
  if(toks[pos])para.append(toks[pos].free?$('fp'):$('w'));
  $('cnt').textContent=pos+' / '+toks.length;
  $('rec').textContent='Recorde: '+best;
}
function step(){
  const t=toks[pos],w=$('w');
  if(!t){w.disabled=true;$('fp').hidden=true;$('win').textContent='🏆 Parabéns! Você escreveu o modelo inteiro de memória!';return}
  $('win').textContent='';
  if(t.free){$('fp').hidden=false;$('fl').textContent=t.label;$('fh').textContent=t.hint?'Exemplo: '+t.hint:'';$('fm').textContent='';w.disabled=true;$('fi').focus();$('fi').scrollIntoView({block:'center'})}
  else{$('fp').hidden=true;w.disabled=false;w.focus();w.scrollIntoView({block:'center'})}
}
function fail(v,t){
  const prev=[];for(let i=Math.max(0,pos-8);i<pos;i++)prev.push(toks[i].free?'['+free[i]+']':toks[i].w);
  const e=$('err');e.innerHTML='';
  const h=document.createElement('h3');h.textContent='❌ Errou! Tudo foi zerado.';
  const a=document.createElement('div'),b=document.createElement('div'),c=document.createElement('div');
  const s1=document.createElement('span');s1.className='w';s1.textContent=v;
  const s2=document.createElement('span');s2.className='w';s2.textContent=t.w;
  a.append('Você escreveu: ',s1);b.append('Deveria ser: ',s2);
  c.className='hint';c.textContent=prev.length?'Trecho anterior: … '+prev.join(' ')+' ___':'Era a primeira palavra do texto.';
  e.append(h,a,b,c);e.hidden=false;
  pos=0;free={};render();step();
}
function submit(raw){
  const v=raw.trim();if(!v||!L.test(v))return;
  const t=toks[pos];
  if(norm(v)===norm(t.ans)){$('err').hidden=true;pos++;if(pos>best){best=pos;try{localStorage.setItem('decore2',JSON.stringify({best}))}catch(e){}}render();step()}
  else fail(v,t);
}
$('w').addEventListener('input',e=>{const v=e.target.value;if(/\s/.test(v)){e.target.value='';const p=v.split(/\s+/).filter(Boolean);if(p.length)submit(p[0])}});
$('w').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const v=e.target.value;e.target.value='';submit(v)}});
$('w').addEventListener('paste',e=>e.preventDefault());
function okFree(){
  const v=$('fi').value.trim();
  if(v.length<2){$('fm').textContent='Escreva algo antes de apertar OK.';return}
  free[pos]=v;$('fi').value='';pos++;render();step();
}
$('ok').onclick=okFree;
$('fi').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();okFree()}});
$('rs').onclick=()=>{pos=0;free={};$('err').hidden=true;$('w').value='';render();step()};
$('vw').onclick=()=>{const f=$('full');if(!f.hidden){f.hidden=true;$('vw').textContent='👁 Ver texto completo';return}
  f.innerHTML='';T.forEach(t=>{const p=document.createElement('p');t.split(/(\[[^\]]*\])/).filter(Boolean).forEach(s=>{
    if(s[0]==='['){const c=document.createElement('span');c.className='chip';c.textContent='['+s.slice(1,-1).split(/ - ex:/)[0].trim()+']';p.append(c)}else p.append(s)});f.append(p)});
  f.hidden=false;$('vw').textContent='🙈 Esconder texto';f.scrollIntoView({block:'nearest'})};
render();step();
