export const initWebWorker = worker => {
	if (typeof window === 'undefined') return () => ({} as Worker);
	const code = worker.toString();
	const blob = new Blob(['(' + code + ')()']);
	return new Worker(URL.createObjectURL(blob));
};
