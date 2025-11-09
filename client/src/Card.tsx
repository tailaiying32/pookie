import { useState, useEffect } from "react";

interface CardProps {
	card: {
		cardId: string | number;
		title: string;
		caption: string;
		content: string;
		image?: string;
	};
}

function Card({ card }: CardProps) {
	const [orientation, setOrientation] = useState<"portrait" | "landscape">(
		"landscape"
	);

	useEffect(() => {
		if (!card.image) return;
		const img = new window.Image();
		img.src = `http://127.0.0.1:5000/${card.image}`;
		img.onload = () => {
			setOrientation(
				img.naturalHeight > img.naturalWidth ? "portrait" : "landscape"
			);
		};
	}, [card.image]);

	return (
		<div
			key={card.cardId}
			className="w-96 h-96 flex items-center justify-center m-2 rounded-2xl bg-gray-50 shadow-lg cursor-pointer overflow-hidden relative border border-gray-200"
		>
			{card.image && (
				<img
					src={`http://127.0.0.1:5000/${card.image}`}
					alt={card.title}
					className={
						orientation === "landscape"
							? "absolute max-h-full h-auto w-auto left-0 top-0"
							: "absolute max-w-full h-auto w-auto left-0 top-0"
					}
				/>
			)}
			<div className="relative z-10 w-full text-left">
				<h2 className="text-lg font-bold text-white mb-2 drop-shadow-sm">
					{card.title}
				</h2>
				<p className="text-sm text-white mb-1 line-clamp-2">
					{card.caption}
				</p>
				<p className="text-xs text-white line-clamp-2">
					{card.content}
				</p>
			</div>
		</div>
	);
}

export default Card;
