import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Card from "./Card";
import ExpandedCard from "./ExpandedCard";
import type { CardType } from "./types/CardType";
import AddCardForm from "./AddCardForm";
import EditCardForm from "./EditCardForm";
import { Link } from "react-router-dom";
import "./styles/index.css";

function Home() {
	const [cards, setCards] = useState<CardType[]>([]);
	const [addingCard, setAddingCard] = useState(false);
	const [editingCard, setEditingCard] = useState<CardType | null>(null);
	const [activeCard, setActiveCard] = useState<CardType | null>(null);

	// state variables for add/edit card menu
	const [title, setTitle] = useState("");
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [content, setContent] = useState("");
	const [selectedImageName, setSelectedImageName] = useState("");
	const [timeUntilSurprise, setTimeUntilSurprise] = useState("");

	const getImageName = (path?: string) => {
		if (!path) return "";
		const segments = path.split(/[\\/]/);
		return segments[segments.length - 1] ?? path;
	};

	// loads card data from backend and set it equal to cards
	useEffect(() => {
		fetch("http://localhost:5000/cards", { method: "GET" })
			.then((res) => res.json())
			.then((cards: CardType[]) => {
				console.log(cards);
				setCards(cards);
				console.log(cards);
			});
	}, []);

	// flushes the state variables for adding a card
	const flushData = () => {
		setTitle("");
		setCaption("");
		setImage(null);
		setContent("");
		setAddingCard(false);
		setEditingCard(null);
		setSelectedImageName("");
	};

	// handles setting image
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		setImage(e.target.files?.[0] ?? null);
		setSelectedImageName(getImageName(e.target.files?.[0]?.name)); // Update the selected image name when an image is chosen
	};

	const startEditingCard = (card: CardType) => {
		setAddingCard(false);
		setActiveCard(null);
		setEditingCard(card);
		setTitle(card.title);
		setCaption(card.caption);
		setContent(card.content);
		setImage(null);
		setSelectedImageName(getImageName(card.image));
	};

	const startAddingCard = () => {
		setActiveCard(null);
		setEditingCard(null);
		setTitle("");
		setCaption("");
		setContent("");
		setImage(null);
		setSelectedImageName("");
		setAddingCard(true);
	};

	// adds a card
	const addCard = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!image) {
			alert("Please select an image");
			return;
		}

		const formData = new FormData();
		formData.append("title", title);
		formData.append("caption", caption);
		formData.append("image", image);
		formData.append("content", content);

		try {
			const response = await fetch("http://127.0.0.1:5000/cards", {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Card added:", data);

				// Reload cards to show the new one
				const cardsResponse = await fetch(
					"http://127.0.0.1:5000/cards"
				);
				const updatedCards: CardType[] = await cardsResponse.json();
				setCards(updatedCards);

				flushData();
			} else {
				const error = await response.json();
				console.error("Error adding card:", error);
				alert(`Failed to add card: ${error.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error("Network error:", error);
			alert("Failed to add card. Please try again.");
		}
	};

	// edits a card
	const editCard = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!editingCard) {
			console.error("Edit requested without a selected card");
			return;
		}

		const formData = new FormData();
		formData.append("cardId", String(editingCard.cardId));
		formData.append("title", title);
		formData.append("caption", caption);
		formData.append("content", content);

		if (image) {
			formData.append("image", image);
		}

		try {
			const response = await fetch("http://127.0.0.1:5000/cards", {
				method: "PUT",
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				console.log("Card edited:", data);

				const cardsResponse = await fetch(
					"http://127.0.0.1:5000/cards"
				);
				const updatedCards: CardType[] = await cardsResponse.json();
				setCards(updatedCards);

				flushData();
			} else {
				const error = await response.json();
				console.error("Error editing card:", error);
				alert(`Failed to edit card: ${error.error || "Unknown error"}`);
			}
		} catch (error) {
			console.error("Network error:", error);
			alert("Failed to edit card. Please try again.");
		}
	};

	const handleOpenCard = (card: CardType) => {
		setActiveCard(card);
	};

	const deleteCard = async (cardId: string | number) => {
		try {
			const response = await fetch("http://127.0.0.1:5000/cards", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ cardId }),
			});
			if (response.ok) {
				setCards((prev) =>
					prev.filter((card) => card.cardId !== cardId)
				);
				setActiveCard((current) =>
					current && current.cardId === cardId ? null : current
				);
			} else {
				const error = await response.json();
				alert(
					`Failed to delete card: ${error.error || "Unknown error"}`
				);
			}
		} catch (error) {
			console.error("Network error:", error);
			alert("Failed to delete card. Please try again.");
		}
	};

	const now = new Date();
	const surpriseUnlockDate = new Date(now.getFullYear(), 10, 26, 0, 0, 0, 0);
	const surpriseUnlockTimestamp = surpriseUnlockDate.getTime();
	const isSurpriseUnlocked = Date.now() >= surpriseUnlockTimestamp;

	useEffect(() => {
		if (isSurpriseUnlocked) {
			setTimeUntilSurprise("");
			return;
		}

		const formatTimeUntil = (targetMs: number) => {
			const diff = targetMs - Date.now();
			if (diff <= 0) {
				return "";
			}
			const totalSeconds = Math.floor(diff / 1000);
			const days = Math.floor(totalSeconds / 86400);
			const hours = Math.floor((totalSeconds % 86400) / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = totalSeconds % 60;
			const parts: string[] = [];
			if (days) {
				parts.push(`${days}d`);
			}
			parts.push(`${hours.toString().padStart(2, "0")}h`);
			parts.push(`${minutes.toString().padStart(2, "0")}m`);
			parts.push(`${seconds.toString().padStart(2, "0")}s`);
			return parts.join(" ");
		};

		const updateCountdown = () => {
			setTimeUntilSurprise(formatTimeUntil(surpriseUnlockTimestamp));
		};

		updateCountdown();
		const timerId = window.setInterval(updateCountdown, 1000);
		return () => window.clearInterval(timerId);
	}, [isSurpriseUnlocked, surpriseUnlockTimestamp]);

	return (
		<div className="theme-app text-theme-ink">
			{activeCard != null && (
				<ExpandedCard
					card={activeCard}
					onClose={() => setActiveCard(null)}
				/>
			)}

			<div className="relative min-h-screen px-4 pb-24 sm:px-8">
				<div className="max-w-6xl mx-auto space-y-6 pt-10">
					<header className="flex flex-col gap-2">
						<h1 className="text-3xl font-semibold text-theme-ink">
							Our Memories Together ❤️
						</h1>
					</header>

					{addingCard && (
						<div className="z-50">
							<AddCardForm
								onSubmit={addCard}
								onCancel={flushData}
								onImageChange={handleImageChange}
								title={title}
								caption={caption}
								content={content}
								setTitle={setTitle}
								setCaption={setCaption}
								setContent={setContent}
								selectedImageName={selectedImageName}
							/>
						</div>
					)}

					{editingCard && (
						<div className="z-50">
							<EditCardForm
								onSubmit={editCard}
								onCancel={flushData}
								onImageChange={handleImageChange}
								title={title}
								caption={caption}
								content={content}
								setTitle={setTitle}
								setCaption={setCaption}
								setContent={setContent}
								selectedImageName={selectedImageName}
							/>
						</div>
					)}

					<div className="grid grid-cols-1 gap-8 py-8 card-grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
						{cards.map((card) => (
							<Card
								card={card}
								setActiveCard={handleOpenCard}
								onDelete={deleteCard}
								handleEdit={startEditingCard}
								key={card.cardId}
							/>
						))}
					</div>
				</div>

				<div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3 rounded-full items-center">
					{isSurpriseUnlocked ? (
						<Link
							to="/happybirthday"
							className="fab flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
							aria-label="Open the birthday surprise"
							title="Open the birthday surprise"
						>
							<span className="leading-none">🎁</span>
						</Link>
					) : (
						<>
							{!isSurpriseUnlocked && timeUntilSurprise && (
								<div className="countdown-pill">
									{timeUntilSurprise}
								</div>
							)}

							<button
								type="button"
								disabled
								className="fab flex h-14 w-14 items-center justify-center rounded-xl"
								aria-label="Birthday surprise unlocks on November 26"
								title="Available November 26"
							>
								<span className="leading-none">🔒</span>
							</button>
						</>
					)}
					<button
						type="button"
						onClick={startAddingCard}
						className="fab flex h-14 w-14 items-center justify-center rounded-full"
						aria-label="Create a new birthday card"
					>
						<span className="leading-none text-2xl">+</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Home;
