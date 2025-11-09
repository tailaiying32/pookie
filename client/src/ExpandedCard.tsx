import { useState, useEffect } from "react";

interface ExpandedCardProps {
	card: {
		cardId: string | number;
		title: string;
		caption: string;
		content: string;
		image?: string;
	};
	onClose: () => void;
}

function ExpandedCard({ card, onClose }: ExpandedCardProps) {
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
			className="fixed inset-0 z-50 flex items-center justify-center"
			onClick={onClose}
		>
			<div
				className="relative max-h-[90vh] max-w-[90vw] cursor-default overflow-hidden transition-transform duration-200 ease-in-out"
				onClick={(event) => {
					// Keep card open when the user interacts with its contents
					event.stopPropagation();
				}}
			>
				{card.image && (
					<img
						src={`http://127.0.0.1:5000/${card.image}`}
						alt={card.title}
						className={
							orientation === "landscape"
								? "block h-full max-h-[30vh] w-auto"
								: "block w-full max-w-[30vw] h-auto"
						}
					/>
				)}

				<div className="absolute top-0 left-0 z-10 w-full text-left p-4">
					<p className="text-white line-clamp-2 text-shadow">
						{card.caption}
					</p>
					<h2 className="text-2xl font-bold text-white mb-2 text-shadow">
						{card.title}
					</h2>

					<p className="">{card.content}</p>
				</div>
			</div>
		</div>
	);
}

export default ExpandedCard;
