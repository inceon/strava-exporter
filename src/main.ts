import * as PIXI from "pixi.js";
import StravaClient from "./StravaClient";
import ImageGenerator from "./ImageGenerator";
//@ts-ignore
window.PIXI = PIXI;


let imageGenerator = new ImageGenerator();
let client = new StravaClient();

client.getActivities().then(data => {
    let svgContainer = client.createSVGContainer(0);
    imageGenerator.addPath(svgContainer);
})