import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function TrickSwiper() {
  const [direction, setDirection] = useState("horizontal");

  // تابع برای تعیین جهت Swiper بر اساس عرض صفحه
  const getDirection = () => {
    const windowWidth = window.innerWidth;
    return windowWidth <= 760 ? "vertical" : "horizontal";
  };

  // بررسی عرض صفحه در زمان لود و تغییر اندازه
  useEffect(() => {
    const handleResize = () => {
      setDirection(getDirection());
    };

    // تنظیم جهت اولیه
    setDirection(getDirection());

    // افزودن Event Listener برای resize
    window.addEventListener("resize", handleResize);

    // تمیز کردن Event Listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Swiper
      slidesPerView={2}
      direction={direction}
      modules={[Navigation]}
      loop={false}
      className="mySwiper"
    >
      <SwiperSlide>
        <div className="mr-4">
          <span className="text-text-text4 mb-1 block cursor-help text-xs underline decoration-dashed underline-offset-4">
            Market Price
          </span>
          <span className="text-text-text0 block text-xs font-medium">
            3.0316
          </span>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="mr-4">
          <span className="text-text-text4 mb-1 block cursor-help text-xs underline decoration-dashed underline-offset-4">
            Index
          </span>
          <span className="text-text-text0 block text-xs font-medium">
            3.0316
          </span>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="mr-4">
          <span className="text-text-text4 mb-1 block cursor-help text-xs underline decoration-dashed underline-offset-4">
            Funding Rate/Countdown
          </span>
          <div className="flex items-center gap-1">
            <span className="text-warning block text-xs font-medium">
              0.0421%
            </span>
            <span className="text-text-text0 block text-xs font-medium">
              02:45:15
            </span>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="mr-4">
          <span className="text-text-text4 mb-1 flex cursor-help items-center gap-1 text-xs">
            24h Change
            <span>
              <svg className="text-primary-primary3 h-4 w-4">
                <path
                  d="M4.5 6V3l-2 1.5 2 1.5Z"
                  fill="none"
                  stroke="currentColor"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.68 2.24A.2.2 0 0 1 5 2.4v4.2a.2.2 0 0 1-.32.16l-2.8-2.1a.2.2 0 0 1 0-.32l2.8-2.1ZM3.333 4.5 4 5V4l-.667.5Z"
                  fill="none"
                  stroke="currentColor"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.5 5.1h-6V3.9h6A3.1 3.1 0 0 1 13.6 7v.4a.2.2 0 0 1-.2.2h-.8a.2.2 0 0 1-.2-.2V7a1.9 1.9 0 0 0-1.9-1.9Z"
                  fill="currentColor"
                  stroke="currentColor"
                ></path>
                <path
                  d="M11.5 10v3l2-1.5-2-1.5Z"
                  fill="currentColor"
                  stroke="currentColor"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.32 13.76a.2.2 0 0 1-.32-.16V9.4a.2.2 0 0 1 .32-.16l2.8 2.1a.2.2 0 0 1 0 .32l-2.8 2.1Zm1.346-2.26L12 11v1l.666-.5Z"
                  fill="currentColor"
                  stroke="currentColor"
                ></path>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.5 10.9h6v1.2h-6A3.1 3.1 0 0 1 2.4 9v-.4c0-.11.09-.2.2-.2h.8c.11 0 .2.09.2.2V9c0 1.05.85 1.9 1.9 1.9Z"
                  fill="currentColor"
                  stroke="currentColor"
                ></path>
              </svg>
            </span>
          </span>
          <div className="flex items-center gap-1">
            <span className="text-success-success1 block text-xs font-medium">
              0.0085
            </span>
            <span className="text-success-success1 block text-xs font-medium">
              +1.35%
            </span>
          </div>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="mr-4">
          <span className="text-text-text4 mb-1 block cursor-help text-xs">
            24 High
          </span>
          <span className="text-text-text0 block text-xs font-medium">
            3.1057
          </span>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="mr-4">
          <span className="text-text-text4 mb-1 block cursor-help text-xs">
            24 Low
          </span>
          <span className="text-text-text0 block text-xs font-medium">
            3.1057
          </span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="mr-4">
          <span className="text-text-text4 mb-1 block cursor-help text-xs">
            24h Valume(XRP)
          </span>
          <span className="text-text-text0 block text-xs font-medium">
            313,656,850.6
          </span>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="mr-4">
          <span className="text-text-text4 mb-1 block cursor-help text-xs">
            24h Valume(USDT)
          </span>
          <span className="text-text-text0 block text-xs font-medium">
            957,656,850.6325
          </span>
        </div>
      </SwiperSlide>

      {/* دکمه‌های ناوبری */}
      {/* <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div> */}
    </Swiper>
  );
}
