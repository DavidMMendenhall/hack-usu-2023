const keyboardPrototype = {
  update(state, delta) {
    for (const key of this.pressed) {
      state.keyDownHandlers[key]?.(delta);
    }

    for (const key of this.held) {
			state.keyHeldHandlers[key]?.(delta);
    }

    for (const key of this.released) {
			state.keyUpHandlers[key]?.(delta);
    }

    this.pressed.clear();
    this.released.clear();
  },
};

function Keyboard() {
  let keyboard = {
    __proto__: keyboardPrototype,
		handlers: [],
    pressed: new Set(),
    held: new Set(),
    released: new Set(),
  };

  window.addEventListener("keydown", e => {
    keyboard.pressed.add(e.key);
    keyboard.held.add(e.key);
  });

  window.addEventListener("keyup", e => {
    keyboard.held.delete(e.key);
    keyboard.released.add(e.key);
  });

  return keyboard;
}

export { Keyboard };
