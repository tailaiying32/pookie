import { useState } from "react";
import type { MouseEvent } from "react";
import type { CardType } from "./types/CardType";
import Menu from "./Menu";
import { API_BASE } from "./api";

interface CardProps {
	card: CardType;
	setActiveCard: (card: CardType) => void;
	onDelete: (cardId: CardType["cardId"]) => void;
	handleEdit: (card: CardType) => void;
	activeMenuCardId: CardType["cardId"] | null;
	setActiveMenu: (
		cardId: CardType["cardId"] | null,
		position?: { x: number; y: number }
	) => void;
}

function Card({
	card,
	setActiveCard,
	onDelete,
	handleEdit,
	activeMenuCardId,
	setActiveMenu,
}: CardProps) {
	const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

	const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		const x = event.clientX;
		const y = event.clientY;
		setMenuPosition({ x, y });
		setActiveMenu(card.cardId, { x, y });
	};

	return (
		<div
			onContextMenu={handleContextMenu}
			onClick={() => {
				setActiveMenu(null);
				setActiveCard(card);
			}}
			className="card-closed cursor-pointer transition-transform duration-200 ease-in-out"
		>
			{card.image && (
				<img
					src={`${API_BASE}/${card.image}`}
					alt={card.title}
					className="w-full h-full object-cover"
				/>
			)}
			{activeMenuCardId === card.cardId && (
				<Menu
					card={card}
					onDelete={onDelete}
					onClose={() => setActiveMenu(null)}
					handleEdit={handleEdit}
					style={{
						position: "fixed",
						top: menuPosition.y,
						left: menuPosition.x,
						zIndex: 1000,
					}}
				/>
			)}
		</div>
	);
}

export default Card;
