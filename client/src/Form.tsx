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
			className="flex flex-col gap-5 bg-gray-50 rounded-xl border border-gray-200 p-8 max-w-sm mx-auto shadow"
		>
			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
				required
				className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:outline-none text-base bg-white"
			/>
			<input
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
				placeholder="Caption"
				required
				className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:outline-none text-base bg-white"
			/>
			<label className="flex items-center gap-3 px-4 py-2 rounded-md border border-gray-300 bg-white cursor-pointer w-fit hover:border-indigo-400 transition">
				<span className="text-gray-600 text-base">Choose image</span>
				<input
					type="file"
					onChange={onImageChange}
					accept="image/*"
					required
					className="hidden"
				/>
			</label>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Content"
				required
				className="px-4 py-2 rounded-md border border-gray-300 focus:border-indigo-400 focus:outline-none text-base bg-white min-h-[80px] resize-vertical"
			/>
			<div className="flex gap-3 justify-end">
				<button
					type="submit"
					className="px-4 py-2 rounded-md"
				>
					Add Card
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}

export default AddCardForm;
