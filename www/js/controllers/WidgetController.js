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

        if (userId && userPassword) {
            const url = `${widgetsBaseUrl}?OUCU=${userId}&password=${userPassword}`;

            function onSuccess({ data, status, message }) {
                if (status === 'success') {
                    console.log('Success: HTTP request successfully retrieved widgets.');
        
                    widgets = data;
        
                    setDisplayedWidget(data[0]);
                } else {
                    alert('Error: ' + message)
                }
            }

            function onError() {
                console.error('Error: HTTP request failed to get widgets.');
            }

            $.ajax(url, { type: "GET", success: onSuccess, error: onError });
        }
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

        const quantity = getInputValue('widgetQuantity', '1');
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
