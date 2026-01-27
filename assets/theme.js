
document.addEventListener('DOMContentLoaded', () => {
  // Page Transitions
  anime({
    targets: 'main',
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 800,
    easing: 'easeOutQuart'
  });

  // Header Scroll Effect
  const header = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('bg-opacity-95', 'backdrop-blur-xl', 'py-3');
      header.classList.remove('py-5');
    } else {
      header.classList.remove('bg-opacity-95', 'backdrop-blur-xl', 'py-3');
      header.classList.add('py-5');
    }
  });

  // Form Interactions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
      }
    });
  });
});
