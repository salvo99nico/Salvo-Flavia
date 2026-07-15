const weddingDate = new Date('2027-06-19T15:30:00+02:00');
const countdownIds = ['days', 'hours', 'minutes', 'seconds'];

function updateCountdown(){
  const now = new Date();
  const diff = Math.max(0, weddingDate - now);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const values = [days, hours, minutes, seconds];

  countdownIds.forEach((id, index) => {
    const element = document.getElementById(id);
    if(element){
      element.textContent = String(values[index]).padStart(index === 0 ? 1 : 2, '0');
    }
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.getElementById('openInvite')?.addEventListener('click', () => {
  document.getElementById('cerimonia')?.scrollIntoView({ behavior:'smooth' });
  startMusic();
});

let audioCtx;
let masterGain;
let musicTimer;
let isPlaying = false;
const musicToggle = document.getElementById('musicToggle');

function setupAudio(){
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  masterGain = masterGain || audioCtx.createGain();

  if(!masterGain.connectedToDestination){
    masterGain.connect(audioCtx.destination);
    masterGain.connectedToDestination = true;
  }

  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.setValueAtTime(0.45, audioCtx.currentTime);
}

function note(freq, start, duration, gain = 0.045){
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.value = freq;

  g.gain.setValueAtTime(0.0001, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(g);
  g.connect(masterGain);
  osc.start(start);
  osc.stop(start + duration + 0.1);
}

function playPattern(){
  if(!isPlaying || !audioCtx){
    return;
  }

  const t = audioCtx.currentTime + 0.05;
  const chords = [
    [392, 493.88, 659.25],
    [349.23, 440, 587.33],
    [329.63, 392, 523.25],
    [293.66, 369.99, 493.88]
  ];

  chords.forEach((chord, chordIndex) => {
    chord.forEach((frequency, noteIndex) => {
      note(frequency, t + chordIndex * 1.7 + noteIndex * 0.08, 1.8, 0.036);
    });
  });

  musicTimer = window.setTimeout(playPattern, 6800);
}

function startMusic(){
  if(isPlaying){
    return;
  }

  setupAudio();
  isPlaying = true;
  musicToggle?.classList.add('playing');
  playPattern();
  showToast('Musica di sottofondo attivata');
}

function stopMusic(){
  if(!isPlaying){
    return;
  }

  isPlaying = false;
  window.clearTimeout(musicTimer);

  if(masterGain && audioCtx){
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value || 0.45, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
  }

  musicToggle?.classList.remove('playing');
  showToast('Musica disattivata');
}

musicToggle?.addEventListener('click', () => {
  if(isPlaying){
    stopMusic();
  }else{
    startMusic();
  }
});

const form = document.getElementById('rsvpForm');
let lastMessage = '';

function buildMessage(){
  const data = new FormData(form);
  const nome = data.get('nome') || '';
  const presenza = data.get('presenza') || '';
  const menu = data.get('menu') || 'Non indicato';
  const allergie = data.get('allergie') || 'Nessuna indicazione';
  const note = data.get('note') || 'Nessuna nota';

  return `Ciao Flavia e Salvatore!\n\nConferma presenza matrimonio 19/06/2027\nNome: ${nome}\nPresenza: ${presenza}\nMenu: ${menu}\nAllergie/intolleranze: ${allergie}\nAltre informazioni: ${note}`;
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  if(!form.reportValidity()){
    return;
  }

  lastMessage = buildMessage();
  const url = `https://wa.me/?text=${encodeURIComponent(lastMessage)}`;
  window.open(url, '_blank', 'noopener');
  showToast('Messaggio WhatsApp pronto per essere inviato');
});

document.getElementById('copyResponse')?.addEventListener('click', async () => {
  lastMessage = buildMessage();

  try{
    await navigator.clipboard.writeText(lastMessage);
    showToast('Risposta copiata negli appunti');
  }catch{
    showToast('Copia non riuscita: seleziona e copia manualmente');
  }
});

function showToast(message){
  const toast = document.getElementById('toast');
  if(!toast){
    return;
  }

  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}
