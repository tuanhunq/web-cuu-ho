document.getElementById('menu-toggle').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    
    const isHidden = menu.classList.contains('hidden');
    this.innerHTML = isHidden ? feather.icons.menu.toSvg() : feather.icons.x.toSvg();
    feather.replace();
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#login') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                document.getElementById('menu-toggle').innerHTML = feather.icons.menu.toSvg();
                feather.replace();
            }
        }
    });
});

feather.replace();