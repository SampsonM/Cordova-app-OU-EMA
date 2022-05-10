function InterfaceController() {
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
        console.log('Interaction: begin order clicked');

        const { userId, userPassword } = clientController.getLoginDetails();

        if (userId, userPassword) {
            clientController.getClientDetails(userId, userPassword);
    
            // FR1.2 display widget images, description and asking price.
            widgetController.getWidgets(userId, userPassword);
        }
    }
    
    // FR1.3 Add displayed widget to the order items, including the quantity and agreed price
    this.addToOrder = function () {
        console.log('Interaction: add to order clicked');

        const selectedWidgetDetails = widgetController.getSelectedWidget();

        orderController.addWidgetToOrder(selectedWidgetDetails);
    }
        
    // FR1.5 Order is saved to web service
    this.endOrder = function () {
        console.log('Interaction: end order clicked');
        
        // TODO: get user details, pass into save order function

        const { userId, userPassword } = clientController.getLoginDetails();

        if (userId, userPassword) {
            orderController.placeOrder(userId, userPassword);
        }
    }
}
