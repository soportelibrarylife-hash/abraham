// Lightbox y filtros para la galería
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item-galeria');
  const lightbox = document.getElementById('caja-lightbox');
  const imgLightbox = document.getElementById('img-lightbox');
  const videoLightbox = document.getElementById('video-lightbox');
  const cerrar = document.querySelector('.cerrar-lightbox');
  const botonesFiltro = document.querySelectorAll('.filtros-galeria button');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const tipo = item.dataset.tipo;
      
      if (tipo === 'video') {
        const video = item.querySelector('video');
        videoLightbox.src = video.src;
        imgLightbox.style.display = 'none';
        videoLightbox.classList.add('activo');
        videoLightbox.style.display = 'block';
      } else {
        const img = item.querySelector('img');
        imgLightbox.src = img.src;
        imgLightbox.alt = img.alt;
        imgLightbox.style.display = 'block';
        videoLightbox.classList.remove('activo');
        videoLightbox.style.display = 'none';
      }
      lightbox.classList.add('activo');
    });
  });

  function cerrarLightbox() {
    lightbox.classList.remove('activo');
    imgLightbox.src = '';
    videoLightbox.src = '';
    videoLightbox.pause();
  }

  if (cerrar) cerrar.addEventListener('click', cerrarLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) cerrarLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarLightbox();
  });

  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach((b) => b.classList.remove('activo'));
      boton.classList.add('activo');
      const categoria = boton.dataset.categoria;
      items.forEach((item) => {
        const coincide = categoria === 'todas' || item.dataset.categoria === categoria;
        item.style.display = coincide ? '' : 'none';
      });
    });
  });
});
