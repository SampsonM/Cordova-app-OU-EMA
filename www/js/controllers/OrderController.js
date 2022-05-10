function OrderController(baseUrl) {
    const orderBaseUrl = `${baseUrl}/orders`;

    const order = [];

    // FR1.4 Display the sum of ordered items including 20% VAT
    function updateSumOfOrder() {
        const subtotal = order.reduce((subtotal, cur) => {
            const itemTotal = Number(Number(cur.agreedPrice * cur.quantity).toFixed(2));
            return subtotal + itemTotal;
        }, 0)

        const VAT = Number((subtotal/100) * 20).toFixed(2);
        const total = subtotal + Number(VAT);

        $('#subtotal').text(`${subtotal} GBP`)
        $('#vat').text(`${VAT} GBP`)
        $('#total').text(`${total} GBP`)
    }

    // FR1.3 Add displayed widget to the order items, including the quantity and agreed price
    /**
     * @param {...WidgetDetails} widgetDetails
     */
    function addWidgetToOrder(widgetDetails) {
        if (widgetDetails) {
            const description = widgetDetails.description;
            const quantity = widgetDetails.quantity;
            const agreedPrice = widgetDetails.agreedPrice;

            order.push(widgetDetails);

            $('#orderDetails > tbody:last-child').append(`<tr><td>${description}</td><td>${quantity}</td><td>${agreedPrice} GBP</td></tr>`)

            // FR1.4 Display the sum of ordered items
            updateSumOfOrder();
        } else {
            alert('Error: No widget selected');
        }
    }

    /**
     * @param {userId} string users OUCU
     * @param {userPassword} string users password
     * @returns {void}
     */
    function placeOrder(userId, userPassword) {
        // TODO place order
        // OUCU=userId
        // password=userPassword
        // client_id=1
        // latitude=89
        // longitude=-20
    }

    this.addWidgetToOrder = addWidgetToOrder;

    this.placeOrder = placeOrder;
}
