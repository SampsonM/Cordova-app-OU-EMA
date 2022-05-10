function MapController() {
    // Obtain the device location and centre the map
    function centreMap() {
        // This is implemented for you and no further work is needed on it

        function onSuccess(position) {
            console.log("Obtained position", position);
            var point = {
                lng: position.coords.longitude,
                lat: position.coords.latitude,
            };
            map.setCenter(point);
        }

        function onError(error) {
            console.error("Error calling getCurrentPosition", error);

            // Inform the user that an error occurred
            alert("Error obtaining location, please try again.");
        }

        // Note: This can take some time to callback or may never callback,
        //       if permissions are not set correctly on the phone/emulator/browser
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true,
        });
    }

    // HERE Maps code, based on:
    // https://developer.here.com/documentation/maps/3.1.19.2/dev_guide/topics/map-controls-ui.html
    // https://developer.here.com/documentation/maps/3.1.19.2/dev_guide/topics/map-events.html

    // Initialize the platform object:
    const platform = new H.service.Platform({
        apikey: "lHVHhCggznrYVKAuoH_-1-qYQQJj3ewnCESmVN7lXQU",
    });

    // Obtain the default map types from the platform object:
    const defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    const map = new H.Map(
        document.getElementById("mapContainer"),
        defaultLayers.vector.normal.map,
        {
            zoom: 15,
            center: { lat: 52.5, lng: 13.4 },
        }
    );

    // Create the default UI:
    const ui = H.ui.UI.createDefault(map, defaultLayers);
    const mapSettings = ui.getControl("mapsettings");
    const zoom = ui.getControl("zoom");
    const scalebar = ui.getControl("scalebar");
    mapSettings.setAlignment("top-left");
    zoom.setAlignment("top-left");
    scalebar.setAlignment("top-left");
    
    // Enable the event system on the map instance:
    const mapEvents = new H.mapevents.MapEvents(map);
    
    // Instantiate the default behavior, providing the mapEvents object:
    new H.mapevents.Behavior(mapEvents);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 28px; height: 28px; margin: -14px 0 0 -14px;" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="red" opacity=".5"/>
        <circle cx="50" cy="50" r="4" fill="black"/>
        </svg>`;

    const mapMarkerIcon = new H.map.DomIcon(svg);
    
    centreMap();
}
