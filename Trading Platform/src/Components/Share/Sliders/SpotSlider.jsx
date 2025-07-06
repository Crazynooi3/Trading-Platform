import React, { useState, useRef, useEffect } from "react";

export default function SpotSlider() {
  const [position, setPosition] = useState(40);
  const sliderRef = useRef(null);
  const handleRef = useRef(null);

  console.log(position);

  const handleMouseMove = (e) => {
    if (!sliderRef.current || !handleRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    let newPosition = ((e.clientX - sliderRect.left) / sliderRect.width) * 100;
    newPosition = Math.max(0, Math.min(100, newPosition)); // محدود کردن بین 0 تا 100
    setPosition(newPosition);
  };

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="relative mx-6 mt-3 flex h-4 cursor-pointer items-center">
      <div ref={sliderRef} className="relative h-1 w-full bg-[#2d2f35]">
        {/* خط progress روشن‌تر */}
        <div
          className="absolute top-0 left-1 h-1 bg-white"
          style={{ width: `${position + 2}%` }}
        ></div>
        {/* نقاط کوچک */}
        <div className="absolute -top-1/2 left-0 h-2.5 w-2.5 rounded-full border-2 border-[#b5b9bf] bg-[#17181e]"></div>
        <div className="absolute -top-1/2 left-1/4 h-2.5 w-2.5 rounded-full border-2 border-[#b5b9bf] bg-[#17181e]"></div>
        <div className="absolute -top-1/2 left-2/4 h-2.5 w-2.5 rounded-full border-2 border-[#b5b9bf] bg-[#17181e]"></div>
        <div className="absolute -top-1/2 left-3/4 h-2.5 w-2.5 rounded-full border-2 border-[#b5b9bf] bg-[#17181e]"></div>
        <div className="absolute -top-1/2 left-4/4 h-2.5 w-2.5 rounded-full border-2 border-[#b5b9bf] bg-[#17181e]"></div>
        {/* دایره بزرگ (handle) */}
        <div
          ref={handleRef}
          onMouseDown={handleMouseDown}
          className="group absolute -top-1.5 h-4 w-4 cursor-pointer rounded-full border-4 border-white bg-[#17181e] transition-transform hover:scale-110"
          style={{ left: `${position + 2}%`, transform: "translateX(-50%)" }}
        >
          <span className="absolute -top-9 -left-3 hidden group-hover:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="text-fill-fill2 relative size-8"
            >
              <path
                fill-rule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
                clip-rule="evenodd"
              />
            </svg>
            <span className="absolute top-1/4 left-1/4 text-[8px]">
              {Math.ceil(position)}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
