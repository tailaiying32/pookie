import { useEffect, useMemo, useState } from "react";

type GalleryCard = {
	id: string;
	title: string;
	caption: string;
	description: string;
};

type InspectState = {
	id: string;
	flipped: boolean;
};

const galleryCards: GalleryCard[] = Array.from({ length: 12 }, (_, index) => {
	const photoNumber = index + 1;
	return {
		id: `gallery-${photoNumber}`,
		title: `Snapshot ${photoNumber}`,
		caption: "Click to relive this moment.",
		description:
			"Add a story about where this photo was taken, who was there, or why it matters. Flip the card for bonus notes.",
	};
});

function Gallery() {
	return <></>;
}

export default Gallery;
