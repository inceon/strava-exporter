import {Application, Container, DisplayObject, Sprite, Texture, utils} from "pixi.js";

export default class Utils {
    /**
     * @param application
     * @param sprite
     */
    public static getAverageColor(application: Application, sprite: Sprite): number {
        let pixels: Uint8Array = application.renderer.extract.pixels(sprite);
        let r = 0;
        let g = 0;
        let b = 0;
        for(let i = 0; i < pixels.length; i+=4) {
            r += pixels[i];
            g += pixels[i+1];
            b += pixels[i+2];
        }
        return utils.rgb2hex([
            1 - (r / (pixels.length / 4) / 255) * 0.1,
            1 - (g / (pixels.length / 4) / 255) * 0.1,
            1 - (b / (pixels.length / 4) / 255) * 0.1
        ]);
    }

    public static createGradTexture(options: GradientOptions = {}): Texture {
        const {
            quality = 256,
            colors = [{color: 'white', pos: 0}, {color: 'black', pos: 1}],
            x0 = 0,
            y0 = 0,
            x1 = quality,
            y1 = 0,
        } = options;

        const canvas = document.createElement('canvas');
        canvas.width = quality;
        canvas.height = 1;

        const ctx = canvas.getContext('2d');

        const grd = ctx.createLinearGradient(x0, y0, x1, y1);

        colors.forEach(({color, pos}) => grd.addColorStop(pos, color));

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, quality, 1);

        return Texture.from(canvas);
    }

    static makeDraggable(object: DisplayObject) {
        object.interactive = true;
        object.cursor = 'pointer';
        object.on('pointerdown', Utils.onDragStart);
    }

    private static dragTarget: DisplayObject;

    private static onDragMove(event: any) {
        if (Utils.dragTarget) {
            Utils.dragTarget.parent.toLocal(event.data.global, null, Utils.dragTarget.position);
        }
    }

    private static onDragStart(event: any) {
        Utils.dragTarget = event.currentTarget as DisplayObject;
        Utils.dragTarget.alpha = 0.5;
        event.currentTarget.parent.on('pointermove', Utils.onDragMove);
    }

    static enableDragOnStage(stage: Container) {
        stage.interactive = true;
        stage.on('pointerup', Utils.onDragEnd);
        stage.on('pointerupoutside', Utils.onDragEnd);
    }

    private static onDragEnd() {
        if (Utils.dragTarget) {
            Utils.dragTarget.parent.off('pointermove', Utils.onDragMove);
            Utils.dragTarget.alpha = 1;
            Utils.dragTarget = null;
        }
    }

    public static getDistanceString(meters: number): string {
        // Convert meters to kilometers and meters
        const km = Math.floor(meters / 1000);
        const m = meters % 1000;

        // Build the distance string
        let distanceString = "";
        if (km > 0) {
            distanceString += km.toString();
        }
        if (m > 0) {
            if(km < 1) {
                distanceString += m.toString() + " m";
            } else {
                distanceString += "." + Math.floor(m/10).toString() +" km";
            }
        }

        // Return the distance string
        return distanceString;
    }

    public static getSpeedString(mps: number): string {
        // Convert meters per second to kilometers per minute
        const kpm = mps * 60 / 1000;

        // Convert kilometers per minute to minutes per kilometer
        const mpk = 1 / kpm;

        // Format the speed as a string with minutes and seconds
        const minutes = Math.floor(mpk);
        const seconds = Math.round((mpk - minutes) * 60);
        const speedString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} /km`;

        // Return the speed string
        return speedString;
    }

    public static formatTime(seconds: number): string {
        // Calculate the number of hours, minutes, and seconds
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        // Format the time as a string
        const timeString = [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0")
        ].join(":");

        // Return the formatted time string
        return timeString;
    }
}

interface ColorStop {
    color: string;
    pos: number;
}

interface GradientOptions {
    quality?: number;
    colors?: ColorStop[];
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
}