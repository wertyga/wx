import { worker, getStoreInstanceName, getSetProp } from './rootStore';

const sendData = (storeName: string, data: any) => {
	if (typeof window === 'undefined') return;
	worker.postMessage({
		type: storeName,
		data,
	});
};

function defineProp(name: string, value: any) {
	if (!this[getSetProp]) this[getSetProp] = {};
	if (!this[getSetProp][name]) this[getSetProp][name] = value;
}

export function observe(defaultValue?: any) {
	return function (target, propertyKey): any {
		return {
			set: function(value) {
				defineProp.call(this, propertyKey, defaultValue);
				this[getSetProp][propertyKey] = value;
				const storeName = getStoreInstanceName(target.constructor.name);
				sendData(storeName, target);
			},
			get: function() {
				defineProp.call(this, propertyKey, defaultValue);
				return this[getSetProp][propertyKey];
			},
			enumerable: true,
			configurable: true
		};
	}
}
