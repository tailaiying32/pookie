const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const getDateInstance = (value?: string | null): Date | null => {
	if (!value) {
		return null;
	}

	if (ISO_DATE_REGEX.test(value)) {
		const [year, month, day] = value.split("-").map(Number);
		const date = new Date(year, (month ?? 1) - 1, day ?? 1);
		if (Number.isNaN(date.getTime())) {
			return null;
		}
		date.setHours(0, 0, 0, 0);
		return date;
	}

	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export function toDateInputValue(value?: string | null): string {
	const parsed = getDateInstance(value);
	if (!parsed) {
		return "";
	}

	return parsed.toISOString().slice(0, 10);
}

export function ensureIsoDateString(value?: string | null): string | null {
	const normalized = toDateInputValue(value);
	return normalized || null;
}

export function isValidIsoDateString(value?: string | null): value is string {
	if (!value || !ISO_DATE_REGEX.test(value)) {
		return false;
	}

	const parsed = getDateInstance(value);
	if (!parsed) {
		return false;
	}

	return value === parsed.toISOString().slice(0, 10);
}

export function formatCaptionDate(
	value?: string | null,
	locale?: string
): string {
	if (!value) {
		return "";
	}

	const parsed = getDateInstance(value);
	if (!parsed) {
		return value;
	}

	return parsed.toLocaleDateString(locale ?? undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
