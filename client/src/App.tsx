import "./styles/App.css";
import Home from "./Home";
import HappyBirthDay from "./HappyBirthday";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/happybirthday" element={<HappyBirthDay />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
