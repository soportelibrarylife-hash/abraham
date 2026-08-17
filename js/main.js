// ===== Configuración general =====
const FECHA_INICIO = new Date('2026-07-25T00:00:00');

// ===== Menú móvil =====
function iniciarMenu() {
  const boton = document.querySelector('.boton-menu');
  const links = document.querySelector('.nav-links');
  if (!boton || !links) return;
  boton.addEventListener('click', () => links.classList.toggle('abierto'));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('abierto')));
}

// ===== Marcar enlace activo =====
function marcarActivo() {
  const pagina = location.pathname.split('/').pop() || 'mensajes.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    if (a.getAttribute('href') === pagina) a.classList.add('activo');
  });
}

// ===== Fondo de estrellas animadas =====
function iniciarEstrellas() {
  const canvas = document.getElementById('fondo-estrellas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let ancho, alto, estrellas;

  function ajustarTamano() {
    ancho = canvas.width = window.innerWidth;
    alto = canvas.height = window.innerHeight;
  }

  function crearEstrellas() {
    const cantidad = Math.floor((ancho * alto) / 9000);
    estrellas = Array.from({ length: cantidad }, () => ({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      r: Math.random() * 1.4 + 0.3,
      fase: Math.random() * Math.PI * 2,
      velocidad: Math.random() * 0.02 + 0.005,
    }));
  }

  function dibujar(t) {
    ctx.clearRect(0, 0, ancho, alto);
    for (const e of estrellas) {
      const brillo = 0.5 + 0.5 * Math.sin(t * e.velocidad + e.fase);
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 245, ${0.25 + brillo * 0.6})`;
      ctx.fill();
    }
    requestAnimationFrame(dibujar);
  }

  ajustarTamano();
  crearEstrellas();
  window.addEventListener('resize', () => {
    ajustarTamano();
    crearEstrellas();
  });
  requestAnimationFrame(dibujar);
}

// ===== Corazones cayendo =====
function iniciarCorazones() {
  const contenedor = document.getElementById('contenedor-corazones');
  if (!contenedor) return;
  const simbolos = ['💗', '💖', '💕', '❤️', '💞'];

  function crearCorazon() {
    const corazon = document.createElement('span');
    corazon.className = 'corazon-caido';
    corazon.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    corazon.style.left = Math.random() * 100 + 'vw';
    const duracion = Math.random() * 5 + 6;
    corazon.style.animationDuration = duracion + 's';
    corazon.style.fontSize = Math.random() * 1.2 + 0.9 + 'rem';
    contenedor.appendChild(corazon);
    setTimeout(() => corazon.remove(), duracion * 1000);
  }

  setInterval(crearCorazon, 900);
  for (let i = 0; i < 6; i++) setTimeout(crearCorazon, i * 300);
}

// ===== Contador de días juntos =====
function iniciarContador() {
  const cajaDias = document.getElementById('num-dias');
  if (!cajaDias) return;
  const ahora = new Date();
  const diffMs = ahora - FECHA_INICIO;
  const dias = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const meses = Math.floor(dias / 30);
  const semanas = Math.floor(dias / 7);
  cajaDias.textContent = dias;
  const numMeses = document.getElementById('num-meses');
  const numSemanas = document.getElementById('num-semanas');
  if (numMeses) numMeses.textContent = meses;
  if (numSemanas) numSemanas.textContent = semanas;
}

// ===== Música de fondo persistente entre páginas =====
function iniciarMusicaFondo() {
  const boton = document.getElementById('boton-musica-fondo');
  const audioFondo = document.getElementById('audio-fondo');
  if (!boton || !audioFondo) return;

  const activa = localStorage.getItem('musicaFondoActiva') === 'true';
  const fuenteGuardada = localStorage.getItem('musicaFondoFuente');
  const tiempoGuardado = Number(localStorage.getItem('musicaFondoTiempo') || 0);
  const audioVisible = Array.from(document.querySelectorAll('.lista-canciones audio'))
    .find((elemento) => elemento.querySelector('source')?.getAttribute('src') === fuenteGuardada);
  let audio = audioVisible || audioFondo;

  if (fuenteGuardada && !audioVisible) {
    audioFondo.src = fuenteGuardada;
  }

  function guardarTiempo() {
    if (Number.isFinite(audio.currentTime)) {
      localStorage.setItem('musicaFondoTiempo', String(audio.currentTime));
    }
  }

  audio.addEventListener('loadedmetadata', () => {
    if (tiempoGuardado > 0 && tiempoGuardado < audio.duration) {
      audio.currentTime = tiempoGuardado;
    }
  }, { once: true });
  audio.addEventListener('timeupdate', guardarTiempo);
  audio.addEventListener('pause', guardarTiempo);
  window.addEventListener('beforeunload', guardarTiempo);
  audio.addEventListener('play', () => {
    document.querySelectorAll('.cancion audio').forEach((otraCancion) => {
      if (otraCancion !== audio) otraCancion.pause();
    });
  });
  document.querySelectorAll('.cancion audio').forEach((audioLista) => {
    audioLista.addEventListener('play', () => { audio = audioLista; });
  });

  actualizarBoton(activa);
  if (activa && !audioVisible) {
    audio.play().catch(() => { });
  }

  boton.addEventListener('click', () => {
    const estaSonando = !audio.paused;
    if (estaSonando) {
      audio.pause();
      localStorage.setItem('musicaFondoActiva', 'false');
      actualizarBoton(false);
    } else {
      audio.play().catch(() => { });
      localStorage.setItem('musicaFondoActiva', 'true');
      actualizarBoton(true);
    }
  });

  function actualizarBoton(sonando) {
    boton.textContent = sonando ? '🔊 Música: activada' : '🔈 Música: desactivada';
  }
}

// ===== Formulario de EmailJS =====
function iniciarFormularioEmail() {
  const form = document.getElementById('form-mensaje');
  const estado = document.getElementById('estado-formulario');
  if (!form || !estado) return;

  const serviceId = 'service_fh71xgg';
  const templateId = 'template_c0m1qqt';

  if (typeof emailjs === 'undefined') {
    estado.textContent = 'No se pudo cargar el servicio de correo.';
    estado.classList.add('error');
    return;
  }

  emailjs.init({ publicKey: 'DNNrmjAo5q0rdk-ev' });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const boton = form.querySelector('.boton-enviar');
    const mensaje = form.elements.message.value.trim();

    if (!mensaje) {
      estado.textContent = 'Escribe algo antes de enviar.';
      estado.classList.add('error');
      return;
    }

    boton.disabled = true;
    boton.textContent = 'Enviando...';
    estado.textContent = '';
    estado.classList.remove('error');

    emailjs.send(serviceId, templateId, {
      message: mensaje,
      to_email: 'jorgeoviedo699@gmail.com',
      from_name: 'Visitante de la página',
      subject: 'Nuevo mensaje desde la página'
    })
      .then(() => {
        estado.textContent = '¡Mensaje enviado! Gracias por escribirme.';
        form.reset();
      })
      .catch((error) => {
        console.error('Error de EmailJS:', error);
        estado.textContent = `Error al enviar (${error?.status || 'sin código'}): ${error?.text || error?.message || 'revisa la configuración de EmailJS.'}`;
        estado.classList.add('error');
      })
      .finally(() => {
        boton.disabled = false;
        boton.textContent = 'Enviar';
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarMenu();
  marcarActivo();
  iniciarEstrellas();
  iniciarCorazones();
  iniciarContador();
  iniciarMusicaFondo();
  iniciarFormularioEmail();
});
