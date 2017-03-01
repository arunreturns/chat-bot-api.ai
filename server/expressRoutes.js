module.exports = function(restService) {
    const fs = require('fs');
    
    function getQuoteDetails(quoteID, res){
        var quoteDetails = JSON.parse(fs.readFileSync('./data/quoteDetails.json'));
        console.log("The quote details are ", quoteDetails);
        var status;
        for ( var i = 0; i < quoteDetails.length; i++ ){
            var quote = quoteDetails[i];
            console.log("The Quote ID is ", quote.quoteID);
            if ( String(quote.quoteID) === quoteID ){
                status = quote.status;
                break;
            }
        }
        
        var statusValue = status ? "I got the status <" + status + "> for the quote ID " + quoteID : "Sorry I couldn't find the status for the quote ID " + quoteID;
        return res.json({
            speech: statusValue,
            displayText: statusValue,
            source: 'Sales Chat'
        });
    }
    
    function getAllQuoteDetails(res){
        var quoteDetails = JSON.parse(fs.readFileSync('./quoteDetails.json'));
        
        var quoteDets = "";
        for ( var i = 0; i < quoteDetails.length; i++ ){
            var quote = quoteDetails[i];
            console.log("The Quote ID is ", quote.quoteID);
            quoteDets += "Quote ID: " + quote.quoteID + " => " + quote.status + "\n";
        }
        
        var statusValue = "Here are the list of all the quotes \n" + quoteDets;
        return res.json({
            speech: statusValue,
            displayText: statusValue,
            source: 'Sales Chat'
        });
    }
    
    
    function getStatus(quoteID, res, action){
        console.log("Calling action ", action);
        switch ( action ){
            case "getQuoteDetails":
                if ( typeof quoteID === "undefined" || quoteID === "" ){
                    return res.json({
                        speech: "Sorry I am not yet smart enough to do that",
                        displayText: "Sorry I am not yet smart enough to do that",
                        source: 'Sales Chat'
                    });
                }
                getQuoteDetails(quoteID, res);
                break;
            case "getAllQuoteDetails":
                getAllQuoteDetails(res);
                break;
        }
        
    }
    
    restService.post('/hook', function (req, res) {
        console.log('hook request');
        try {
            var speech = 'empty speech';
    
            if (req.body) {
                var requestBody = req.body;
    
                if (requestBody.result) {
                    speech = '';
                    console.dir(requestBody.result);
                    if (requestBody.result.fulfillment) {
                        speech += requestBody.result.fulfillment.speech;
                        speech += ' ';
                    }
    
                    if (requestBody.result.action) {
                        speech += 'action: ' + requestBody.result.action;
                    }
                }
            }
    
            console.log('result: ', speech);
            getStatus(requestBody.result.parameters.Quote, res, requestBody.result.action);
            
        } catch (err) {
            console.error("Can't process request", err);
    
            return res.status(400).json({
                status: {
                    code: 400,
                    errorType: err.message
                }
            });
        }
    });
};