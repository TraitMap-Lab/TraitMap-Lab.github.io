(function() {
  const LANG_KEY = 'traitmapLang';

  function readSavedLanguage() {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (error) {}
  }

  function readUrlLanguage() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    return lang === 'en' || lang === 'zh' ? lang : null;
  }

  function updateInternalLinks(lang) {
    document.querySelectorAll('a[href]').forEach(function(link) {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
      if (!href.includes('.html')) return;

      const url = new URL(href, window.location.href);
      if (lang === 'en') {
        url.searchParams.set('lang', 'en');
      } else {
        url.searchParams.delete('lang');
      }

      const fileName = url.pathname.split('/').pop();
      link.setAttribute('href', fileName + url.search + url.hash);
    });
  }

  function applyLanguage(lang) {
    const nextLang = lang === 'en' ? 'en' : 'zh';
    const html = document.documentElement;
    const btn = document.getElementById('langBtn');

    html.setAttribute('data-lang', nextLang);
    html.setAttribute('lang', nextLang === 'en' ? 'en' : 'zh-TW');
    if (btn) btn.textContent = nextLang === 'en' ? '中文' : 'English';
    updateInternalLinks(nextLang);
  }

  window.toggleLang = function() {
    const nextLang = document.documentElement.getAttribute('data-lang') === 'zh' ? 'en' : 'zh';
    applyLanguage(nextLang);
    saveLanguage(nextLang);
  };

  const initialLanguage = readUrlLanguage() || readSavedLanguage() || document.documentElement.getAttribute('data-lang');
  if (readUrlLanguage()) saveLanguage(initialLanguage);
  applyLanguage(initialLanguage);

  document.addEventListener('DOMContentLoaded', function() {
    applyLanguage(readUrlLanguage() || readSavedLanguage() || document.documentElement.getAttribute('data-lang'));
    document.querySelectorAll('#navLinks a').forEach(function(link) {
      link.addEventListener('click', function() {
        const nav = document.getElementById('navLinks');
        if (nav) nav.classList.remove('open');
      });
    });
  });
})();
