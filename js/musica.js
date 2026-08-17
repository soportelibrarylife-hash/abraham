document.addEventListener('DOMContentLoaded', () => {
  const listaCanciones = document.querySelector('.lista-canciones');
  const canciones = Array.from(document.querySelectorAll('.cancion'));
  const botonesFiltro = document.querySelectorAll('.filtros-musica button');
  const audioFondo = document.getElementById('audio-fondo');
  const botonMusicaFondo = document.getElementById('boton-musica-fondo');

  const honeybeeAudio = document.querySelector('.cancion[data-cancion="honeybee"] audio');
  const honeybeeBoton = document.querySelector('.boton-ver-letra[data-cancion="honeybee"]');
  const honeybeeLetra = document.querySelector('.letra-cancion.honeybee-letra');
  const honeybeeLineas = Array.from(document.querySelectorAll('.honeybee-lyrics .lyric-line'));

  function actualizarLineaActiva() {
    if (!honeybeeAudio || !honeybeeLineas.length) return;

    const tiempoActual = honeybeeAudio.currentTime;
    const margen = 0.8;
    let indiceActivo = 0;

    honeybeeLineas.forEach((linea, indice) => {
      const tiempo = Number(linea.dataset.time || 0);
      const siguienteTiempo = Number(honeybeeLineas[indice + 1]?.dataset.time || Infinity);

      if (tiempoActual >= tiempo + margen && tiempoActual < siguienteTiempo - margen) {
        indiceActivo = indice;
      }
    });

    if (tiempoActual < Number(honeybeeLineas[0].dataset.time || 0) + margen) {
      indiceActivo = 0;
    }

    if (honeybeeAudio.ended) {
      indiceActivo = honeybeeLineas.length - 1;
    }

    honeybeeLineas.forEach((linea, indice) => {
      const tiempo = Number(linea.dataset.time || 0);
      const yaPaso = tiempoActual >= tiempo + margen;
      const esActiva = indice === indiceActivo;

      linea.classList.toggle('pasada', yaPaso && !esActiva);
      linea.classList.toggle('activa', esActiva);
      if (!yaPaso && !esActiva) {
        linea.classList.remove('pasada');
      }
    });
  }

  function mezclarCanciones() {
    if (!listaCanciones) return;

    const cancionesMezcladas = [...canciones].sort(() => Math.random() - 0.5);
    listaCanciones.innerHTML = '';
    cancionesMezcladas.forEach((cancion) => listaCanciones.appendChild(cancion));
  }

  function reproducirSiguiente(audioActual) {
    const cancionesVisibles = Array.from(listaCanciones.querySelectorAll('.cancion'))
      .filter((cancion) => cancion.style.display !== 'none');
    const cancionActual = audioActual.closest('.cancion');

    if (!cancionActual || cancionesVisibles.length < 2) return;

    const indiceActual = cancionesVisibles.indexOf(cancionActual);
    const siguienteCancion = cancionesVisibles[(indiceActual + 1) % cancionesVisibles.length];
    const siguienteAudio = siguienteCancion.querySelector('audio');

    if (siguienteAudio) {
      siguienteAudio.currentTime = 0;
      siguienteAudio.play().catch(() => {});
    }
  }

  function actualizarBotonLetra() {
    if (!honeybeeAudio || !honeybeeBoton || !honeybeeLetra) return;

    const reproduciendo = !honeybeeAudio.paused && !honeybeeAudio.ended;
    honeybeeBoton.hidden = !reproduciendo;

    if (!reproduciendo) {
      honeybeeLetra.hidden = true;
      honeybeeBoton.setAttribute('aria-expanded', 'false');
      honeybeeBoton.textContent = 'Ver letra';
    }
  }

  if (honeybeeAudio && honeybeeBoton && honeybeeLetra) {
    honeybeeAudio.addEventListener('play', () => {
      actualizarBotonLetra();
      actualizarLineaActiva();
    });
    honeybeeAudio.addEventListener('pause', actualizarBotonLetra);
    honeybeeAudio.addEventListener('ended', () => {
      actualizarBotonLetra();
      honeybeeLineas.forEach((linea) => {
        linea.classList.remove('activa');
        linea.classList.add('pasada');
      });
    });
    honeybeeAudio.addEventListener('timeupdate', actualizarLineaActiva);

    honeybeeBoton.addEventListener('click', () => {
      const reproduciendo = !honeybeeAudio.paused && !honeybeeAudio.ended;
      if (!reproduciendo) return;

      const mostrar = honeybeeLetra.hidden;
      honeybeeLetra.hidden = !mostrar;
      honeybeeBoton.setAttribute('aria-expanded', String(mostrar));
      honeybeeBoton.textContent = mostrar ? 'Ocultar letra' : 'Ver letra';

      if (mostrar) {
        actualizarLineaActiva();
      }
    });

    actualizarBotonLetra();
    actualizarLineaActiva();
  }

  canciones.forEach((cancion) => {
    const audio = cancion.querySelector('audio');
    if (!audio) return;

    audio.addEventListener('play', () => {
      if (audioFondo) {
        audioFondo.pause();
        localStorage.setItem('musicaFondoActiva', 'false');
        if (botonMusicaFondo) botonMusicaFondo.textContent = '🔈 Música: desactivada';
      }

      canciones.forEach((otraCancion) => {
        const otroAudio = otraCancion.querySelector('audio');
        if (otroAudio && otroAudio !== audio) {
          otroAudio.pause();
        }
      });
    });
    audio.addEventListener('ended', () => reproducirSiguiente(audio));
  });

  mezclarCanciones();

  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach((item) => item.classList.remove('activo'));
      boton.classList.add('activo');

      const categoria = boton.dataset.categoria;

      canciones.forEach((cancion) => {
        const coincide = categoria === 'todas' || cancion.dataset.categoria === categoria;
        cancion.style.display = coincide ? '' : 'none';
      });

      if (categoria === 'todas') {
        mezclarCanciones();
      } else {
        const categoriaActual = canciones.filter((cancion) => cancion.dataset.categoria === categoria);
        const resto = canciones.filter((cancion) => cancion.dataset.categoria !== categoria);
        listaCanciones.innerHTML = '';
        categoriaActual.concat(resto).forEach((cancion) => listaCanciones.appendChild(cancion));
      }
    });
  });
});
