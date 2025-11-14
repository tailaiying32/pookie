import { useState } from "react";
import type { CardType } from "./types/CardType";
import "../src/styles/App.css";
import { formatCaptionDate } from "./utils/date";

interface ExpandedCardProps {
	card: CardType;
	onClose: () => void;
}

function ExpandedCard({ card, onClose }: ExpandedCardProps) {
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
			className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
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
					<div className="relative rounded-4xl overflow-hidden shadow-2xl w-full h-full soft-gradient">
						{card.image && (
							<img
								src={`http://127.0.0.1:5000/${card.image}`}
								alt={card.title}
								className="w-full h-full object-cover"
								style={{
									objectFit: "cover",
									objectPosition: "center",
								}}
							/>
						)}

						<div className="absolute top-0 z-10 w-full h-full p-6 flex flex-col items-start text-left">
							<div className="text-left">
								<h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg text-left">
									{card.title}
								</h2>
								<p className="text-white text-lg drop-shadow-lg text-left">
									{formatCaptionDate(card.caption)}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Back of card */}
				<div
					onClick={handleFlip}
					className="absolute top-0 left-0 backface-hidden w-full h-full expanded-back"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
					}}
				>
					<div className="panel panel-solid surface-alt rounded-4xl p-10 overflow-auto w-full h-full">
						<div className="flex justify-between items-start mb-6">
							<div className="text-left">
								<h2 className="text-4xl font-bold mb-2 text-left text-theme-ink">
									{card.title}
								</h2>
								<h2 className="text-2xl text-left text-theme-muted">
									{formatCaptionDate(card.caption)}
								</h2>
							</div>
						</div>

						<div className="prose prose-lg max-w-none">
							<p
								className="leading-relaxed whitespace-pre-wrap text-justify text-2xl text-theme-ink"
								style={{ textAlign: "justify" }}
							>
								{card.content}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ExpandedCard;
