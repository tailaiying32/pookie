import type { FormEvent, ChangeEvent } from "react";

interface EditCardFormProps {
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onCancel: () => void;
	onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
	title: string;
	caption: string;
	content: string;
	setTitle: (value: string) => void;
	setCaption: (value: string) => void;
	setContent: (value: string) => void;
	selectedImageName: string;
}

function EditCardForm({
	onSubmit,
	onCancel,
	onImageChange,
	title,
	caption,
	content,
	setTitle,
	setCaption,
	setContent,
	selectedImageName,
}: EditCardFormProps) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-25"
			onClick={onCancel}
		>
			<form
				onSubmit={onSubmit}
				className="flex flex-col gap-5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8 max-w-sm w-full shadow"
				onClick={(e) => e.stopPropagation()}
			>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
					required
					className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:border-indigo-400 focus:outline-none text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
				/>
				<input
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
					placeholder="Caption"
					required
					className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:border-indigo-400 focus:outline-none text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
				/>
				<label className="flex items-center gap-3 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer w-fit hover:border-indigo-400 dark:hover:border-indigo-400 transition">
					<span className="text-gray-600 dark:text-gray-300 text-base">
						{selectedImageName
							? selectedImageName
							: "Choose image (optional)"}
					</span>
					<input
						type="file"
						onChange={onImageChange}
						accept="image/*"
						className="hidden"
					/>
				</label>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Selecting a new file replaces the current image. Leave blank
					to keep it.
				</p>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Content"
					required
					className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:border-indigo-400 focus:outline-none text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 min-h-20 resize-vertical"
				/>
				<div className="flex gap-3 justify-end">
					<button
						type="submit"
						className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
					>
						Edit Card
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export default EditCardForm;
