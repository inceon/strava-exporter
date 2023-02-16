import {Container, Text, TextStyle} from "pixi.js";

export default class TextField extends Container {
    private defaultStyle: TextStyle = new TextStyle({
        fontFamily: 'conthrax-sb',
        fill: 'white',
        dropShadow: true,
        dropShadowDistance: 2,
        dropShadowBlur: 2,
        dropShadowAlpha: 0.6,
        dropShadowColor: 'gray'
    });
    public label: Text;
    public value: Text;

    constructor(label: string, value: string) {
        super();
        this.label = new Text(label, this.defaultStyle);
        this.value = new Text(value, this.defaultStyle);
        this.value.y = this.label.height - 5;
        this.addChild(this.label, this.value);
    }

    setStyleProperties(newProperties: {fill?:string, fontSize?: number}) {
        Object.assign(this.label.style, newProperties);
        Object.assign(this.value.style, newProperties);
    }
}