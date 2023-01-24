
//mapboxgl.accessToken = 'pk.eyJ1IjoibWFzdGVybWluZDk5IiwiYSI6ImNsY3k5NjgwMTA2ZG8zem8xN29hdGI2ZzIifQ.Fytfe7PcGdiFiHAb80BHtA';

//CODE FROM mapboxDisplay
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    //center: [-74.5, 40], // starting position [lng, lat]
    center: campgrounded.geometry.coordinates,
    zoom: 9, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campgrounded.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${campgrounded.title}</h3> <p>${campgrounded.location}</p>`)
    )
    .addTo(map)


map.addControl(new mapboxgl.NavigationControl(), 'bottom-left'); //ADDS ZOOM IN/ZOOM OUT CONTROL FEATURE
