// Juego de memoria con emojis temáticos
const SIMBOLOS = ['💖', '🎵', '⭐', '🌙', '💌', '🎁', '😻', '🥂'];

let cartasVolteadas = [];
let paresEncontrados = 0;
let intentos = 0;
let bloqueado = false;

function mezclar(arreglo) {
  const copia = [...arreglo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function crearTablero() {
  const tablero = document.getElementById('tablero-juego');
  if (!tablero) return;
  tablero.innerHTML = '';
  cartasVolteadas = [];
  paresEncontrados = 0;
  intentos = 0;
  bloqueado = false;
  actualizarEstado();
  document.getElementById('mensaje-victoria').textContent = '';

  const simbolosDuplicados = mezclar([...SIMBOLOS, ...SIMBOLOS]);

  simbolosDuplicados.forEach((simbolo) => {
    const carta = document.createElement('div');
    carta.className = 'carta-juego';
    carta.dataset.simbolo = simbolo;
    carta.innerHTML = `
      <div class="interior">
        <div class="cara frente">💗</div>
        <div class="cara reverso">${simbolo}</div>
      </div>`;
    carta.addEventListener('click', () => voltearCarta(carta));
    tablero.appendChild(carta);
  });
}

function voltearCarta(carta) {
  if (bloqueado) return;
  if (carta.classList.contains('volteada') || carta.classList.contains('encontrada')) return;
  if (cartasVolteadas.length === 2) return;

  carta.classList.add('volteada');
  cartasVolteadas.push(carta);

  if (cartasVolteadas.length === 2) {
    intentos++;
    actualizarEstado();
    comprobarPar();
  }
}

function comprobarPar() {
  const [a, b] = cartasVolteadas;
  if (a.dataset.simbolo === b.dataset.simbolo) {
    a.classList.add('encontrada');
    b.classList.add('encontrada');
    cartasVolteadas = [];
    paresEncontrados++;
    actualizarEstado();
    if (paresEncontrados === SIMBOLOS.length) {
      document.getElementById('mensaje-victoria').textContent =
        '¡Ganaste!💞';
    }
  } else {
    bloqueado = true;
    setTimeout(() => {
      a.classList.remove('volteada');
      b.classList.remove('volteada');
      cartasVolteadas = [];
      bloqueado = false;
    }, 800);
  }
}

function actualizarEstado() {
  const elIntentos = document.getElementById('num-intentos');
  const elPares = document.getElementById('num-pares');
  if (elIntentos) elIntentos.textContent = intentos;
  if (elPares) elPares.textContent = `${paresEncontrados} / ${SIMBOLOS.length}`;
}

document.addEventListener('DOMContentLoaded', () => {
  crearTablero();
  const btnReiniciar = document.getElementById('boton-reiniciar');
  if (btnReiniciar) btnReiniciar.addEventListener('click', crearTablero);
});
