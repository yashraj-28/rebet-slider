"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lottie from "react-lottie-player";

const Slider = () => {
  const trackWidth = 500;
  const trackHeight = 90; // Height of the slider bar
  const orbSize = 150; // Orb almost fills the height
  const animationSize = 120; // Slightly smaller than orb
  const maxDrag = (trackWidth - orbSize) / 2;
  const [dragX, setDragX] = useState(0);
  const [animationData, setAnimationData] = useState(null);
  const redText = 'rgba(128, 32, 55, 1)';
  const greenText = 'rgba(7, 110, 73, 1)';

  // Detect if the orb is centered
  const isCentered = Math.abs(dragX) < 10;

  useEffect(() => {
    fetch("/glowing_circle.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  // Function to determine which image to show
  const getImage = () => {
    if (dragX > 10) return "/static/green_button.png"; // Right
    if (dragX < -10) return "/static/red_button.png"; // Left
    return "/static/orange_button.png"; // Center
  };

  // Function to get the correct close icon
  const getCloseIcon = () => {
    if (dragX < -10) return "/static/red_close.png"; // Dragging left
    if (dragX > 10) return "/static/green_close.png"; // Dragging right
    return "/static/white_close.png"; // Default (center)
  };

  // Function to get the correct check icon
  const getCheckIcon = () => {
    if (dragX < -10) return "/static/red_check.png"; // Dragging left
    if (dragX > 10) return "/static/green_check.png"; // Dragging right
    return "/static/white_check.png"; // Default (center)
  };

  const getInnerLeftArrowIcon = () => {
    if (dragX < -10) return "/static/red_left_arrows.png"; // Dragging left
    if (dragX > 10) return "/static/green_left_arrows.png"; // Dragging right
    return "/static/orange_left_arrows.png"; // Default (center)
  }

  const getInnerRightArrowIcon = () => {
    if (dragX < -10) return "/static/red_right_arrows.png"; // Dragging left
    if (dragX > 10) return "/static/green_right_arrows.png"; // Dragging right
    return "/static/orange_right_arrows.png"; // Default (center)
  }

  // Function to get text color dynamically
  const getTextColor = () => {
    if (dragX < -10) return redText; // Dragging left
    if (dragX > 10) return greenText; // Dragging right
    return 'white'; // Default (center)
  };

  const [bgGradient, setBgGradient] = useState("");
  const [borderGradient, setBorderGradient] = useState("");
  
  useEffect(() => {
    if (dragX < -10) {
      setBgGradient("linear-gradient(to top, rgba(255, 90, 139, 1), rgba(98, 22, 49, 1))");
    } else if(dragX > 10){
      setBgGradient("linear-gradient(to top, rgba(108, 231, 150, 1), rgba(27, 125, 67, 1))");
    }
    else{
      setBgGradient("");
    }
  }, [dragX]);
  
  useEffect(() => {
    if (dragX < -10) {
      setBorderGradient("linear-gradient(to top, rgba(218, 73, 108, 1), rgba(98, 22, 49, 1))");
    } else if (dragX > 10) {
      setBorderGradient("linear-gradient(to top, rgba(64, 198, 134, 1), rgba(26, 80, 62, 1))");
    } else {
      setBorderGradient("linear-gradient(to bottom, rgba(255, 238, 146, 1), rgba(252, 66, 51, 0.5))");
    }
}, [dragX]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      {/* Slider Track */}
      <div
  className="relative w-[450px] flex items-center justify-between px-6 shadow-xl"
  style={{
    position: "relative",
    height: trackHeight,
    borderRadius: "24px", // Ensure rounded corners
    padding: "4px", // Adds space for the gradient border
    background: borderGradient
  }}
>
  {/* Inner Container for Slider */}
  <div
    className="w-full h-full flex items-center justify-between px-6 bg-gray-700"
    style={{
      borderRadius: "20px", // Ensures content follows the rounded shape
       background: bgGradient// Background inside the slider
    }}
  >
        {/* Left Side: Decline Text + Close Icon */}
        <div className="flex items-center space-x-2 text-white " style={{ color: getTextColor() }}>
          <Image src={getCloseIcon()} alt="Close" width={24} height={24} />
          <span className="text-lg font-sans font-semibold">Decline</span>
        </div>

        {/* Draggable Orb + Arrows */}
        <div className="relative flex items-center">
          {/* Left Arrow (Close to Orb) */}
          <Image
            src={getInnerLeftArrowIcon()}
            alt="Left Arrows"
            width={50}
            height={50}
            className="absolute left-[-15px] z-5" // Closer to the orb
          />

          {/* Draggable Orb */}
          <motion.div
            drag="x"
            dragConstraints={{ left: -maxDrag, right: maxDrag }}
            dragElastic={0.2}
            onDrag={(event, info) => setDragX(info.offset.x)}
            onDragEnd={() => setDragX(0)} // Snap back to center
            animate={{ x: dragX }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="cursor-pointer flex items-center justify-center relative z-20"
            style={{ width: orbSize, height: orbSize }}
          >
            {/* Background Lottie Animation (Only when centered) */}
            {isCentered && animationData && (
              <div className="absolute z-0 pointer-events-none">
                <Lottie animationData={animationData} play loop style={{ width: animationSize, height: animationSize }} />
              </div>
            )}

            {/* Foreground Image (On Top of Animation) */}
            <Image
              src={getImage()}
              alt="Button"
              width={orbSize}
              height={orbSize}
              draggable="false"
              priority
              className="z-10 relative"
            />
          </motion.div>

          {/* Right Arrow (Close to Orb) */}
          <Image
            src={getInnerRightArrowIcon()}
            alt="Right Arrows"
            width={50}
            height={50}
            className="absolute right-[-15px] z-5" // Closer to the orb
          />
        </div>

        {/* Right Side: Accept Text + Check Icon */}
        <div className="flex items-center space-x-2 text-white" style={{ color: getTextColor() }}>
          <span className="text-lg font-sans font-semibold">Accept</span>
          <Image src={getCheckIcon()} alt="Check" width={24} height={24} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Slider;
