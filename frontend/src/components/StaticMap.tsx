import React from "react";
import '../App.css';
const API_KEY = 'AIzaSyAgB4kpNS6VLRoA2Vk0a15EFU_H9PpXaI8'

export default function StaticMap({ polyline }) {
    const mapUrl: string = encodeURI(`https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=enc:${polyline}&key=${API_KEY}`);
    return(
        <div>
            {<img src={mapUrl} alt="Static Map" />}
        </div>
    )
}