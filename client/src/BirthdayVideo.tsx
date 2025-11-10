import { useState } from "react";
import ReactPlayer from "react-player";

interface BirthdayVideoProps {
	link: string;
	onClose: () => void;
}

function BirthdayVideo({ link, onClose }: BirthdayVideoProps) {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleFlip = () => {
		setIsFlipped(!isFlipped);
	};

	// Fixed card dimensions
	const cardWidth = "70vw";
	const cardHeight = "70vh";
	const maxWidth = "600px";
	const maxHeight = "600px";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-25"
			onClick={onClose}
		>
			<div
				className="relative preserve-3d transition-transform duration-450 ease-in-out"
				style={{
					transformStyle: "preserve-3d",
					transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
					width: cardWidth,
					height: cardHeight,
					maxWidth: maxWidth,
					maxHeight: maxHeight,
				}}
				onClick={(event) => {
					event.stopPropagation();
				}}
			>
				{/* Front of card */}
				<div
					onClick={handleFlip}
					className="backface-hidden cursor-pointer w-full h-full"
					style={{ backfaceVisibility: "hidden" }}
				>
					<div className="relative rounded-4xl overflow-hidden shadow-2xl w-full h-full bg-white dark:bg-gray-900">
						<h1>Happy Birthday Pookie!</h1>
						<h3>Love, Tailai</h3>
					</div>
				</div>

				{/* Back of card */}
				<div
					onClick={handleFlip}
					className="cursor-pointer absolute top-0 left-0 backface-hidden w-full h-full"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				>
					<div className="bg-white dark:bg-gray-900 rounded-4xl shadow-2xl overflow-auto w-full h-full border border-gray-200 dark:border-gray-700 flex items-center justify-center">
						<ReactPlayer
							src={link}
							playing={false}
							controls={true}
							volume={1}
							width="100%"
							height="100%"
							style={{ maxHeight: "100%", maxWidth: "100%" }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BirthdayVideo;
