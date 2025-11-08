import { useState, useEffect } from "react";
import "./styles/App.css";
import Home from "./Home";
import Gallery from "./Gallery";
import HappyBirthDay from "./HappyBirthday";

function App() {
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
	return (
		<>
			<div className="grid grid-cols-3 grid-rows-2 w-[300vw] h-[200vh]">
				<div className="col-start-1 row-start-1">
					<Gallery />
				</div>
				<div className="col-start-2 row-start-1">
					<Home />
				</div>
				<div className="col-start-2 row-start-2">
					<HappyBirthDay />
				</div>
			</div>
		</>
	);
}

export default App;
