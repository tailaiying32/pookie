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
			<div className="absolute z-10 top-4 left-4">
				{" "}
				<Link to="/">Back</Link>
			</div>
			<div className="min-h-screen min-w-full relative flex flex-col justify-center space-y-6">
				<div
					onClick={() => {
						setConfetti(true);
						setTimeout(() => {
							setActiveCard(true);
						}, 2000);
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
						spreadDeg={50}
					/>
					<Confetti mode="fall" fadeOutHeight={90} />
				</div>
			)}
		</>
	);
}

export default HappyBirthDay;
