chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
            switch(request.requestType) {
                    case 'openNewTab':
                            chrome.tabs.create({
                                index: 100000000, //last
                                url:request.linkURL
                            });
                            break;
                    case 'getLocalStorage':
                            sendResponse(localStorage);
                            break;
                    case 'saveLocalStorage':
                            for (var key in request.data) {
                                    localStorage.setItem(key,request.data[key]);
                            }
                            localStorage.setItem('importedFromForeground',true);
                            sendResponse(localStorage);
                            break;
                    case 'localStorage':
                            switch (request.operation) {
                                    case 'getItem':
                                            sendResponse({status: true, value: localStorage.getItem(request.itemName)});
                                            break;
                                    case 'removeItem':
                                            localStorage.removeItem(request.itemName);
                                            sendResponse({status: true, value: null});
                                            break;
                                    case 'setItem':
                                            localStorage.setItem(request.itemName, request.itemValue);
                                            sendResponse({status: true, value: null});
                                            break;
                            }
                            break;
                    default:
                            sendResponse({status: "unrecognized request type"});
            }
    }
);