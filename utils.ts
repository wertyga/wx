export function observe(initVal?) {
	return function (target, name): any {
		target[`__${name}`] = initVal;
		return {
			set: function (value) {
				this[`__${name}`] = value;
				if (this.updateState) {
					this.updateState(this);
				}
			},
			get: function() {
				return this[`__${name}`];
			},
			enumerable: true,
			configurable: true
		};
	}
}
