import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  pl: {
    translation: {
      // Autoryzacja
      welcomeBack: 'Witaj z powrotem',
      createAccount: 'Stwórz konto',
      loginBtn: 'Zaloguj się',
      registerBtn: 'Zarejestruj się',
      noAccount: 'Nie masz konta? Zarejestruj się',
      haveAccount: 'Masz już konto? Zaloguj się',
      password: 'Hasło',
      error: 'Błąd',
      success: 'Sukces',
      fillAllFields: 'Wypełnij wszystkie pola',
      invalidEmail: 'Podaj poprawny adres e-mail',
      weakPasswordTitle: 'Słabe hasło',
      weakPasswordDesc: 'Hasło musi mieć min. 8 znaków, zawierać cyfrę i wielką literę',
      authError: 'Błąd autoryzacji',
      
      // Wybór Roli
      whoAreYou: 'Kim jesteś?',
      imSenior: 'Seniorem',
      imCaregiver: 'Opiekunem',
      roleSaveError: 'Nie udało się zapisać roli',
      seniorRole: 'Jestem Seniorem',
      seniorDesc: 'Chcę potwierdzać leki',
      caregiverRole: 'Jestem Opiekunem',
      caregiverDesc: 'Zarządzam lekami',
      
      // Panele
      wardsTitle: 'Twoi Podopieczni',
      addWard: 'Dodaj Podopiecznego',
      seniorWelcome: 'Witaj!',
      takeMedsBtn: 'WZIĄŁEM LEKI',
      yourPin: 'Twój kod PIN:',
      pinLabel: 'Wpisz 6-cyfrowy PIN Seniora',
      saveBtn: 'Połącz Podopiecznego',
      successAdd: 'Połączono pomyślnie!',
      clickToManageMeds: 'Kliknij, by zarządzać lekami',
      noWardsAddSome: 'Brak podopiecznych. Dodaj kogoś!',
      
      // Detale Podopiecznego (Leki)
      addNewMed: 'Dodaj nowy lek',
      medNamePlaceholder: 'Nazwa leku (np. Apap)',
      dosagePlaceholder: 'Dawka (np. 1 tabletka)',
      timePlaceholder: 'Godzina (np. 08:00)',
      assignMedBtn: 'Przypisz lek',
      fillAllMedFields: 'Wypełnij wszystkie pola leku',
      medAddedSuccess: 'Lek został przypisany!',
      medAddError: 'Nie udało się dodać leku. Sprawdź połączenie.',
    }
  },
  en: {
    translation: {
      // Auth
      welcomeBack: 'Welcome back',
      createAccount: 'Create account',
      loginBtn: 'Log in',
      registerBtn: 'Register',
      noAccount: "Don't have an account? Register",
      haveAccount: 'Already have an account? Log in',
      password: 'Password',
      error: 'Error',
      success: 'Success',
      fillAllFields: 'Fill all fields',
      invalidEmail: 'Enter a valid email address',
      weakPasswordTitle: 'Weak password',
      weakPasswordDesc: 'Min. 8 chars, 1 uppercase, 1 number',
      authError: 'Authentication failed',
      
      // Role Selection
      whoAreYou: 'Who are you?',
      imSenior: 'A Senior',
      imCaregiver: 'A Caregiver',
      roleSaveError: 'Failed to save role',
      seniorRole: 'I am a Senior',
      seniorDesc: 'I want to confirm meds',
      caregiverRole: 'I am a Caregiver',
      caregiverDesc: 'I manage medications',
      
      // Panels
      wardsTitle: 'Your Wards',
      addWard: 'Add Ward',
      seniorWelcome: 'Hello!',
      takeMedsBtn: 'I TOOK MY MEDS',
      yourPin: 'Your PIN:',
      pinLabel: 'Enter 6-digit PIN of the Senior',
      saveBtn: 'Connect',
      successAdd: 'Successfully connected!',
      clickToManageMeds: 'Click to manage meds',
      noWardsAddSome: 'No wards found. Add someone!',
      
      // Ward Details (Meds)
      addNewMed: 'Add new medication',
      medNamePlaceholder: 'Medication name (e.g. Aspirin)',
      dosagePlaceholder: 'Dosage (e.g. 1 pill)',
      timePlaceholder: 'Time (e.g. 08:00)',
      assignMedBtn: 'Assign medication',
      fillAllMedFields: 'Fill all medication fields',
      medAddedSuccess: 'Medication assigned!',
      medAddError: 'Failed to add medication. Check connection.',
    }
  }
};

const deviceLang = Localization.getLocales()[0]?.languageCode || 'en';
const defaultLanguage = deviceLang === 'pl' ? 'pl' : 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;