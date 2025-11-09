import type { FormEvent, ChangeEvent } from "react";

interface FormProps {
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onCancel: () => void;
	onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
	title: string;
	caption: string;
	content: string;
	setTitle: (value: string) => void;
	setCaption: (value: string) => void;
	setContent: (value: string) => void;
}

function AddCardForm({
	onSubmit,
	onCancel,
	onImageChange,
	title,
	caption,
	content,
	setTitle,
	setCaption,
	setContent,
}: FormProps) {
	return (
		<form
			onSubmit={onSubmit}
			className="flex flex-col space-y-6 shadow p-6"
		>
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
				required
			/>
			<input
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
				placeholder="Caption"
				required
			/>
			<input
				type="file"
				onChange={onImageChange}
				accept="image/*"
				required
			/>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Content"
				required
			/>
			<div className="flex space-x-2">
				<button type="submit">Add Card</button>
				<button type="button" onClick={onCancel}>
					Cancel
				</button>
			</div>
		</form>
	);
}

export default AddCardForm;
