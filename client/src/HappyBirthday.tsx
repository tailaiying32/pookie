import { useState } from "react";
import { Link } from "react-router-dom";
import BirthdayVideo from "./BirthdayVideo";
import GiftBox from "./GiftBox";
import Confetti from "react-confetti-boom";

function HappyBirthDay() {
	const [activeCard, setActiveCard] = useState(false);
	const [confetti, setConfetti] = useState(false);

	return (
		<>
			<div className="absolute z-10 top-6 left-6">
				<Link to="/" className="btn-ghost">
					Back
				</Link>
			</div>
			<div className="theme-app min-h-screen min-w-full relative flex flex-col items-center justify-center space-y-6">
				<div
					onClick={() => {
						setConfetti(true);
						setTimeout(() => {
							setActiveCard(true);
						}, 1750);
					}}
				>
					<GiftBox></GiftBox>
				</div>
				{activeCard && (
					<BirthdayVideo
						onClose={() => setActiveCard(false)}
						link="https://www.youtube.com/watch?v=YiJn_W5zNNc"
					></BirthdayVideo>
				)}
			</div>
			{confetti && (
				<div>
					<Confetti
						particleCount={120}
						shapeSize={12}
						spreadDeg={65}
						launchSpeed={1.3}
						colors={[
							"#fd804f",
							"#db9073",
							"#fde59a",
							"#fbc4bd",
							"#c3ddec",
						]}
					/>
					<Confetti
						mode="fall"
						fadeOutHeight={90}
						colors={[
							"#fd804f",
							"#db9073",
							"#fde59a",
							"#fbc4bd",
							"#c3ddec",
						]}
					/>
				</div>
			)}
		</>
	);
}

export default HappyBirthDay;
