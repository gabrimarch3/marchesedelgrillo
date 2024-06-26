import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "react-loading-skeleton/dist/skeleton.css";
import "../embla.css";
import "swiper/css";
import "swiper/css/pagination";
import Box from "@mui/material/Box";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar } from "swiper/modules";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const secretKey = "1234567890abcdef";

const encryptId = (id) => {
  const encrypted = CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  return encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export default function ServicesSection(props) {
  const [services, setServices] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let userId = parseInt(queryParams.get('user_id'));

    if (!userId) {
      userId = parseInt(Cookies.get('user_id'));
    }

    if (!userId) {
      console.error('User ID not found in URL or cookies');
      return;
    }

    const lang = Cookies.get('lang') || 'en';

    fetch(`https://hunt4taste.it/api/services?lang=${lang}`)
      .then(response => response.json())
      .then(data => {
        const filteredServices = data.filter(service => service.user_id === userId);
        setServices(filteredServices);
        console.log(filteredServices);
      })
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const styles = {
    card: {
      maxWidth: isMobile ? 100 : 130,
      margin: "auto",
    },
    media: {
      height: 0,
      paddingTop: "100%",
    },
    title: {
      textAlign: "center",
    },
  };

  return (
    <Box sx={{ mt: 5, mb: 5, ml: 2 }}>
      <Swiper
        className="mySwiper h-full"
        slidesPerView={1}
        spaceBetween={30}
        pagination={{ clickable: true }}
        breakpoints={{
          100: {
            slidesPerView: 2.3,
            spaceBetween: 20,
          },
          320: {
            slidesPerView: 2.2,
            spaceBetween: 60,
          },
          550: {
            slidesPerView: 3.2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3.5,
            spaceBetween: -30,
          },
          900: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1000: {
            slidesPerView: 6,
            spaceBetween: 200,
          },
          1500: {
            slidesPerView: 5,
            spaceBetween: 260,
          },
        }}
        modules={[Scrollbar]}
      >
        {services.length > 0 ? services.map((item, index) => (
          <Box key={index} sx={{ m: 1 }}>
            <SwiperSlide>
              <Link href={`/servizi/${encryptId(item.id)}`} passHref>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "background.paper",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: 3,
                    width: {
                      xs: 180,
                      sm: 180,
                      md: 180,
                      lg: 200,
                      xl: 280,
                    },
                    height: {
                      xs: 180,
                      sm: 180,
                      md: 180,
                      lg: 200,
                      xl: 280,
                    },
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={item.image}
                    alt={item.title}
                  />
                </Box>
                <Typography
                  variant="subtitle1"
                  color="secondary"
                  sx={{
                    pt: 1,
                    textAlign: "center",
                    width: "200px",
                    color: "#7B7C7C",
                    overflow: "hidden",
                    whiteSpace: isLargeScreen ? "normal" : "nowrap",
                    textOverflow: isLargeScreen ? "unset" : "ellipsis",
                    textAlign: 'left',
                  }}
                >
                  {item.title.toUpperCase()}
                </Typography>
              </Link>
            </SwiperSlide>
          </Box>
        )) : (
          <Skeleton count={7} />
        )}
      </Swiper>
    </Box>
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
