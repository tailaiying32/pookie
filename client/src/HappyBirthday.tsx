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
				<Link to="/">Back</Link>
			</div>
			<div className="min-h-screen min-w-full relative flex flex-col justify-center space-y-6">
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
							"#a864fd",
							"#29cdff",
							"#78ff44",
							"#ff718d",
							"#fdff6a",
						]}
					/>
					<Confetti
						mode="fall"
						fadeOutHeight={90}
						colors={[
							"#a864fd",
							"#29cdff",
							"#78ff44",
							"#ff718d",
							"#fdff6a",
						]}
					/>
				</div>
			)}
		</>
	);
}

export default HappyBirthDay;
