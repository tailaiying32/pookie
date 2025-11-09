import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import Form from "./Form.tsx";
import Card from "./Card.tsx";
import ExpandedCard from "./ExpandedCard.tsx";

function Home() {
	const [cards, setCards] = useState<any[]>([]);
	const [addingCard, setAddingCard] = useState(false);
	const [activeCard, setActiveCard] = useState(null);

	// state variables for add card menu
	const [title, setTitle] = useState("");
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [content, setContent] = useState("");

	// loads card data from backend and set it equal to cards
	useEffect(() => {
		fetch("http://localhost:5000/cards", { method: "GET" })
			.then((res) => res.json())
			.then((cards) => {
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
		setAddingCard(false); // Also close the form
	};

	// handles setting image
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		setImage(e.target.files?.[0] ?? null);
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
				const updatedCards = await cardsResponse.json();
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

	return (
		<>
			{activeCard != null && (
				<ExpandedCard
					card={activeCard}
					onClose={() => setActiveCard(null)}
				/>
			)}

			<div className="space-y-6">
				<h1 className="text-2xl items-center">hi pookie!!!</h1>
				{addingCard || (
					<button onClick={() => setAddingCard(true)}>
						Add card
					</button>
				)}
				{addingCard && (
					<div className="z-50">
						<Form
							onSubmit={addCard}
							onCancel={flushData}
							onImageChange={handleImageChange}
							title={title}
							caption={caption}
							content={content}
							setTitle={setTitle}
							setCaption={setCaption}
							setContent={setContent}
						/>
					</div>
				)}
				<div className="card-grid">
					{cards.slice(0, 18).map((card) => (
						<Card
							setActiveCard={() => {
								setActiveCard(card);
								console.log(activeCard);
							}}
							card={card}
							key={card.cardId}
						/>
					))}
				</div>
			</div>
		</>
	);
}

export default Home;
