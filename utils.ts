import { worker, getStoreInstanceName } from './rootStore';

const sendData = (storeName: string, data: any) => {
	if (typeof window === 'undefined') return;
	worker.postMessage({
		type: storeName,
		data,
	});
};

export function observe(initVal?) {
	return function (target, propertyKey): any {
		if (!target.__state) {
			target.__state = {};
			Object.defineProperty(target, '__state', { enumerable: false });
		}
		target.__state[propertyKey] = initVal;
		return {
			set: function (value) {
				console.log(value);
				target.__state[propertyKey] = value;
				const storeName = getStoreInstanceName(target.constructor.name);
				sendData(storeName, target);
			},
			get: function() {
				return target.__state[propertyKey];
			},
			enumerable: true,
			configurable: true
		};
	}
}
