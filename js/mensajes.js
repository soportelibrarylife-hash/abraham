// Animación de aparición al hacer scroll para las tarjetas de mensajes
document.addEventListener('DOMContentLoaded', () => {
  const tarjetas = document.querySelectorAll('.tarjeta-mensaje');
  if (!tarjetas.length) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  tarjetas.forEach((tarjeta, i) => {
    tarjeta.style.transitionDelay = `${i * 0.08}s`;
    observador.observe(tarjeta);
  });
});
