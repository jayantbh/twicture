/*global MutationObserver, html2canvas, saveAs*/
(function () {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            Array.prototype.slice.call(mutation.addedNodes).forEach(function (addedNode) {
                if (addedNode.querySelectorAll) {
                    var tweets = addedNode.querySelectorAll("[data-item-type='tweet']:not(.twictured)");
                    if(tweets.length) {
                        //console.log(tweets);
                        Array.prototype.slice.call(tweets).forEach(function (tweet) {
                            var actions = tweet.querySelector(".ProfileTweet-actionList");
                            if(actions){
                                console.log(actions);
                            }
                            if(actions){
                                console.log("DOM'd it!");
                                var twictureDiv = document.createElement("div");
                                twictureDiv.classList.add("twicture_this");
                                twictureDiv.classList.add("ProfileTweet-action");
                                twictureDiv.innerHTML = '<button class="ProfileTweet-actionButton u-textUserColorHover js-actionButton js-tooltip" title="Twicture this!" data-modal="ProfileTweet-Twicture" type="button"><div class="IconContainer"><span class="Icon Icon--arrowDown"></span><span class="u-hiddenVisually">Twicture</span></div><span style="font-size: 0.8em; padding-left: 4px; vertical-align: 2px;">Twicture</span></button>';

                                twictureDiv.onclick = function () {
                                    html2canvas(document.getElementById(tweet.id), {
                                        onrendered: function (canvas) {
                                            tweet.classList.add("twicturing");
                                            canvas.toBlob(function (blob) {
                                                saveAs(blob, tweet.id + '.png');
                                                tweet.classList.remove("twicturing");
                                            }, 'image/png', 1);
                                        }
                                    });
                                };

                                actions.insertBefore(twictureDiv,actions.childNodes[0]);
                            }
                            tweet.classList.add("twictured");
                        });
                    }
                }
                //addedNode
            });
        });
    });

    var observerConfig = {
        childList: true,
        subtree: true
    };

    var targetNode = document;
    observer.observe(targetNode, observerConfig);
}());