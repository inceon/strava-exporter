import {SVG} from "pixi-svg";
import {Container} from "pixi.js";

export default class SuperSVG extends Container {
    private _svg: SVG;

    constructor(svgCode: string) {
        super();
        this._svg = new SVG(svgCode);
        this._svg.interactive = true;
        this._svg.cursor = 'pointer';
        this._svg.on('pointerdown', () => {
            console.log('text3')
        });
        this.addChild(this._svg);

        this.name = 'SuperSVG';
    }
}