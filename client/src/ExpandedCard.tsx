import { useState, useEffect, useCallback } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { CardType } from "./types/CardType";
import "./styles/App.css";
import { formatCaptionDate } from "./utils/date";
import { API_BASE } from "./api";

interface ExpandedCardProps {
	card: CardType;
	onClose: () => void;
}

function ExpandedCard({ card, onClose }: ExpandedCardProps) {
	const [isFlipped, setIsFlipped] = useState(false);

	const toggleFlip = useCallback(() => {
		setIsFlipped((prev) => !prev);
	}, []);

	const handleFaceKeyDown = useCallback(
		(event: ReactKeyboardEvent<HTMLDivElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				toggleFlip();
			}
		},
		[toggleFlip]
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	return (
		<div
			className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-label={`${card.title} memory card`}
		>
			<div
				className="expanded-card-wrapper"
				onClick={(event) => event.stopPropagation()}
			>
				<div
					className={`expanded-card ${isFlipped ? "is-flipped" : ""}`}
				>
					<div
						className="expanded-card__face expanded-card__face--front soft-gradient"
						role="button"
						tabIndex={0}
						onClick={toggleFlip}
						onKeyDown={handleFaceKeyDown}
					>
						{card.image && (
							<img
								src={`${API_BASE}/${card.image}`}
								alt={card.title}
							/>
						)}
						<div className="expanded-card__overlay">
							<h2 className="expanded-card__title">
								{card.title}
							</h2>
							<p className="expanded-card__date">
								{formatCaptionDate(card.caption)}
							</p>
						</div>
					</div>
					<div
						className="expanded-card__face expanded-card__face--back expanded-back"
						role="button"
						tabIndex={0}
						onClick={toggleFlip}
						onKeyDown={handleFaceKeyDown}
					>
						<div className="expanded-card__header">
							<h2 className="expanded-card__header-title">
								{card.title}
							</h2>
							<p className="expanded-card__header-date">
								{formatCaptionDate(card.caption)}
							</p>
						</div>
						<div className="expanded-card__body">
							<p>{card.content}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ExpandedCard;
