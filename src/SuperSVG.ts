import {SVG} from "pixi-svg";
import {Container} from "pixi.js";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";
import {ColorOverlayFilter} from "@pixi/filter-color-overlay";

export default class SuperSVG extends Container {
    private _svg: SVG;
    public shadowFilter: DropShadowFilter;
    public colorFilter: ColorOverlayFilter;

    constructor(svgCode: string) {
        super();
        this._svg = new SVG(svgCode);
        this.addChild(this._svg);

        this.name = 'SuperSVG';

        this.createShadow();
        this.createColor();
        this.filters = [this.shadowFilter, this.colorFilter];

    }

    protected createShadow(): void {
        this.shadowFilter = new DropShadowFilter();
        this.shadowFilter.blur = 3;
        this.shadowFilter.distance = 4;
        this.shadowFilter.alpha = 0.8;
    }

    protected createColor(): void {
        this.colorFilter = new ColorOverlayFilter();
        this.colorFilter.color = 0xffdeab
    }
}
