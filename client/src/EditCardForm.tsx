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

import { useRef } from "react";

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
	const mouseDownInside = useRef(false);
	const formRef = useRef<HTMLFormElement>(null);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target instanceof Node && formRef.current?.contains(e.target)) {
			mouseDownInside.current = true;
		} else {
			mouseDownInside.current = false;
		}
	};

	const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
		if (
			!mouseDownInside.current &&
			!(e.target instanceof Node && formRef.current?.contains(e.target))
		) {
			onCancel();
		}
		mouseDownInside.current = false;
	};

	return (
		<div
			className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			<form
				ref={formRef}
				onSubmit={onSubmit}
				className="panel flex flex-col gap-5 p-8 max-w-sm w-full"
				onClick={(e) => e.stopPropagation()}
			>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
					required
					className="form-field"
				/>
				<input
					type="date"
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
					placeholder="Date"
					required
					className="form-field"
				/>
				<label className="form-file cursor-pointer">
					<span>
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
				<p className="text-sm text-theme-muted">
					Selecting a new file replaces the current image. Leave blank
					to keep it.
				</p>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Content"
					required
					className="form-field min-h-20 resize-vertical"
				/>
				<div className="flex gap-3 justify-end">
					<button type="submit" className="btn-primary">
						Edit Card
					</button>
					<button
						type="button"
						onClick={onCancel}
						className="btn-ghost"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export default EditCardForm;
