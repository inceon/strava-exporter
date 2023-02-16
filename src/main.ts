import * as PIXI from "pixi.js";
import {Point} from "pixi.js";
import StravaClient from "./StravaClient";
import ImageGenerator from "./ImageGenerator";
import tempImage from "./utils/temp-image";
import SuperSVG from "./SuperSVG";
import {SummaryActivity} from "strava";
import Utils from "./utils";
import TextField from "./TextField";
//@ts-ignore
window.PIXI = PIXI;


let imageGenerator = new ImageGenerator();
let client = new StravaClient();

client.getActivities()
    .then(data => new Promise(resolve => setTimeout(resolve, 1000, data)))
    .then((data: SummaryActivity[]) => data[0])
    .then((track: SummaryActivity) => {
        let svgPolygon = client.getSVGPolygon(track.map.summary_polyline,{
            color: 'white',
            stroke: 5
        });
        let svgElement = new SuperSVG(svgPolygon);
        imageGenerator.addPath(svgElement);

        return track;
    })
    .then((track: SummaryActivity) => {
        let name: string = track.name;
        let distance: number = track.distance;
        let speed: number = track.average_speed;
        let time: number = track.moving_time;

        function setFontSize(textField: TextField, labelSize, valueSize) {
            textField.label.style.fontSize = labelSize;
            textField.value.style.fontSize = valueSize;
        }

        let distanceTextField = imageGenerator.addText(
            'Distance',
            Utils.getDistanceString(distance)
        );

        let distanceTextPosition: Point = new Point(
            20,
            imageGenerator.appSizes.height - distanceTextField.height - 20
        );
        distanceTextField.position.copyFrom(distanceTextPosition);

        let timeTextfield = imageGenerator.addText(
            "Time",
            Utils.formatTime(time)
        )

        let timeTextPosition: Point = new Point(
            imageGenerator.appSizes.width/2 - timeTextfield.width/2 + 35,
            imageGenerator.appSizes.height - timeTextfield.height - 20
        );
        timeTextfield.position.copyFrom(timeTextPosition);

        let paceTextfield = imageGenerator.addText(
            "Pace",
            Utils.getSpeedString(speed)
        );

        let paceTextPosition: Point = new Point(
            imageGenerator.appSizes.width - paceTextfield.width + 45,
            imageGenerator.appSizes.height - paceTextfield.height - 20
        );
        paceTextfield.position.copyFrom(paceTextPosition);

        setFontSize(distanceTextField, 18, 15);
        setFontSize(paceTextfield, 18, 15);
        setFontSize(timeTextfield, 18, 15);

        distanceTextField.value.alpha = 0.8;
        paceTextfield.value.alpha = 0.8;
        timeTextfield.value.alpha = 0.8;


        Utils.makeDraggable(distanceTextField);
        Utils.makeDraggable(paceTextfield);
        Utils.makeDraggable(timeTextfield);

        Utils.enableDragOnStage(distanceTextField.parent);

        let nameTextfield = imageGenerator.addText(
            '',
            name,
            new Point(19, imageGenerator.appSizes.height - 170)
        );
        Utils.makeDraggable(nameTextfield);

    })
    .then(_ => {
        imageGenerator.addImage(tempImage);
    });


const reader = new FileReader();
const fileInput = document.getElementById("file");
reader.onload = (e:ProgressEvent<FileReader>) => {
    imageGenerator.addImage(e.target.result);
}
fileInput.addEventListener('change', (event: Event) => {
    const f = (<HTMLInputElement>event.target).files[0];
    reader.readAsDataURL(f);
})

const exportButton = document.getElementById("export");
exportButton.addEventListener('click', _ => {
    const image = imageGenerator.export();
    image.then(res => {
        // Create a link element with the image data as the href
        const link = document.createElement('a');
        link.href = res;
        let date = new Date();
        let name = date.toLocaleString('en-US')
        link.download = name + ' Running.png'; // Set the download filename

        // Click the link to prompt the user to download the image
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
})