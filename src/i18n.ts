import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          welcome: "Authentic Benne Taste in Surat",
          explore: "Explore Menu",
          order: "Order Now",
        }
      },
      gu: {
        translation: {
          welcome: "સુરતમાં અસલી બેને સ્વાદ",
          explore: "મેનુ જુઓ",
          order: "ઓર્ડર કરો",
        }
      },
      hi: {
        translation: {
          welcome: "સુરત માં અસલી બેને સ્વાદ",
          explore: "मेन्यू देखें",
          order: "ऑर्डर करें",
        }
      }
    }
  });

export default i18n;
