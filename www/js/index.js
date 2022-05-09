/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Finalized widget details 
 * @typedef {Object} WidgetDetails 
 * @property {string} description Widget description
 * @property {string} agreedPrice Agreed price, could be different from price returned from API
 * @property {string} id Widget id
 * @property {string} quantity Total quantity of widgets ordered
 */

let controller;

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized.
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    // Interface controller created
    controller = new InterfaceController()
}

function InterfaceController() {
    const baseUrl = 'http://<ENTER IP>/openstack/api';

    const mapController = new MapController();
    const widgetController = new WidgetController(baseUrl);
    const basketController = new BasketController(baseUrl);
    
    // FR1.2 Show next and previous widgets
    this.previousWidget = function () {
        console.log('Interaction: previous widget clicked');

        widgetController.showPreviousWidget();
    }
    
    // FR1.2 Show next and previous widgets
    this.nextWidget = function () {
        console.log('Interaction: next widget clicked');
        
        widgetController.showNextWidget();
    }
    
    this.beginOrder = function () {
        console.log('Interaction: begin order clicked')

        const userId = getInputValue('userId', '');
        const userPassword = getInputValue('userPassword', '');

        // FR1.1 Validating the OUCU starts with a letter and ends with a number
        const isFirstCharacterLetter = isLetter(userId.charAt(0));
        const isLastCharacterNumber = isNumber(userId.charAt(userId.length -1));

        if (!isFirstCharacterLetter || !isLastCharacterNumber) {
            alert('OUCU is invalid please confirm your details and try again.');
            return;
        }

        // FR1.2 display widget images, description and asking price.
        widgetController.getWidgets(userId, userPassword);
    }
    
    // FR1.3 Add displayed widget to the order items, including the quantity and agreed price
    this.addToOrder = function () {
        console.log('Interaction: add to order clicked')

        const selectedWidgetDetails = widgetController.getSelectedWidget();
        
        basketController.addWidgetToBasket(selectedWidgetDetails);
    }
        
    this.endOrder = function () {
        console.log('Interaction: end order clicked')
    }
}

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

function WidgetController(baseUrl) {
    const widgetsBaseUrl = `${baseUrl}/widgets`;

    let widgets = [];
    let currentSelectedWidgetIndex = 0;

    // FR1.2 display widget images, description and asking price.
    /**
     * @param {Object} widget widget object returned from widgets endpoint
     * @param {string} widget.url Image url source unencoded
     * @param {string} widget.description Description of item
     * @param {string} widget.pence_price Price in pence
     * @param {string} widget.id ID to be used for orders
     * @returns {void}
     */
    function setDisplayedWidget(widget) {
        $('#widgetImage').attr('src', widget.url);
        $('#widgetDescription').text(widget.description);
        $('#agreedWidgetPrice').val(Number(widget.pence_price) / 100);
    }

    // FR1.2 display widget images, description and asking price.
    /**
     * @param {userId} string users OUCU
     * @param {userPassword} string users password
     * @returns {void}
     */
    function getWidgets(userId, userPassword) {
        const url = `${widgetsBaseUrl}?OUCU=${userId}&password=${userPassword}`;

        function onSuccess({ data }) {
            console.log('Success: HTTP request successfully retrieved widgets.');

            widgets = data;

            setDisplayedWidget(data[0]);
        }

        function onError() {
            console.error('Err: HTTP request failed to get widgets.');
        }

        $.ajax(url, { type: "GET", success: onSuccess, error: onError });
    }

    // FR1.2 Show next and previous widgets
    /**
     * Increments the current selected widget number until
     * the last widget is shown and then returns to start of widget list
     */
    function showNextWidget() {
        const newSelectedWidgetIndex = currentSelectedWidgetIndex === widgets.length - 1
            ? 0
            : currentSelectedWidgetIndex + 1;
        
        setDisplayedWidget(widgets[newSelectedWidgetIndex])
        
        currentSelectedWidgetIndex = newSelectedWidgetIndex;
    }

    // FR1.2 Show next and previous widgets
    /**
     * Decrements the current selected widget number until
     * the first widget is shown and then jumps to end of widget list
     */
    function showPreviousWidget() {
        const newSelectedWidgetIndex = currentSelectedWidgetIndex === 0
            ? widgets.length - 1
            : currentSelectedWidgetIndex - 1;
        
        
        setDisplayedWidget(widgets[newSelectedWidgetIndex])
        
        currentSelectedWidgetIndex = newSelectedWidgetIndex;
    }

    // FR1.3 Add displayed widget to the order items, including the quantity and agreed price
    /**
     * @returns {...WidgetDetails} widgetDetails
     */
    function getSelectedWidget() {
        const selectedWidget = widgets[currentSelectedWidgetIndex];

        const quantity = getInputValue('widgetQuantity', '0');
        const agreedPrice = getInputValue('agreedWidgetPrice', Number(selectedWidget.pence_price)/100);

        return {
            description: selectedWidget.description,
            id: selectedWidget.id,
            agreedPrice,
            quantity
        }
    }

    this.getWidgets = getWidgets;

    this.showNextWidget = showNextWidget;
    
    this.showPreviousWidget = showPreviousWidget;

    this.getSelectedWidget = getSelectedWidget;
}

function BasketController(baseUrl) {
    // FR1.3 Add displayed widget to the order items, including the quantity and agreed price
    /**
     * @param {...WidgetDetails} widgetDetails
     */
    function addWidgetToBasket(widgetDetails) {
        console.log(widgetDetails)

        // TODO: add widget to UI
    }

    this.addWidgetToBasket = addWidgetToBasket;
}
