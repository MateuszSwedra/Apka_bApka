import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      roleSelection: 'Choose your role',
      seniorRole: 'I am a Senior',
      seniorDesc: 'I want to confirm meds',
      caregiverRole: 'I am a Caregiver',
      caregiverDesc: 'I manage medications',
      wardsTitle: 'Your Wards',
      addWard: 'Add Ward',
      seniorWelcome: 'Hello!',
      takeMedsBtn: 'I TOOK MY MEDS',
      changeLang: 'Zmień na Polski',
      pinLabel: 'Enter 6-digit PIN of the Senior',
      saveBtn: 'Connect',
      successAdd: 'Successfully connected!',
      yourPin: 'Your PIN:',
    },
  },
  pl: {
    translation: {
      roleSelection: 'Wybierz swoją rolę',
      seniorRole: 'Jestem Seniorem',
      seniorDesc: 'Chcę potwierdzać leki',
      caregiverRole: 'Jestem Opiekunem',
      caregiverDesc: 'Zarządzam lekami',
      wardsTitle: 'Twoi Podopieczni',
      addWard: 'Dodaj Podopiecznego',
      seniorWelcome: 'Witaj!',
      takeMedsBtn: 'WZIĄŁEM LEKI',
      changeLang: 'Change to English',
      pinLabel: 'Wpisz 6-cyfrowy PIN Seniora',
      saveBtn: 'Połącz Podopiecznego',
      successAdd: 'Połączono pomyślnie!',
      yourPin: 'Twój kod PIN:',
    },
  },
};



i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;