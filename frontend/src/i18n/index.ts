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
      medsTakenInfo: 'Next dose: Evening',
      changeLang: 'Zmień na Polski',
      wardNameLabel: "Senior's Name",
      medNameLabel: "Medication Name",
      medDosageLabel: "Dosage (e.g., 1 pill)",
      saveBtn: "Save Profile",
      successAdd: "Successfully added!",
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
      medsTakenInfo: 'Następna dawka: Wieczór',
      changeLang: 'Change to English',
      wardNameLabel: "Imię Podopiecznego",
      medNameLabel: "Nazwa Leku",
      medDosageLabel: "Dawka (np. 1 tabletka)",
      saveBtn: "Zapisz Profil",
      successAdd: "Pomyślnie dodano!",
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