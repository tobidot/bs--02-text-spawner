import { KeyboardController, KeyboardHandler } from "../../library";
import { Controller } from "../../library/abstract/mvc/Controller";
import { ControllerResponse } from "../../library/abstract/mvc/Response";
import { Entity } from "../models/Entity";
import { GameModel } from "../models/GameModel";
import { GameView } from "../views/GameView";

export class GameController implements Controller, KeyboardController {

    public constructor(
        public model: GameModel,
    ) {
    }

    /**
     * Start a new game
     */
    public newGame(): ControllerResponse {
        this.model.entities = [];
        this.model.current_text = "Press Enter";
        return null;
    }

    public isGameOver(): boolean {
        return false;
    }

    public update(delta_seconds: number): ControllerResponse {
        this.model.update(delta_seconds);
        return null;
    }

    public onKeyDown(event: KeyboardEvent) {
    }

    public break() {
        const font_width = this.model.context.measureText("_").width;
        // split all entities into single characters
        this.model.entities = this.model.entities
            .reduce(
                (sum: Array<Entity>, entity: Entity) => {
                    if (entity.label.length == 1) {
                        return sum.concat(entity);
                    }
                    return sum.concat(
                        entity.label.split("").map(
                            (char: string, index:number) => {
                                const new_entity = this.model.createEntity(char);
                                new_entity.hitbox.center.y = entity.hitbox.center.y;
                                new_entity.hitbox.center.x = entity.hitbox.left + font_width * index + font_width / 2;
                                return new_entity;
                            }
                        )
                    );
                }, []
            );
    }

    public onKeyUp(event: KeyboardEvent) {
        if (event.key == "d" && event.ctrlKey) {
            this.model.debug = !this.model.debug;
        }
        if (event.key == "b" && event.ctrlKey) {
            this.break();
        }
        if (event.key == "r" && event.ctrlKey) {
            this.newGame();
        }
        if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key.match(/^[a-zA-Z0-9]$/)) {
            this.model.current_text += event.key;
        }
        if (event.key === "Backspace") {
            this.model.current_text = this.model.current_text.slice(0, -1);
        }
        if (event.key === "Enter") {
            const entity = this.model.createEntity(this.model.current_text);
            if (entity.hitbox.w > 799) {
                this.break();
            }
            this.model.current_text = "";
        }
    }
}