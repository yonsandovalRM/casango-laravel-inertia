import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { auth } from './auth';
import { bookings } from './bookings';
import { categories } from './categories';
import { company } from './company';
import { plans } from './plans';
import { professionals } from './professionals';
import { profile } from './profile';
import { services } from './services';
import { ui } from './ui';
import { users } from './users';
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: {
        translation: {
            ...auth.en,
            ...ui.en,
            ...profile.en,
            ...plans.en,
            ...company.en,
            ...users.en,
            ...services.en,
            ...categories.en,
            ...professionals.en,
            ...bookings.en,
        },
    },
    es: {
        translation: {
            ...auth.es,
            ...ui.es,
            ...profile.es,
            ...plans.es,
            ...company.es,
            ...users.es,
            ...services.es,
            ...categories.es,
            ...professionals.es,
            ...bookings.es,
        },
    },
};
i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'es', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
