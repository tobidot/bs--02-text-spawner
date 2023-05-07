export interface KeyboardController {
    onKeyDown(event: KeyboardEvent): void;
    onKeyUp(event: KeyboardEvent): void;
}

export class KeyboardHandler {
    constructor(
        public app: HTMLElement,
        public controller_callback: () => KeyboardController
    ) {
    }

    public init() {
        this.app.addEventListener("keydown", this.onKeyDown);
        this.app.addEventListener("keyup", this.onKeyUp);
    }

    protected onKeyDown = (event: KeyboardEvent) => {
        this.controller_callback().onKeyDown(event);
    }

    protected onKeyUp = (event: KeyboardEvent) => {
        this.controller_callback().onKeyUp(event);
    }
}