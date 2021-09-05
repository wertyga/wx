export const webWorker = () => {
	self.addEventListener('message', e => {
		self.postMessage(e.data, null);
	});
};
