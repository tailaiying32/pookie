import * as motion from "motion/react-client";

function HappyBirthDay() {
  const navigateToSection = (direction: "up") => {
    const scrollOptions: ScrollToOptions = {
      behavior: "smooth",
    };

    switch (direction) {
      case "up":
        scrollOptions.left = window.innerWidth;
        scrollOptions.top = 0;
        break;
    }

    window.scrollTo(scrollOptions);
  };

  return (
    <>
      <div className="min-h-screen min-w-full relative flex items-center justify-center">
        <p>Happy Birthday pookie!!!</p>

        {/* Up Arrow - Home */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigateToSection("up")}
          className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl p-4 hover:bg-gray-100 rounded-full"
        >
          ↑
        </motion.button>
      </div>
    </>
  );
}

export default HappyBirthDay;
