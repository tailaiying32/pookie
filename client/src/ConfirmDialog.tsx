import type { ReactNode } from "react";

interface ConfirmDialogProps {
	open: boolean;
	title: string;
	message: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

function ConfirmDialog({
	open,
	title,
	message,
	onConfirm,
	onCancel,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
}: ConfirmDialogProps) {
	if (!open) {
		return null;
	}

	return (
		<div
			className="modal-overlay fixed inset-0 z-50 flex items-center justify-center"
			style={{ cursor: "default" }}
			onClick={onCancel}
		>
			<div
				className="panel panel-solid max-w-sm w-full p-6 flex flex-col gap-4"
				onClick={(event) => event.stopPropagation()}
			>
				<div>
					<h2 className="text-xl font-semibold text-theme-ink mb-1">
						{title}
					</h2>
					<div className="text-theme-muted text-base leading-relaxed">
						{message}
					</div>
				</div>
				<div className="flex justify-end gap-3">
					<button
						type="button"
						className="btn-ghost"
						onClick={onCancel}
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						className="btn-danger"
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmDialog;
