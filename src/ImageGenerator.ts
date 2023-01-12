import {Application, Container} from "pixi.js";
import SuperSVG from "./SuperSVG";

export default class ImageGenerator {
    private application: Application;
    private container: Container;
    private appSizes: Size = {
        width: window.innerWidth - 20,
        height: window.innerHeight - 20
    };
    private ratio: Size = {
        width: 9,
        height: 19.5
    }

    constructor() {
        this.createApplication();
        this.createMainContainer();
        this.loadFonts();
    }

    protected createApplication(): void {
        let view = document.querySelector(
            "#canvas-container canvas"
        ) as HTMLCanvasElement;

        this.application = new Application({
            view: view,
            backgroundColor: 0xefefff,
            width: this.appSizes.width,
            height: this.appSizes.height,
            antialias: false
            // resolution: window.devicePixelRatio || 1
        })
    }

    protected createMainContainer(): void {
        this.container = new Container();
        this.container.name = 'main';
        this.application.stage.addChild(this.container);
    }

    protected loadFonts(): void {

    }

    public addPath(elem: SuperSVG) {
        let bounds = elem.getBounds();
        let padding = 20;
        elem.width = this.appSizes.width - padding*2;
        elem.scale.y = elem.scale.x;
        elem.position.x = -bounds.x * elem.scale.x + padding;
        elem.position.y = -bounds.y * elem.scale.y + padding + this.appSizes.height/3 - (bounds.height/2*elem.scale.y);
        this.container.addChild(elem);
    }
}

type Size = {
    width: number
    height: number
}