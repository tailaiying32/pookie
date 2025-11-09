import { useState, useEffect } from "react";

interface CardProps {
	card: {
		cardId: string | number;
		title: string;
		caption: string;
		content: string;
		image?: string;
	};
	setActiveCard: () => void;
}

function Card({ card, setActiveCard }: CardProps) {
	return (
		<div
			onClick={() => {
				setActiveCard();
			}}
			className="card-closed cursor-pointer transition-transform duration-200 ease-in-out"
		>
			{card.image && (
				<img
					src={`http://127.0.0.1:5000/${card.image}`}
					alt={card.title}
					className="w-full h-full object-cover"
				/>
			)}
			{/* <div className="absolute top-0 left-0 z-10 w-full text-left p-4">
				<h2 className="text-lg font-bold text-white mb-2 text-shadow">
					{card.title}
				</h2>
				<p className="text-xs text-white line-clamp-2 text-shadow">
					{card.caption}
				</p>
			</div> */}
		</div>
	);
}

export default Card;
