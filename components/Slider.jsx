"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Lottie from "react-lottie-player";

const Slider = () => {
  const trackWidth = 500;
  const trackHeight = 90; // Height of the slider bar
  const orbSize = 150; // Orb height
  const animationSize = 100; // orb animation size
  const maxDrag = (trackWidth - orbSize) / 2;
  const [dragX, setDragX] = useState(0);
  const redText = "rgba(128, 32, 55, 1)";
  const greenText = "rgba(7, 110, 73, 1)";

  // Detect if the orb is centered
  const isCentered = Math.abs(dragX) < 10;

  // load orb animation
  const [animationData, setAnimationData] = useState(null);
  //Load glowing left arrows animation
  const [leftArrowAnimation, setLeftArrowAnimation] = useState(null);
  //Load glowing right arrows animation
  const [rightArrowAnimation, setRightArrowAnimation] = useState(null);

  useEffect(() => {
    fetch("/glowing_left_arrows.json")
      .then((response) => response.json())
      .then((data) => setLeftArrowAnimation(data))
      .catch((error) =>
        console.error("Error loading left arrow animation:", error)
      );
  }, []);

  useEffect(() => {
    fetch("/glowing_right_arrows.json")
      .then((response) => response.json())
      .then((data) => setRightArrowAnimation(data))
      .catch((error) =>
        console.error("Error loading right arrow animation:", error)
      );
  }, []);

  useEffect(() => {
    fetch("/glowing_circle.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  // Memoize the animation data to prevent re-fetching
  const memoizedLeftArrowAnimation = useMemo(
    () => leftArrowAnimation,
    [leftArrowAnimation]
  );
  const memoizedRightArrowAnimation = useMemo(
    () => rightArrowAnimation,
    [rightArrowAnimation]
  );
  const memoizedAnimationData = useMemo(() => animationData, [animationData]);

  const getTextColor = useMemo(() => {
    if (dragX < -10) return redText; // Dragging left
    if (dragX > 10) return greenText; // Dragging right
    return "white"; // Default (center)
  }, [dragX]);

  const getAsset = (leftAsset, rightAsset, centerAsset) =>
    dragX < -10 ? leftAsset : dragX > 10 ? rightAsset : centerAsset;

  const [bgGradient, setBgGradient] = useState("");
  const [borderGradient, setBorderGradient] = useState("");

  useEffect(() => {
    if (dragX < -10) {
      setBgGradient(
        "linear-gradient(to top, rgba(255, 90, 139, 1), rgba(98, 22, 49, 1))"
      );
    } else if (dragX > 10) {
      setBgGradient(
        "linear-gradient(to top, rgba(108, 231, 150, 1), rgba(27, 125, 67, 1))"
      );
    } else {
      setBgGradient("");
    }
  }, [dragX]);

  useEffect(() => {
    if (dragX < -10) {
      setBorderGradient(
        "radial-gradient(circle at top, rgba(218, 73, 108, 1) 5%, rgba(98, 22, 49, 1) 100%)"
      );
    } else if (dragX > 10) {
      setBorderGradient(
        "radial-gradient(circle at top, rgba(64, 198, 134, 1) 5%, rgba(26, 80, 62, 1) 100%, rgba(26, 80, 62, 1) 100%)"
      );
    } else {
      setBorderGradient(
        "radial-gradient(circle at top, rgba(255, 238, 146, 1) 2%, rgba(252, 66, 51, 1) 100%)"
      );
    }
  }, [dragX]);

  const handleDrag = (event, info) => {
    setDragX(0);
    // Check if the orb is out of bounds and update the z-index accordingly
    if (info.offset.x <= -maxDrag) {
      alert(
        "action that is triggered when the orb is dragged completely to left side, and then released."
      );
    } else if (info.offset.x >= maxDrag) {
      alert(
        "action that is triggered when the orb is dragged completely to right side, and then released."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      {/* Slider Track */}
      <div
        className="relative w-[450px] flex items-center justify-between px-6 shadow-xl"
        style={{
          height: trackHeight,
          borderRadius: "24px",
          padding: "4px",
          background: borderGradient,
        }}
      >
        {/* Inner Container with Masking Layer */}
        <div
          className="w-full h-full overflow-hidden"
          style={{ borderRadius: "20px" }}
        >
          {/* Inner Content */}
          <div
            className="w-full h-full flex items-center justify-between px-6 bg-gray-700"
            style={{
              borderRadius: "20px",
              background: bgGradient,
            }}
          >
            {/* Left Side: Decline Text + Close Icon */}
            <div
              className="flex items-center space-x-2 text-white"
              style={{ color: getTextColor }}
            >
              <Image
                src={getAsset(
                  "/static/red_close.png",
                  "/static/green_close.png",
                  "/static/white_close.png"
                )}
                alt="Close"
                width={24}
                height={24}
              />
              <span className="text-lg font-sans font-semibold">Decline</span>
            </div>

            {/* Draggable Orb + Arrows */}
            <div className="relative flex items-center">
              {/* Left Arrow Animation when Centered */}
              {isCentered && memoizedLeftArrowAnimation ? (
                <Lottie
                  animationData={memoizedLeftArrowAnimation}
                  play
                  loop
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    left: "-15px",
                    zIndex: 5, // Lower z-index for arrows
                  }}
                />
              ) : (
                <Image
                  src={getAsset(
                    "/static/red_left_arrows.png",
                    "/static/green_left_arrows.png",
                    "/static/orange_left_arrows.png"
                  )}
                  alt="Left Arrows"
                  width={50}
                  height={50}
                  className="absolute left-[-15px] z-5" // Lower z-index for arrows
                />
              )}

              {/* Draggable Orb */}
              <motion.div
                drag="x"
                //dragConstraints={{ left: -maxDrag, right: maxDrag }}
                dragElastic={0.1}
                onDrag={(event, info) => setDragX(info.offset.x)}
                onDragEnd={handleDrag} // Snap back to center
                animate={{ x: dragX }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="cursor-pointer flex items-center justify-center relative"
                style={{ width: orbSize, height: orbSize, zIndex: 20 }} // Higher z-index for orb
              >
                {/* Background Lottie Animation (Only when centered) */}
                {isCentered && memoizedAnimationData && (
                  <div className="absolute pointer-events-none">
                    <Lottie
                      animationData={memoizedAnimationData}
                      play
                      loop
                      style={{ width: animationSize, height: animationSize }}
                    />
                  </div>
                )}

                {/* Foreground Image (On Top of Animation) */}
                <Image
                  src={getAsset(
                    "/static/red_button.png",
                    "/static/green_button.png",
                    "/static/orange_button.png"
                  )}
                  alt="Button"
                  width={orbSize}
                  height={orbSize}
                  draggable="false"
                  priority
                  className="relative z-10"
                />
              </motion.div>

              {/* Right Arrow Animation when Centered */}
              {isCentered && memoizedRightArrowAnimation ? (
                <Lottie
                  animationData={memoizedRightArrowAnimation}
                  play
                  loop
                  style={{
                    width: 50,
                    height: 50,
                    position: "absolute",
                    right: "-15px",
                    zIndex: 5, // Lower z-index for arrows
                  }}
                />
              ) : (
                <Image
                  src={getAsset(
                    "/static/red_right_arrows.png",
                    "/static/green_right_arrows.png",
                    "/static/orange_right_arrows.png"
                  )}
                  alt="Right Arrows"
                  width={50}
                  height={50}
                  className="absolute right-[-15px] z-5" // Lower z-index for arrows
                />
              )}
            </div>

            {/* Right Side: Accept Text + Check Icon */}
            <div
              className="flex items-center space-x-2 text-white"
              style={{ color: getTextColor }}
            >
              <span className="text-lg font-sans font-semibold">Accept</span>
              <Image
                src={getAsset(
                  "/static/red_check.png",
                  "/static/green_check.png",
                  "/static/white_check.png"
                )}
                alt="Check"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
