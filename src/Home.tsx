import * as motion from "motion/react-client";
import { useState, useEffect } from "react";

function Home() {
  const unlockDate = new Date("2025-11-26");
  const isUnlocked = new Date() >= unlockDate;
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = unlockDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown("");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const navigateToSection = (direction: "left" | "right" | "down") => {
    const scrollOptions: ScrollToOptions = {
      behavior: "smooth",
    };

    switch (direction) {
      case "left":
        scrollOptions.left = 0;
        scrollOptions.top = 0;
        break;
      case "right":
        scrollOptions.left = window.innerWidth * 2;
        scrollOptions.top = 0;
        break;
      case "down":
        if (!isUnlocked) return; // Prevent navigation if locked
        scrollOptions.left = window.innerWidth;
        scrollOptions.top = window.innerHeight;
        break;
    }

    window.scrollTo(scrollOptions);
  };

  return (
    <>
      <div className="min-h-screen min-w-full relative flex items-center justify-center">
        <p>Hi pookie!!! this is our home hehehehehehe</p>

        {/* Left Arrow - Gallery */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateToSection("left")}
          className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl p-4 hover:bg-gray-100 rounded-full"
        >
          ←
        </motion.button>

        {/* Right Arrow - Notes */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateToSection("right")}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-4xl p-4 hover:bg-gray-100 rounded-full"
        >
          →
        </motion.button>

        {/* Down Arrow - Birthday */}
        {!isUnlocked && countdown && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-sm text-gray-600 font-mono">
            {countdown}
          </div>
        )}
        <motion.button
          whileHover={isUnlocked ? { scale: 1.1 } : {}}
          whileTap={isUnlocked ? { scale: 0.9 } : {}}
          onClick={() => navigateToSection("down")}
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-4xl p-4 rounded-full ${
            isUnlocked
              ? "hover:bg-gray-100 cursor-pointer"
              : "opacity-50 cursor-not-allowed bg-gray-200"
          }`}
          title={
            isUnlocked ? "Happy Birthday!" : "Unlocks on November 26, 2025"
          }
        >
          {isUnlocked ? "↓" : "🔒"}
        </motion.button>
      </div>
    </>
  );
}

export default Home;
