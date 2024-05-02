'use client'
import React, { useEffect } from "react";
import Cookies from 'js-cookie'; // Import js-cookie
import Header from "./components/Header";
import Services from "./components/Services";
import SwiperCards from "./components/SwiperCards";
import SubscriptionForm from "./components/SubscriptionForm";
import Footer from "./components/Footer";

export default function Home() {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = queryParams.get('user_id');
    
    // Check if user_id is available and update cookie
    if (userIdFromUrl) {
      Cookies.set('user_id', userIdFromUrl, { expires: 1 }); // Expires in 1 day
    }
  }, []);

  // Retrieve user_id from cookie
  const userId = Cookies.get('user_id');

  return (
    <>
      <Header />
      <div className="pt-10 bg-transparent">
        <h3 className="ml-3 pl-3 pb-3 font-bold text-[#7B7C7C]">IN HOTEL</h3>
        <div className="pl-3 overflow-hidden max-w-full">
          <SwiperCards userId={userId} />
        </div>
      </div>
      <div className="pt-10 bg-transparent">
        <h3 className="ml-3 pl-3 pb-3 font-bold text-[#7B7C7C]">SERVIZI</h3>
        <div className="pl-3 overflow-hidden max-w-full">
          <Services userId={userId} />
        </div>
      </div>
      <SubscriptionForm userId={userId} />
      <Footer />
    </>
  );
}