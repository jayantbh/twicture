/**
 * Created by jayantbhawal on 28/11/15.
 */
(function () {
    'use strict';
    chrome.webRequest.onHeadersReceived.addListener(function (response) {
        response.responseHeaders.push({name: 'Access-Control-Allow-Origin', value: '*'});
        return {responseHeaders: response.responseHeaders};
    }, {urls: ["*://*.twimg.com/*"]}, ["blocking", "responseHeaders"]);
}());