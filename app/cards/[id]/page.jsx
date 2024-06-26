'use client';
import NavigationHeader from "../../components/NavigationHeader";
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import "../../embla.css";
import SwiperCards from "../../components/SwiperCards";
import DOMPurify from 'dompurify';
import Footer from "../../components/Footer";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const secretKey = "1234567890abcdef";

const decryptId = (encryptedId) => {
  const base64 = encryptedId.replace(/-/g, '+').replace(/_/g, '/');
  const bytes = CryptoJS.AES.decrypt(base64, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const WineHouse = () => {
  const pathname = usePathname();
  const encryptedId = pathname.split('/')[2];
  const cardId = decryptId(encryptedId);
  const [card, setCard] = useState(null);

  const translations = {
    it: {
      inHotel: 'IN STRUTTURA',
      loading: 'Caricamento...',
    },
    en: {
      inHotel: 'IN STRUCTURE',
      loading: 'Loading...',
    },
    fr: {
      inHotel: 'EN STRUCTURE',
      loading: 'Chargement...',
    },
    de: {
      inHotel: 'IM STRUKTUR',
      loading: 'Wird geladen...',
    },
    es: {
      inHotel: 'EN ESTRUCTURA',
      loading: 'Cargando...',
    },
  };

  const lang = Cookies.get('lang') || 'en'; // Imposta 'en' come lingua di default
  const t = translations[lang];

  useEffect(() => {
    if (cardId) {
      fetch(`https://hunt4taste.it/api/cards/${cardId}?lang=${lang}`)
        .then((response) => response.json())
        .then((data) => {
          data.description = DOMPurify.sanitize(data.description); // Sanitizza la descrizione
          data.pages = data.pages.map(page => ({
            ...page,
            content: DOMPurify.sanitize(page.content) // Sanitizza il contenuto di ogni pagina
          }));
          setCard(data);
        })
        .catch((error) => console.error("Errore nella chiamata API:", error));
    }
  }, [cardId, lang]);

  if (!card) {
    return <div className="flex justify-center items-center h-screen">{t.loading}</div>;
  }

  return (
    <div className="bg-white text-gray-800 font-sans min-h-screen flex flex-col">
      <NavigationHeader />

      <div className="container mx-auto my-8 p-4 lg:p-8 max-w-screen-xl">
        <div className="rounded-lg overflow-hidden shadow-lg">
          {card && (
            <div className="relative w-full h-64 md:h-96 lg:h-[40rem]">
              <img
                src={card.image_url}
                alt={card.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 lg:py-8 max-w-screen-xl">
        <h3 className="text-3xl lg:text-4xl text-blue-800 font-semibold mb-6">{card.title}</h3>
        <p className="text-gray-600 text-lg lg:text-xl mb-4" dangerouslySetInnerHTML={{ __html: card.description }}></p>

        {card.pages.map(page => (
          <div key={page.id} className="mb-8">
            <h4 className="text-2xl lg:text-3xl text-blue-700 font-semibold mb-3">{page.title}</h4>
            <p className="text-gray-600 text-lg lg:text-xl" dangerouslySetInnerHTML={{ __html: page.content }}></p>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-6 py-4 lg:py-8 max-w-screen-xl">
        <h3 className="text-2xl lg:text-3xl text-gray-700 mb-4">{t.inHotel}</h3>
        <SwiperCards />
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default WineHouse;
