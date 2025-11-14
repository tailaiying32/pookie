export interface CardType {
	cardId: string | number;
	title: string;
	caption: string; // ISO date string (YYYY-MM-DD) or legacy text
	content: string;
	image?: string;
}
