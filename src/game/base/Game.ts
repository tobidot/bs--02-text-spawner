import { GameController } from "../controllers/GameController";
import { GameModel } from "../models/GameModel";
import { GameView } from "../views/GameView";
import * as tgt from "../../library/index";

export class Game {

    public controller: GameController;
    public view: GameView;
    public model: GameModel;
    public last_time_ms: number = 0;
    public on_game_finished: null|(() => void) = null;

    public constructor(app: HTMLElement) {
        const canvas = tgt.getElementByQuerySelector(app, "canvas", HTMLCanvasElement);
        const context = canvas.getContext("2d");
        tgt.assertNotNull(context, "No 2d context found");
        this.view = new GameView(context);
        this.model = new GameModel();
        this.controller = new GameController(this.model);
    }

    protected update(delta_ms: number) {
        this.controller.update(delta_ms);
        this.view.update(delta_ms);
        this.view.render(this.model);
    }

    protected onFrame = (timestamp_ms: number) =>  {
        this.update(timestamp_ms - this.last_time_ms);
        this.last_time_ms = timestamp_ms;
        if (this.controller.isGameOver()) {
            if(this.on_game_finished) this.on_game_finished();
        } else {
            requestAnimationFrame(this.onFrame);
        }
    }

    public async run() {
        return new Promise<void>((resolve, reject) => {
            this.on_game_finished = resolve;
            this.controller.newGame();
            requestAnimationFrame(this.onFrame);
        });
    }
}