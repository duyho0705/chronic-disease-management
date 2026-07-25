declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

let isInitialized = false;

export const initGoogleTranslate = () => {
  if (isInitialized || document.getElementById('google-translate-script')) return;
  isInitialized = true;

  // Create hidden container if not present
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  // Inject Google Translate script
  window.googleTranslateElementInit = () => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'vi',
          includedLanguages: 'en,vi,zh-CN,ja,fr',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    }
  };

  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);

  // Add CSS to hide top Google Translate banner frame
  const style = document.createElement('style');
  style.innerHTML = `
    .goog-te-banner-frame { display: none !important; }
    body { top: 0px !important; }
    .goog-te-gadget { display: none !important; }
    .goog-tooltip { display: none !important; }
    .goog-tooltip:hover { display: none !important; }
    .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
  `;
  document.head.appendChild(style);
};

export const switchLanguage = (targetLang: 'vi' | 'en') => {
  initGoogleTranslate();

  const langCode = targetLang === 'en' ? 'en' : 'vi';

  const triggerChange = () => {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      setTimeout(triggerChange, 300);
    }
  };

  triggerChange();
};
