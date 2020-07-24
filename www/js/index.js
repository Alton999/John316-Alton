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
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
    },
};

app.initialize();

window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var timeout_ids = [];

// Pagecreate will fire for each of the pages in this demo
// but we only need to bind once so we use "one()"
$( document ).one( "pagecreate", ".scene", function() {

    // Constants
    const AVATAR_ID = [
        "young-girl",
        "young-boy",
        "working-woman",
        "working-man",
        "family-woman",
        "family-man",
        "old-woman",
        "old-man",
        "army-boy"
    ];

    const AVATAR_PICKER_SEQUENCE = [
        "young-girl__standing",
        "young-boy__standing",
        "working-woman__standing",
        "working-man__standing",
        "family-woman__standing",
        "family-man__standing",
        "old-woman__standing",
        "old-man__standing",
        "army-boy__standing"
    ];
    const DEFAULT_AVATAR_SELECTION = AVATAR_PICKER_SEQUENCE[0];

    // Global state
    window.speaker = { avatar: null, name: null };
    window.listener = { avatar: null, name: null };

    // Handler for navigating to the next page
    function navnext( next ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#" + next, {
            allowSamePageTransition: true,
            transition: "none"
        });
    }

    // Handler for navigating to the previous page
    function navprev( prev ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", "#" + prev, {
            allowSamePageTransition: true,
            transition: "none",
            reverse: true
        });
    }

    function setupStage(currScene, prevScene, nextScene) {
        var theStage = $( ".stage" );

        theStage.jqmData("prev", prevScene);
        theStage.jqmData("next", nextScene);

        theStage
            .addClass(currScene)
            .toggleClass("hide", hideStage(currScene))
            .find(".avatar, .npc, .prop")
            .each(function (i, child) {
                var _hideForScene = hideForScene($(child), currScene);

                $(child)
                    .addClass(currScene)
                    .toggleClass("hide", _hideForScene);

                if (_hideForScene) { return; }

                animateForScene($(child), currScene);
            });
    }

    function animateForScene(thing, scene) {
        var avatarType = thing.attr("id"),
            avatarId = thing.jqmData("avatar-id");

        var walkingData = animation[scene][avatarType]["walking"];
        if (walkingData) {
            var avatar = $( "#" + avatarType),
                avatarWalkingClass = avatarId + "__walking";

            avatar.addClass(avatarWalkingClass);

            // resets for the next scene
            setTimeout(function() { avatar.removeClass(avatarWalkingClass); }, 1000);
        }

        var heartColorData = animation[scene][avatarType]["color"];
        if (heartColorData) {
            thing
                .removeClass("pink white")
                .addClass(heartColorData);
        }
    }

    function tearDownStage(prevScene) {
        var theStage = $( ".stage" );

        theStage.jqmRemoveData("prev");
        theStage.jqmRemoveData("next");

        theStage
            .removeClass(prevScene)
            .find(".avatar, .npc, .prop")
            .each(function (i, child) {
                $(child).removeClass(prevScene);
            });
    }

    function hideStage(scene) {
        return animation[scene] === null ||
            animation[scene] === undefined;
    }

    function hideForScene(thing, scene) {
        return animation[scene] === null ||
            animation[scene] === undefined ||
            !hasAnimationDataForScene(thing, scene);
    }

    function hasAnimationDataForScene(thing, scene) {
        return Object
            .keys(animation[scene])
            .some(function (key) {
                return key === thing.attr("id");
            });
    }

    function currentAvatar(scene, value) {
        if (value) {
            return scene
                .find(".avatar-picker")
                .jqmData("currentAvatar", value);
        }
        return scene
                .find(".avatar-picker")
                .jqmData("currentAvatar") || DEFAULT_AVATAR_SELECTION;
    }

    function moveAvatarPickerSequencePointerBy(scene, number) {
        var _currentAvatar = currentAvatar(scene);
        var currentIndex = AVATAR_PICKER_SEQUENCE.indexOf(_currentAvatar);
        var total = AVATAR_PICKER_SEQUENCE.length;

        return AVATAR_PICKER_SEQUENCE[(total + currentIndex + number) % total];
    }

    function goNextAvatar(event) {
        return event.target.classList.contains("arrow--image__right") ||
            event.target.classList.contains("arrow__right");
    }

    function goPreviousAvatar(event) {
        return event.target.classList.contains("arrow--image__left") ||
            event.target.classList.contains("arrow__left");
    }

    function currentAvatarIndex(scene) {
        var _currentAvatar = currentAvatar(scene);
        return AVATAR_PICKER_SEQUENCE.indexOf(_currentAvatar);
    }

    function updateNavigationDot(scene) {
        scene.find(".carousel .navigation .dot.selected")
            .removeClass("selected");

        var selectedDotIndex = currentAvatarIndex(scene) + 1;
        scene.find(".carousel .navigation .dot:nth-child(" + selectedDotIndex + ")")
            .addClass("selected");
    }

    function updateAvatarPicker(scene, event) {
        var newPreviousAvatar,
            oldPreviousAvatar,
            newNextAvatar,
            oldNextAvatar,
            newCurrentAvatar,
            oldCurrentAvatar;

        if (goNextAvatar(event)) {
            newPreviousAvatar = moveAvatarPickerSequencePointerBy(scene, 0);
            newCurrentAvatar = moveAvatarPickerSequencePointerBy(scene, 1);
            newNextAvatar = moveAvatarPickerSequencePointerBy(scene, 2);

            oldPreviousAvatar = moveAvatarPickerSequencePointerBy(scene, -1);
            oldCurrentAvatar = newPreviousAvatar;
            oldNextAvatar = newCurrentAvatar;
        } else if (goPreviousAvatar(event)) {
            oldPreviousAvatar = moveAvatarPickerSequencePointerBy(scene, -1);
            oldCurrentAvatar = moveAvatarPickerSequencePointerBy(scene, 0);
            oldNextAvatar = moveAvatarPickerSequencePointerBy(scene, 1);

            newPreviousAvatar = moveAvatarPickerSequencePointerBy(scene, -2);
            newCurrentAvatar = oldPreviousAvatar;
            newNextAvatar = oldCurrentAvatar;
        }

        scene.find(".avatar__previous .avatar--image")
            .removeClass(oldPreviousAvatar)
            .addClass(newPreviousAvatar);

        scene.find(".avatar__current .avatar--image")
            .removeClass(oldCurrentAvatar)
            .addClass(newCurrentAvatar);

        scene.find(".avatar__next .avatar--image")
            .removeClass(oldNextAvatar)
            .addClass(newNextAvatar);

        currentAvatar(scene, newCurrentAvatar);
    }

    function updateLocalizedContent() {


        $(".i18next")
            .each(function (i, elem) {
                var key = $(elem).data("i18next-key"),
                    localizedString = i18next.t(key),
                    targetType = $(elem).data("i18next-target-type"),
                    targetValue = $(elem).data("i18next-target-value");

                if (targetType && targetValue) {
                    return $(elem)[targetType](targetValue, localizedString);
                }
                return $(elem).html(localizedString);
            });
    }

    function setSelectedLanguage(menu) {
        var theHeader = menu.find("h2");

        if (theHeader.find("#selected-language").length > 0) { return; }

        theHeader.append(
            "<div class='selected-language-container'>" +
                "<a id='selected-language'>English</a>" +
                "<div class='selected-language--icon'></div>" +
            "</div>"
        );
    }

    function setLocalizedLanguageHeader(menu) {
        var theHeader = menu.find("h2");

        theHeader
            .find("a")
            .first()
            .addClass("i18next")
            .data("i18next-key", "scene-0-1-language");
    }

    function isAndroidOs() {
    	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    	if (/android/i.test(userAgent)) {
    		return true;
		} else {
			return false;
		}
    }


    function removeMovement() {
        $("#listener").removeClass("walk-right move-left-listener move-up-listener");
        $("#speaker").removeClass("move-left-speaker move-up-speaker");
        $("#jesus").removeClass("move-left-jesus move-up-jesus");
        $("#bg-door-opened").removeClass("bg-move-up");
        $("#scrolling-bg").removeClass("start-scrolling");
        for (var i = 0; i < timeout_ids.length; i++) {
            clearTimeout(timeout_ids[i]);
        }
    }

    $(document).on('pageshow', '#scene-2-0', function(){
        setTimeout(function() {
            $('#scene-2-0 .content .text').removeClass('hide');
        }, 2000);
    });

    $(document).on('pagehide', '#scene-2-0', function(){
        $('#scene-2-0 .content .text').addClass('hide');
    });

    function toggleConfettiFireworks(scene) {
        if ( scene == "scene-11-0" || scene == "scene-11-1" ) {
            $('.confetti-fireworks-container').removeClass('hide');
        } else {
            $('.confetti-fireworks-container').addClass('hide');
        }
    }

    $(document).on("pageshow", "#scene-0-0-2", function(){
        // PDF //
        /*const target = "_blank";
        const url = "./pdfs/" + i18next.language + ".pdf";
        const options = "location=no,toolbarposition=top,closebuttoncaption=Close";
        var inAppBrowserRef = cordova.InAppBrowser.open(url, target, options);
        inAppBrowserRef.addEventListener('exit', function() { window.open("index.html"); });*/

        // Images //
        var tutorialObj = {
            "de":8,
            "en":6,
            "ru":7,
            "sv":6,
            "th":6,
            "zh-Hans":6,
            "zh-Hant":6,
            "zh-HK":7,
            "ko":9
        }
        
        var maxNum = tutorialObj[i18next.language];
        var htmlString = '';
        for (var i=1; i <= maxNum; i++) {
            htmlString += "<img src=tutorial/"+i18next.language+"/" + i + ".png>";
        }
        $("#tutorial-wrapper").html(htmlString);
    });

	// Move character to left then up
	$(document).on('pageshow', '#scene-10-0', function(){
        var character_listener = document.getElementById('listener');
        var character_speaker = document.getElementById('speaker');
        var character_jesus = document.getElementById('jesus');
        var bg_door_opened = document.getElementById('bg-door-opened');
        var bg_page = document.getElementById('scrolling-bg');
        requestAnimationFrame(function(timestamp){
            var walk_right_timeout = setTimeout(function() {
                character_listener.className += " walk-right";
            }, 0);
            timeout_ids.push(walk_right_timeout);

            var move_left_timeout = setTimeout(function() {
                character_listener.className += " move-left-listener";
                character_speaker.className += " move-left-speaker";
                character_jesus.className += " move-left-jesus";

                var move_up_timeout = setTimeout(function() {
                    character_listener.className += " move-up-listener";
                    character_speaker.className += " move-up-speaker";
                    character_jesus.className += " move-up-jesus";
                    bg_door_opened.className += " bg-move-up";
                    bg_page.className += "start-scrolling";

                }, 1100);
                timeout_ids.push(move_up_timeout);

            }, 2600);
            timeout_ids.push(move_left_timeout);

        });
    });

    $(document).on('pageshow', '#scene-11-0', function(){
        removeMovement();
    });

    // Change Bible apps link to Google Play Store from Apple AppStore
    $(document).on('pageinit', '#scene-13-0', function(){
		if (isAndroidOs() == true) {
			document.getElementById("bible-life-church").href="https://play.google.com/store/apps/details?id=com.sirma.mobile.bible.android";
			document.getElementById("bible-olive-tree").href="https://play.google.com/store/apps/details?id=nkjv.biblereader.olivetree";
		}
    });

    // Navigate to the next page on swipeleft
    $( document ).on( "swipeleft", ".tappable", function( event ) {
        var next = $( this ).jqmData( "next" );

        /* Added by Frank Grisafi 11/7/2017 */
        $('#forwardbackward').prop('checked', false);
        /* End of Added by Frank Grisafi 11/7/2017 */

        if ( next ) {
            if ( next == "scene-10-1" ) { removeMovement(); }
            toggleConfettiFireworks( next );
            navnext( next );
        }
    });

    // The same for the navigating to the previous page
    $( document ).on( "swiperight", ".tappable", function( event ) {
        var prev = $( this ).jqmData( "prev" );

        /* Added by Frank Grisafi 11/7/2017 */
        $('#forwardbackward').prop('checked', true);
        /* End of Added by Frank Grisafi 11/7/2017 */

        if ( prev ) {
            if ( prev == "scene-9-2" ) { removeMovement(); }
            toggleConfettiFireworks( prev );
            navprev( prev );
        }
    });

    $( document ).on( "tap", ".content .verse", function( event ) {
        var theVerse = $(this),
            theContent = theVerse.closest(".content"),
            theText = theContent.find(".text"),
            theVerseBody = theContent.find(".verse-body");

        theContent.toggleClass("with-verse-body");
        theText.toggleClass("hide");
        theVerseBody.toggleClass("hide");
    });

    $( document ).on( "tap", ".button", function( event ) {
        var theButton = $(this),
            destination = theButton.jqmData("destination"),
            menu = theButton.jqmData("menu");

        // Added by Frank G 11/2/2017
        // Checks appropriate radio button based on last scene viewed
        if( theButton.parents('#scene-5-0').length > 0 ){
            $("#scene-5-0prev").prop( "checked" , true );
        }
        else if( theButton.parents('#scene-6-0').length > 0 ){
            $("#scene-6-0prev").prop( "checked" , true );
        }
        else if( theButton.parents('#scene-7-0').length > 0 ){
            $("#scene-7-0prev").prop( "checked" , true );
        }
        // End of addition by Frank Grisafi 11/2/2017

        if ( destination ) {
            toggleConfettiFireworks( destination );
            navnext(destination);
            event.preventDefault();
            return;
        }

        if ( menu ) {
            $( "#" + menu).panel( "toggle" );
        }
    });

    $( document ).on( "tap", ".button__submit", function( event ) {
        var theButton = $(this),
            avatarType = theButton.jqmData("avatar-type")
            scene = theButton.closest(".scene");

        var avatarId = currentAvatar(scene).replace("__standing", "");

        var avatar = $( "#" + avatarType );
        var classList = avatar[0].classList;
        var existingClasses = $.grep(classList, function(n) { return AVATAR_ID.indexOf(n) !== -1; });

        avatar
            .removeClass(existingClasses.join(" "))
            .addClass(avatarId)
            .jqmData("avatar-id", avatarId);
    });

    $( document ).on( "tap", ".carousel .arrow", function ( event ) {
        var theArrow = $(this),
            scene = theArrow.closest(".scene");

        updateAvatarPicker(scene, event);
        updateNavigationDot(scene);
    });

    $( document ).on( "change", ".avatar-picker .textfield input", function () {
        var theTextfield = $(this),
            scene = theTextfield.closest(".scene");

        var avatarType = scene.find(".avatar-picker").jqmData("avatar-type");
        var avatarName = theTextfield.val();

        $( "#" + avatarType + " .avatar--name").html(avatarName);
    });

    $( ":mobile-pagecontainer" ).on( "pagecontainershow", function( event, ui ) {
        tearDownStage(ui.prevPage.attr("id"));
        var toPage = ui.toPage;
        setupStage(toPage.attr("id"), toPage.jqmData("prev"), toPage.jqmData("next"));

        if (toPage.attr("id") === "scene-0-0") {
            toPage.addClass("animate");
            toPage.find(".content").addClass("animate");
        }
    });

    $( "#menu" ).on( "panelbeforeopen", function () {
        setSelectedLanguage($(this));
        setLocalizedLanguageHeader($(this));
    });

    $( "#menu .menu--option__language" ).on( "collapsibleexpand", function() {
        $(this)
            .find(".selected-language--icon")
            .first()
            .addClass("expanded");
    });

    $( "#menu .menu--option__language" ).on( "collapsiblecollapse", function() {
        $(this)
            .find(".selected-language--icon")
            .first()
            .removeClass("expanded");
    });


    $( "#menu .menu--language").on( "tap", function () {
        var theLanguage = $(this),
            languageText = $(this).find("a").html(),
            languageCode = theLanguage.attr("lang");

        $("#menu .menu--language__selected").removeClass("menu--language__selected");
        theLanguage.addClass("menu--language__selected");
        $("#selected-language").html(languageText);

        $("html").attr("lang", languageCode);

        i18next.changeLanguage(languageCode);

        // ---- IF THAI, ENLARGE TEXT ----
        if ( $('html').attr('lang') == 'th' ) { // If Thai

          // Remove Style Tag
          if ($('style').length) {
            $('html').find('style').remove();
          }

          // Create Style Tag
          var styleTag = $('<style> .t-body { transform: scale(1.05);} </style>')
          $('html > head').append(styleTag);

        } else {

          // Remove Style Tag
          if ($('style').length) {
            $('html').find('style').remove();
          }

        }
        // --- END THAI TEXT ENLARGING ---



    });


    i18next.init({
        lng: 'en',
        debug: true,
        resources: localizedStrings
    }, function (err, t) {
        if (err) {
            console.error("Error encountered when initializing i18next!");
            console.error(err);
            return;
        }
        updateLocalizedContent();
    });

    i18next.on( "languageChanged", function () {
        updateLocalizedContent();
    });

});

$(function() {
    $( "#menu" )
        .panel()
        .enhanceWithin();
});
