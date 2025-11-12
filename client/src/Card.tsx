import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { CardType } from "./types/CardType";
import Menu from "./Menu";

interface CardProps {
	card: CardType;
	setActiveCard: (card: CardType) => void;
	onDelete: (cardId: CardType["cardId"]) => void;
	handleEdit: (card: CardType) => void;
}

function Card({ card, setActiveCard, onDelete, handleEdit }: CardProps) {
	const [menu, setMenu] = useState({ open: false, x: 0, y: 0 });

	useEffect(() => {
		if (!menu.open) return;

		const handleOutsideClick = () =>
			setMenu((prev) => ({ ...prev, open: false }));
		window.addEventListener("click", handleOutsideClick);

		return () => {
			window.removeEventListener("click", handleOutsideClick);
		};
	}, [menu.open]);

	const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		setMenu({
			open: true,
			x: event.clientX,
			y: event.clientY,
		});
	};

	return (
		<div
			onContextMenu={handleContextMenu}
			onClick={() => setActiveCard(card)}
			className="card-closed cursor-pointer transition-transform duration-200 ease-in-out"
		>
			{card.image && (
				<img
					src={`http://127.0.0.1:5000/${card.image}`}
					alt={card.title}
					className="w-full h-full object-cover"
				/>
			)}
			{menu.open && (
				<Menu
					card={card}
					onDelete={onDelete}
					onClose={() =>
						setMenu((prev) => ({ ...prev, open: false }))
					}
					handleEdit={handleEdit}
					style={{
						position: "fixed",
						top: menu.y,
						left: menu.x,
						zIndex: 1000,
					}}
				/>
			)}
		</div>
	);
}

export default Card;
