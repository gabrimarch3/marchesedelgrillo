'use client'
import React, { useEffect } from "react";
import Cookies from 'js-cookie';
import Header from "./components/Header";
import Services from "./components/Services";
import SwiperCards from "./components/SwiperCards";
import SubscriptionForm from "./components/SubscriptionForm";
import QRCodeComponent from './components/QRCodeComponent';
import Footer from "./components/Footer";

export default function Home() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const encodedUserId = queryParams.get('user_id');

    const renewCookie = (cookieName, value) => {
      // Imposta o rinnova il cookie con una scadenza di 7 giorni
      Cookies.set(cookieName, value, { expires: 7 });
      // Salva il valore del cookie in localStorage
      localStorage.setItem(cookieName, value);
    };

    if (encodedUserId) {
      try {
        const decodedUserId = decodeURIComponent(window.atob(encodedUserId).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const savedUserId = Cookies.get('user_id');
        renewCookie('user_id', decodedUserId);

        if (savedUserId !== decodedUserId) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error decoding user ID:', error);
      }
    } else {
      const savedUserId = Cookies.get('user_id');
      if (savedUserId) {
        renewCookie('user_id', savedUserId);
      } else {
        // Ripristina il valore del cookie da localStorage se il cookie è assente
        const localStorageUserId = localStorage.getItem('user_id');
        if (localStorageUserId) {
          renewCookie('user_id', localStorageUserId);
        }
      }
    }

    // Imposta o rinnova il cookie della lingua in italiano se non è già presente
    const savedLang = Cookies.get('lang');
    if (!savedLang) {
      const localStorageLang = localStorage.getItem('lang') || 'it';
      renewCookie('lang', localStorageLang);
      if (!savedLang) {
        window.location.reload(); // Ricarica la pagina se il cookie 'lang' è stato aggiunto
      }
    } else {
      renewCookie('lang', savedLang);
    }
  }, []);

  const userId = Cookies.get('user_id');
  const lang = Cookies.get('lang') || 'it'; // Default to 'it' if no cookie is present

  const translations = {
    it: {
      inStructure: "IN STRUTTURA",
      services: "SERVIZI",
    },
    en: {
      inStructure: "IN STRUCTURE",
      services: "SERVICES",
    },
    fr: {
      inStructure: "DANS LA STRUCTURE",
      services: "SERVICES",
    },
    de: {
      inStructure: "IN DER STRUKTUR",
      services: "DIENSTLEISTUNGEN",
    },
    es: {
      inStructure: "EN ESTRUCTURA",
      services: "SERVICIOS",
    },
  };

  const t = translations[lang];

  return (
    <>
      <Header />
      <div className="pt-10 bg-transparent">
        <h3 className="ml-3 pl-3 pb-3 font-bold text-[#7B7C7C]">{t.inStructure}</h3>
        <div className="pl-3 overflow-hidden max-w-full">
          <SwiperCards userId={userId} />
        </div>
      </div>
      <div className="pt-10 bg-transparent">
        <h3 className="ml-3 pl-3 pb-3 font-bold text-[#7B7C7C]">{t.services}</h3>
        <div className="pl-3 overflow-hidden max-w-full">
          <Services userId={userId} />
        </div>
      </div>
      <SubscriptionForm userId={userId} />
      <QRCodeComponent userId={userId} />
      <Footer />
    </>
  );
}
