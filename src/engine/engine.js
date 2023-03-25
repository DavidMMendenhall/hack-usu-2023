import {Keyboard} from "./input.js";
import {Texture} from "./render.js";
import {State} from "./state.js";

const enginePrototype = {
	/**
	 * Push a state to the state stack
	 *
	 * @param {State} state
	 */
	pushState(state) {
		let topState = null;
		if (this.stateStack.length != 0) {
			topState = this.stateStack[this.stateStack.length - 1];
		}
	  
		state.parentState = topState;
		state.engine = this;
		state.quit = false;
		state.returnValue = null;

		state.initialize();

		this.stateStack.push(state);
	},

	/**
	 * Get the top state from the state stack
	 */
	getState() {
		return this.stateStack[this.stateStack.length - 1];
	},

	/**
	 * Pop the top state from the state stack
	 */
	popState() {
		return this.stateStack.pop().returnValue;
	},

	/**
	 * Starts running the game loop.
	 */
	start() {
		this.previousTimestamp = performance.now();
		this.keyboard = Keyboard();

		this.quit = false;
		this.stateStack = [];
		this.initialize();

		requestAnimationFrame((ts) => this.gameLoop(ts));
	},

  processInput(delta) {
		this.getState()?.processInput(delta);
  },

	/**
	 * Overridable function to update the gamestate every frame
	 *
	 * @param {number} delta
	 */
	update(delta) {
		this.getState()?.update(delta);
		while (this.getState()?.quit) {
			let ret = this.popState();
			if (ret != undefined) {
				this.getState()?.passValue?.(ret);
			}
		}
	},

	/**
	 * Overridable function to render the state of the game
	 */
	render() {
		this.viewport.ctx.clearRect(
			0, 0, 
			this.viewport.canvas.width, this.viewport.canvas.height
		);

		this.getState()?.render(this.viewport);
	},

	/**
	 * Runs one iteration of the game loop.
	 *
	 * @param {number} ts - The current timestamp
	 */
  gameLoop(ts) {
    this.currentTimestamp = ts;
    let delta = this.currentTimestamp - this.previousTimestamp;
		this.processInput(delta);
		this.update(delta);

		this.render();

		this.previousTimestamp = this.currentTimestamp;

		if (!this.quit) {
			requestAnimationFrame((ts) =>	this.gameLoop(ts));
		}
  },
}

function Engine(spec) {
  if (!spec.viewportId) {
		console.error("Engine initialization requires base viewport texture.");
		return null;
	}

  if (!spec.initialState) {
		console.error("Engine initialization requires initial state.");
		return null;
	}

	return {
		__proto__: enginePrototype,
		initialize() {
			this.viewport = new Texture(spec.viewportId);
			this.pushState(spec.initialState);
		},
	};
}

export { Engine };
