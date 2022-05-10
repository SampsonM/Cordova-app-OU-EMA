/**
 * @typedef {Object} loginDetails Login details of user
 * @property {string} loginDetails.userId The user id entered typically OUCU
 * @property {string} loginDetails.userPassword The un-encrypted user password
 */

function ClientController(baseUrl) {
    const clientBaseUrl = `${baseUrl}/clients`;

    function displayClientDetails(client) {
        $('#clientName').text(client.name);
        $('#clientAddress').text(client.address);
    }
    
    // FR1 get client details
    /**
     * @param {userId} string users OUCU
     * @param {userPassword} string users password
     * @returns {void}
     */
    function getClientDetails(userId, userPassword) {
        const clientId = getInputValue('clientId', '1');

        if (clientId) {
            const url = `${clientBaseUrl}/${clientId}?OUCU=${userId}&password=${userPassword}`;

            function onSuccess({ data, status, message }) {
                if (status === 'success') {
                    console.log('Success: HTTP request successfully retrieved client details.');
        
                    displayClientDetails(data[0]);
                } else {
                    displayClientDetails({ name: 'Client name not found', address: 'Client address not found' })
                    
                    const errorMessage = message || data[0].reason;
                    alert('Error: ' + errorMessage)
                }
            }

            function onError() {
                console.error('Error: HTTP request failed to get client details.');
            }

            $.ajax(url, { type: "GET", success: onSuccess, error: onError });
        } else {
            alert('Error: no client id provided.')
        }
    }

    /**
     * @returns {loginDetails}
     */
    function getLoginDetails() {
        const userId = getInputValue('userId', 'zy278920');
        const userPassword = getInputValue('userPassword', 'b4bQeKJB');

        // FR1.1 Validating the OUCU starts with a letter and ends with a number
        const isFirstCharacterLetter = isLetter(userId.charAt(0));
        const isLastCharacterNumber = isNumber(userId.charAt(userId.length -1));

        if (!isFirstCharacterLetter || !isLastCharacterNumber) {
            alert('OUCU is invalid please confirm your details and try again.');
            return {};
        } else {
            return { userId, userPassword }
        }
    }

    this.getLoginDetails = getLoginDetails;

    this.getClientDetails = getClientDetails;
}
