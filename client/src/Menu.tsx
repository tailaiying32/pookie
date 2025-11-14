import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import type { CardType } from "./types/CardType";
import ConfirmDialog from "./ConfirmDialog";

interface MenuProps {
	card: CardType;
	onDelete: (cardId: CardType["cardId"]) => void;
	onClose: () => void;
	handleEdit: (card: CardType) => void;
	style?: CSSProperties;
}

function Menu({ card, onDelete, onClose, handleEdit, style }: MenuProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
	};

	const openConfirm = () => {
		setShowConfirm(true);
	};

	const handleConfirmDelete = () => {
		onDelete(card.cardId);
		setShowConfirm(false);
		onClose();
	};

	const handleCancel = () => {
		setShowConfirm(false);
	};

	return (
		<>
			{!showConfirm && (
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
						onClick={openConfirm}
						className="text-theme-accent"
					>
						Delete
					</button>
				</div>
			)}
			<ConfirmDialog
				open={showConfirm}
				title="Delete card"
				message={
					<p>
						Are you sure you want to delete{" "}
						<strong>{card.title}</strong>?
					</p>
				}
				confirmLabel="Delete"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancel}
			/>
		</>
	);
}

export default Menu;
