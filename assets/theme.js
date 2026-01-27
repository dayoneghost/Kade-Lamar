
document.addEventListener('DOMContentLoaded', () => {
  // Page Transitions
  if (typeof anime !== 'undefined') {
    anime({
      targets: 'main',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutQuart'
    });
  }

  // Header Scroll Effect
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('bg-opacity-95', 'backdrop-blur-xl', 'py-3', 'shadow-2xl');
      header.classList.remove('py-5');
    } else {
      header.classList.remove('bg-opacity-95', 'backdrop-blur-xl', 'py-3', 'shadow-2xl');
      header.classList.add('py-5');
    }
  });

  // Account Dropdown Toggle (Desktop)
  const accountToggle = document.getElementById('account-toggle');
  const accountMenu = document.getElementById('account-menu');
  const accountChevron = document.getElementById('account-chevron');

  if (accountToggle && accountMenu) {
    accountToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = accountMenu.classList.contains('opacity-100');
      
      if (isOpen) {
        accountMenu.classList.add('opacity-0', 'scale-y-0', 'pointer-events-none');
        accountMenu.classList.remove('opacity-100', 'scale-y-100');
        if (accountChevron) accountChevron.style.transform = 'rotate(0deg)';
      } else {
        accountMenu.classList.remove('opacity-0', 'scale-y-0', 'pointer-events-none');
        accountMenu.classList.add('opacity-100', 'scale-y-100');
        if (accountChevron) accountChevron.style.transform = 'rotate(180deg)';
      }
    });

    document.addEventListener('click', () => {
      accountMenu.classList.add('opacity-0', 'scale-y-0', 'pointer-events-none');
      accountMenu.classList.remove('opacity-100', 'scale-y-100');
      if (accountChevron) accountChevron.style.transform = 'rotate(0deg)';
    });
  }

  // Mobile Menu Drawer Logic
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');
  const mobileContent = document.getElementById('mobile-menu-content');
  const mobileBackdrop = document.getElementById('mobile-menu-backdrop');

  const openMobileMenu = () => {
    mobileDrawer.classList.remove('opacity-0', 'pointer-events-none');
    mobileDrawer.classList.add('opacity-100');
    mobileContent.style.transform = 'translateX(0)';
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileContent.style.transform = 'translateX(100%)';
    setTimeout(() => {
      mobileDrawer.classList.add('opacity-0', 'pointer-events-none');
      mobileDrawer.classList.remove('opacity-100');
      document.body.style.overflow = 'auto';
    }, 500);
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  // Form Interactions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        btn.disabled = true;
      }
    });
  });
});
