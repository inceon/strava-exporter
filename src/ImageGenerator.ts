import {Application, BaseTexture, Container, Graphics, Point, Sprite, Texture} from "pixi.js";
import SuperSVG from "./SuperSVG";
import Utils from "./utils";
import TextField from "./TextField";

var FontFaceObserver = require('fontfaceobserver');

export default class ImageGenerator {
    private application: Application;
    private container: Container;
    private svgElement: SuperSVG;
    private _appSizes: Size = {
        width: window.innerWidth - 20,
        height: window.innerHeight - 100
    };
    private sceneScale: number;
    private ratio: Size = {
        width: 9,
        height: 19.5
    }

    constructor() {
        this.adaptSizes();
        this.createApplication();
        this.createMainContainer();
        this.loadFonts();
    }

    protected adaptSizes(): void {
        let neededSize: Size = {
            width: 390,
            height: 845
        }

        if(neededSize.width < this._appSizes.width || neededSize.height < this._appSizes.height) {
            this._appSizes.width = neededSize.width;
            this._appSizes.height = neededSize.height;
        }

        this.sceneScale = Math.min(
            this._appSizes.width / neededSize.width,
            this.appSizes.height / neededSize.height
        ) - 0.02;
    }

    protected createApplication(): void {
        let view = document.querySelector(
            "#canvas-container canvas"
        ) as HTMLCanvasElement;

        this.application = new Application({
            view: view,
            backgroundColor: 0xefefff,
            width: this._appSizes.width * this.sceneScale,
            height: this._appSizes.height * this.sceneScale,
            antialias: false
            // resolution: window.devicePixelRatio || 1
        });

        this.application.stage.scale.set(this.sceneScale);
    }

    get appSizes(): Size {
        return this._appSizes;
    }

    protected createMainContainer(): void {
        this.container = new Container();
        this.container.name = 'main';
        this.application.stage.addChild(this.container);
    }

    protected loadFonts(): void {
        var font = new FontFaceObserver('conthrax-sb');

        font.load().then(function () {
            console.log('conthrax-sb has loaded.');
        });
    }

    public addPath(elem: SuperSVG) {
        let bounds = elem.getBounds();
        let padding = 50;
        elem.width = this._appSizes.width - padding*2;
        elem.scale.y = elem.scale.x;
        elem.position.x = -bounds.x * elem.scale.x + padding;
        elem.position.y = -bounds.y * elem.scale.y + padding + this._appSizes.height/3 - (bounds.height/2*elem.scale.y);
        this.container.addChild(elem);

        this.svgElement = elem;
    }

    public addText(label: string, value: string, position?: Point): TextField {
        let textElement = new TextField(label, value);
        if(position) {
            textElement.position.copyFrom(position);
        }
        this.container.addChild(textElement);
        return textElement;
    }

    public addImage(image: string | ArrayBuffer | null) {

        const base = new BaseTexture(image);
        base.on('loaded', () => {
            const texture = new Texture(base);
            const sprite = new Sprite(texture);
            sprite.name = "background";
            sprite.height = this._appSizes.height;
            sprite.scale.x = sprite.scale.y;
            sprite.position.x = -sprite.width / 2 + this._appSizes.width / 2;

            this.svgElement.colorFilter.color = Utils.getAverageColor(this.application, sprite);
            if(this.container.getChildAt(0).name == "background") {
                this.container.removeChildAt(0);
            }
            this.container.addChildAt(sprite, 0);
            this.addFadeToImage();
            this.addBottomGradient();
        });

    }

    protected addFadeToImage(): void {
        let fade = new Graphics();
        fade.beginFill(0x000000);
        fade.drawRect(0,0,1,1);
        fade.endFill();
        fade.width = this.container.width;
        fade.height = this.container.height;
        fade.alpha = 0.2;
        this.container.addChildAt(fade, 1);
    }

    protected addBottomGradient(): void {
        let fadeTexture = Utils.createGradTexture({
            colors: [{color: 'rgba(0,0,0,0)', pos: 0}, {color: 'rgba(0,0,0,0)', pos: 0.7}, {color: '#000', pos: 1}]
        });
        let fade = new Sprite(fadeTexture);
        fade.rotation = Math.PI / 2;
        fade.anchor.y = 0.5;
        let size = Math.max(this.container.width, this.container.height);
        fade.height = size;
        fade.width = size;
        this.container.addChildAt(fade, 2);
    }

    public export() {
        // Get a reference to the renderer
        const renderer = this.application.renderer;
        // Create a base64-encoded image from the stage
        return renderer.extract.base64(this.container);
    }
}

type Size = {
    width: number
    height: number
}