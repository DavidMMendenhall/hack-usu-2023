import "./input.js";

const statePrototype = {
	registerKey(key, callbacks) {
		if (callbacks == undefined) {
			return false;
		}

		if (typeof callbacks["down"] == "function" && !this.keyDownHandlers.hasOwnProperty(key)) {
			this.keyDownHandlers[key] = callbacks["down"];
		}

		if (typeof callbacks["held"] == "function" && !this.keyHeldHandlers.hasOwnProperty(key)) {
			this.keyHeldHandlers[key] = callbacks["held"];
		}

		if (typeof callbacks["up"] == "function" && !this.keyUpHandlers.hasOwnProperty(key)) {
			this.keyUpHandlers[key] = callbacks["up"];
		}

		return true;
	},

	registerKeys(keys, callbacks) {
		for (const key of keys) {
			this.registerKey(key, callbacks);
		}
	},

	deregisterKey(key) {
		if (!this.keyDownHandlers.hasOwnProperty(key)) {
			delete this.keyDownHandlers[key];
		}
	},

	deregisterAll() {
		this.keyDownHandlers = {};
		this.keyHeldHandlers = {};
		this.keyUpHandlers = {};
	},

	start() {
		this.keyboard = Keyboard();
		this.quit = true;
		initialize();
	},

	processInput(delta) {
		this.engine.keyboard.update(this, delta);
	}
};

function State(spec) {
	spec.__proto__ = statePrototype;
	spec.keyDownHandlers = {};
	spec.keyHeldHandlers = {};
	spec.keyUpHandlers = {};

	return spec;
};

export { State };
