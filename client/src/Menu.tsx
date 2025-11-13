import type { CSSProperties, MouseEvent } from "react";
import type { CardType } from "./types/CardType";

interface MenuProps {
	card: CardType;
	onDelete: (cardId: CardType["cardId"]) => void;
	onClose: () => void;
	handleEdit: (card: CardType) => void;
	style?: CSSProperties;
}

function Menu({ card, onDelete, onClose, handleEdit, style }: MenuProps) {
	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
	};

	const handleDelete = () => {
		if (window.confirm("Delete this card?")) {
			onDelete(card.cardId);
			onClose();
		}
	};

	return (
		<div
			className="menu-panel flex flex-col py-2"
			style={style}
			onClick={handleClick}
			onContextMenu={(event) => event.preventDefault()}
		>
			<button
				type="button"
				className="text-theme-ink"
				onClick={() => {
					handleEdit(card);
					onClose();
				}}
			>
				Edit
			</button>
			<button
				type="button"
				onClick={handleDelete}
				className="text-theme-accent"
			>
				Delete
			</button>
		</div>
	);
}

export default Menu;
