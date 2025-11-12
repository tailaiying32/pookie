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
			className="flex flex-col rounded-md shadow-lg py-2"
			style={style}
			onClick={handleClick}
			onContextMenu={(event) => event.preventDefault()}
		>
			<button
				type="button"
				className="px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
				className="px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
			>
				Delete
			</button>
		</div>
	);
}

export default Menu;
