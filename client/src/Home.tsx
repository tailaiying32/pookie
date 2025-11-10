import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Card from "./Card";
import ExpandedCard from "./ExpandedCard";
import type { CardType } from "./CardType";
import AddCardForm from "./AddCardForm";
import EditCardForm from "./EditCardForm";
import { Link } from "react-router-dom";

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

	return (
		<>
			{/* the expanded card */}
			{activeCard != null && (
				<ExpandedCard
					card={activeCard}
					onClose={() => setActiveCard(null)}
				/>
			)}

			<div className="space-y-6">
				<h1 className="text-2xl items-center">yipeeee</h1>

				{/* button group */}
				<div className="flex space-x-2">
					<button onClick={() => setAddingCard(true)}>
						Add card
					</button>
					<button>
						{" "}
						<Link to="/happybirthday">Click For Surprise!</Link>
					</button>
				</div>

				{/* add card form */}
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

				{/* edit card form */}
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

				{/* card grid */}
				<div className="card-grid">
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
		</>
	);
}

export default Home;
