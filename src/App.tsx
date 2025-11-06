import { useState, useEffect } from "react";
import "./styles/App.css";
import * as motion from "motion/react-client";
import Home from "./Home";
import Gallery from "./Gallery";
import HappyBirthDay from "./HappyBirthday";
import Notes from "./Notes";

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // make sure the site loads to home (the middle column on first load and reload)
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({
      left: window.innerWidth,
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    const updateFullscreen = () => {
      const fullscreenActive = Boolean(document.fullscreenElement);
      setIsFullscreen(fullscreenActive);
      if (fullscreenActive) {
        setErrorMessage(null);
      }
    };

    document.addEventListener("fullscreenchange", updateFullscreen);
    updateFullscreen();

    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  const requestFullscreen = async () => {
    setErrorMessage(null);

    const element = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
      msRequestFullscreen?: () => Promise<void> | void;
    };

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
        return;
      }

      if (element.webkitRequestFullscreen) {
        const result = element.webkitRequestFullscreen();
        await Promise.resolve(result);
        return;
      }

      if (element.msRequestFullscreen) {
        const result = element.msRequestFullscreen();
        await Promise.resolve(result);
        return;
      }

      throw new Error("Fullscreen API is not available in this browser.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to open full screen. Please use your browser shortcut instead."
      );
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 w-[300vw] h-[200vh]">
        <div className="col-start-1 row-start-1">
          <Gallery />
        </div>
        <div className="col-start-2 row-start-1">
          <Home />
        </div>
        <div className="col-start-3 row-start-1">
          <Notes />
        </div>
        <div className="col-start-2 row-start-2">
          <HappyBirthDay />
        </div>
      </div>

      {!isFullscreen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-950/90 p-6 text-white backdrop-blur"
          style={{ zIndex: 60 }}
        >
          <div className="max-w-lg space-y-6 text-center">
            <h2 className="text-3xl font-semibold">
              Go full screen to explore
            </h2>
            <p className="text-base text-slate-200">
              This scrapbook is designed for a full-screen adventure. Enter full
              screen to enjoy the full layout and interactive cards.
            </p>
            {errorMessage && (
              <p className="rounded-lg bg-rose-500/30 p-3 text-sm text-rose-100">
                {errorMessage}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={requestFullscreen}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg"
              >
                Enter full screen
              </motion.button>
            </div>
            <p className="text-xs text-slate-400">
              Tip: You can also press F11 (Windows) or Control + Command + F
              (macOS) to toggle full screen.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
