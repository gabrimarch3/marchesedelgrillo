'use client'
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Scrollbar } from 'swiper';
import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";
import Image from "next/image";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Inizializza i moduli Swiper necessari
SwiperCore.use([Pagination, Scrollbar]);

const secretKey = "1234567890abcdef";

const encryptId = (id) => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export default function SwiperCards({ isLoading }) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      const queryParams = new URLSearchParams(window.location.search);
      let userId = parseInt(queryParams.get('user_id'));

      // If not found in the URL, try to get it from cookies
      if (!userId) {
        userId = parseInt(Cookies.get('user_id'));
      }

      if (!userId) {
        console.error('User ID not found in URL or cookies');
        return;
      }

      const lang = Cookies.get('lang') || 'en'; // Recupera la lingua dai cookie, predefinita a 'en'

      // Fetch all cards from the API
      fetch(`https://hunt4taste.it/api/cards?user_id=${userId}&lang=${lang}`)
        .then(response => response.json())
        .then(data => {
          // Filter the cards based on the user_id
          const filteredCards = data.filter(card => card.user_id === userId);
          setCards(filteredCards);
        })
        .catch(error => console.error("Error fetching cards from API:", error));
    }
  }, [isLoading]); // The dependency on isLoading triggers this effect only when isLoading changes

  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      pagination={{ clickable: true }}
      breakpoints={{
        320: {
          slidesPerView: 1.3,
          spaceBetween: 10,
        },
        550: {
          slidesPerView: 2.1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2.8,
          spaceBetween: 30,
        },
      }}
    >
      {isLoading || cards.length === 0 ? (
        Array.from({ length: 7 }).map((_, index) => (
          <SwiperSlide key={index} className="flex flex-col items-center bg-white rounded-xl overflow-hidden shadow-lg m-2 min-h-[300px]">
            <Skeleton
              variant="rectangular"
              width="100%"
              height="200px"
              style={{
                marginBottom: "10px",
                borderRadius: "16px", // Utilizza lo stesso bordo arrotondato delle card
                backgroundColor: "#f0f0f0", // Colore di sfondo personalizzato
                animation: "pulse 1.5s infinite", // Animazione di pulsazione
              }}
            />
            <Skeleton
              variant="text"
              width="90%"
              height={20}
              style={{
                marginBottom: "6px",
                borderRadius: "4px", // Utilizza lo stesso bordo arrotondato delle card
                backgroundColor: "#e0e0e0", // Colore di sfondo personalizzato
                animation: "pulse 1.5s infinite", // Animazione di pulsazione
              }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={20}
              style={{
                borderRadius: "4px", // Utilizza lo stesso bordo arrotondato delle card
                backgroundColor: "#e0e0e0", // Colore di sfondo personalizzato
                animation: "pulse 1.5s infinite", // Animazione di pulsazione
              }}
            />
          </SwiperSlide>
        ))
      ) : (
        cards.map((card) => (
          <SwiperSlide key={card.id} className="flex flex-col items-center bg-white rounded-xl overflow-hidden shadow-lg m-2">
            <Link href={`/cards/${encryptId(card.id)}`} legacyBehavior>
              <a className="block w-full h-56 overflow-hidden">
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-full h-full object-cover object-center transform scale-110"
                />
              </a>
            </Link>
            <div className="px-5 py-3 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-start space-x-2">
                <h3 className="text-xl font-semibold text-[#485d8b]">{card.title}</h3>
              </div>
              <p className="text-[#5D5D5D] text-sm text-left mt-2 overflow-hidden">{card.short_description}</p>
            </div>
          </SwiperSlide>
        ))
      )}
    </Swiper>
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
