(function () {
    var observerConfig = {
        childList: true,
        subtree: true
    };

    var processAndAddTwictureButton = function (actions, tweet) {

        var scaleFactor = 2;

        var twictureDiv = document.createElement("div");
        twictureDiv.classList.add("twicture_this");
        twictureDiv.classList.add("ProfileTweet-action");
        twictureDiv.innerHTML = '<button class="ProfileTweet-actionButton u-textUserColorHover js-actionButton js-tooltip" title="Twicture this!" data-modal="ProfileTweet-Twicture" type="button"><div class="IconContainer"><span class="Icon Icon--arrowDown"></span><span class="u-hiddenVisually">Twicture</span></div><span style="font-size: 0.8em; padding-left: 4px; vertical-align: 2px;">Twicture</span></button>';

        var promoDiv = document.createElement("div");
        promoDiv.classList.add("powered_by_twicture");
        promoDiv.classList.add("ProfileTweet-action");
        promoDiv.style["width"] = "200px";
        promoDiv.style["display"] = "none";
        promoDiv.innerHTML = '<button class="ProfileTweet-actionButton u-textUserColorHover js-actionButton js-tooltip" style="padding: 0;" title="Powered by Twicture!" data-modal="ProfileTweet-Twicture" type="button"><div class="IconContainer"><span class="u-hiddenVisually">Powered by Twicture</span></div><span style="font-size: 0.8em; vertical-align: 2px;">Powered by Twicture</span></button>';

        var powered_in_gallery_selector = ".ProfileTweet-actionList > div.powered_by_twicture",
            temporarily_hidden_selector = ".ProfileTweet-actionList > div:not(.powered_by_twicture), iframe";

        twictureDiv.onclick = function (e) {
            e.preventDefault();
            tweet.querySelector(powered_in_gallery_selector).style["display"] = "inline-block";
            Array.prototype.slice.call(tweet.querySelectorAll(temporarily_hidden_selector)).forEach(function (el) {
                el.style["display"] = "none";
            });
            html2canvas(tweet, {
                onrendered: function (canvas) {
                    tweet.classList.add("twicturing");
                    Array.prototype.slice.call(tweet.querySelectorAll(temporarily_hidden_selector)).forEach(function (el) {
                        el.style["display"] = "inline-block";
                    });
                    tweet.querySelector(powered_in_gallery_selector).style["display"] = "none";
                    canvas.toBlobHD(function (blob) {
                        saveAs(blob, tweet.id + '.png');
                        tweet.classList.remove("twicturing");
                    }, 'image/png', 1);
                },
                useCORS: true
            });
        };

        actions.insertBefore(twictureDiv, actions.childNodes[0]);
        actions.insertBefore(promoDiv, actions.childNodes[0]);
    };

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            Array.prototype.slice.call(mutation.addedNodes).forEach(function (addedNode) {
                //console.log(addedNode);
                if (addedNode.querySelectorAll) {
                    var tweets = addedNode.querySelectorAll("[data-item-type='tweet']:not(.twictured),.Gallery-content,.permalink-tweet:not(.twictured)");
                    if (tweets.length) {
                        Array.prototype.slice.call(tweets).forEach(function (tweet) {
                            if (tweet.classList.contains("Gallery-content")) {
                                var galleryObserver = new MutationObserver(function (mutations) {
                                    mutations.forEach(function (mutation) {
                                        Array.prototype.slice.call(mutation.addedNodes).forEach(function (addedNode) {
                                            if (addedNode.querySelectorAll) {
                                                var actions = addedNode.querySelector(".ProfileTweet-actionList");
                                                if (actions && !actions.querySelector(".twicture_this")) {
                                                    processAndAddTwictureButton(actions, document.querySelector(".Gallery-content"));
                                                }
                                            }
                                        });
                                    });
                                });

                                galleryObserver.observe(tweet, observerConfig);
                            }
                            else {
                                var actions = tweet.querySelector(".ProfileTweet-actionList");
                                if (actions && !actions.querySelector(".twicture_this")) {
                                    processAndAddTwictureButton(actions, tweet);
                                }
                            }
                            tweet.classList.add("twictured");
                        });
                    }
                    else if (addedNode.dataset.itemType == "tweet") {
                        var actions = addedNode.querySelector(".ProfileTweet-actionList");
                        if (actions && !actions.querySelector(".twicture_this")) {
                            processAndAddTwictureButton(actions, addedNode);
                            addedNode.classList.add("twictured");
                        }
                    }
                }
            });
        });
    });

    var targetNode = document;
    observer.observe(targetNode, observerConfig);
}());