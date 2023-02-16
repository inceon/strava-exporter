import {Strava, SummaryActivity} from "strava";
import * as polyline from '@mapbox/polyline';
import * as L from 'leaflet';
import vectorTileLayer from 'leaflet-vector-tile-layer';
import tempActivities from "./utils/temp-activities";

export default class StravaClient {
    private strava: Strava;
    public activities: SummaryActivity[];

    constructor() {
    }

    async getActivities(): Promise<SummaryActivity[]> {
        try {
            // @ts-ignore
            return new Promise((resolve) => {
                resolve(tempActivities)
            }).then((data: SummaryActivity[]) => {
                this.activities = data;
                return data;
            })
            // return await strava.activities.getLoggedInAthleteActivities();
        } catch (error) {
            console.log(error)
        }
    }

    public getMapHTMLElement() {
        let element = document.createElement('div');
        document.body.appendChild(element);
        element.style.width = '500px';
        element.style.height = '500px';

        // a litle bit magic
        setTimeout(() => {
            element.style.display = 'none';
        }, 100);

        return element;
    }

    public getSVGPolygon(summaryPolyline: string, style: SVGStyle) {
        let mapElement = this.getMapHTMLElement()
        let renderer = L.svg({ padding: 0.5 });
        let map = L.map(mapElement, {
            renderer
        }).setView([51.505, -0.09], 13);

        let api_key = 'jlhyZHM6QFnbT64Ax2Ju';
        let key = 'pk.eyJ1IjoiaW5jZW9uIiwiYSI6ImNqa2xoMW5veTBiejkzcXRocHprNjhsOW8ifQ.nxH75xRKmDD2pmfKNRTncw';
        // L.maplibreGL({
        //     attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        //     style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${api_key}`
        // }).addTo(map);
        const tileLayer = vectorTileLayer(
            'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.mvt?style=mapbox://styles/inceon/cld91iet4000701pq1kxhv4aj@1674555161838&access_token='+key,
            {
                style: {
                    weight: 0.4
                },
                featureToLayer: function(){},
                filter: (el)=>{
                    return el.type != 1 && el.type != 3;
                }
            }
        );
        tileLayer.addTo(map);
        let decoded = polyline.decode(summaryPolyline)
        // console.log(polyline.toGeoJSON(this.activities[style.id].map.summary_polyline));

        var polyline2 = L.polyline(decoded, {
            color: style.color,
            weight: style.stroke,
            renderer
        }).addTo(map);

        map.fitBounds(polyline2.getBounds());
        return renderer.getPane().getElementsByTagName('svg')[0];
    }
}


type SVGStyle = {
    stroke: number;
    color: string;
}