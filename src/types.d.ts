export interface State {
	keyDownHandlers: Object,
	keyHeldHandlers: Object,
	keyUpHandlers: Object,
	initialize: () => void,
	update: (delta: number) => void,
	render: (tx: Texture) => void,
};

export interface Engine {
	viewport: Texture,
	stateStack: Array<State>,
	pushState: (state: State) => void,
	render: (tx: Texture) => void
};

export interface Texture {
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
};

export interface MenuButton {
	text: string,
	selected: boolean,
};

export interface Menu {
	items: Array<MenuButton>,
	verticalSeparation: number,
	selectedIdx: number,
};

export interface KeyboardCallbacks {
	down: () => void,
	held: () => void,
	up: () => void,
};

export interface Keyboard {
	register: (key: string, callbacks: Array<KeyboardCallbacks>) => void,
};
