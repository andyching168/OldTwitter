let user = {};
// Util

function updateUserData() {
    API.verifyCredentials().then(async u => {
        user = u;
        userDataFunction(u);
        renderUserData();
        let profileLinkColor = document.getElementById('profile-link-color');
        let colorPreviewDark = document.getElementById('color-preview-dark');
        let colorPreviewLight = document.getElementById('color-preview-light');
        let colorPreviewBlack = document.getElementById('color-preview-black');

        let profileColor;
        try {
            profileColor = await fetch(`https://dimden.dev/services/twitter_link_colors/v2/get/${user.id_str}`).then(res => res.text());
        } catch(e) {};
        if(profileColor) {
            if(profileColor === 'none' && u.profile_link_color && u.profile_link_color.toUpperCase() !== "1DA1F2") {
                profileColor = '#'+u.profile_link_color;
            }
            if(profileColor !== 'none') {
                profileLinkColor.value = `#`+profileColor;
        
                let lightColor = makeSeeableColor(profileColor, "#ffffff");
                colorPreviewLight.style.color = lightColor;
                
                let darkColor = makeSeeableColor(profileColor, "#1b2836");
                colorPreviewDark.style.color = darkColor;

                let blackColor = makeSeeableColor(profileColor, "#000000");
                colorPreviewBlack.style.color = blackColor;
            } else {
                let col = `#4595b5`;
                profileLinkColor.value = col;

                let lightColor = makeSeeableColor(col, "#ffffff");
                colorPreviewLight.style.color = lightColor;

                let darkColor = makeSeeableColor(col, "#1b2836");
                colorPreviewDark.style.color = darkColor;

                let blackColor = makeSeeableColor(col, "#000000");
                colorPreviewBlack.style.color = blackColor;
            }
        }
    }).catch(e => {
        if (e === "Not logged in") {
            window.location.href = "https://twitter.com/i/flow/login?newtwitter=true";
        }
        console.error(e);
    });
}
// Render
function renderUserData() {
    document.getElementById('user-name').innerText = user.name;
    document.getElementById('user-name').classList.toggle('user-verified', user.verified);
    document.getElementById('user-name').classList.toggle('user-protected', user.protected);

    document.getElementById('user-handle').innerText = `@${user.screen_name}`;
    document.getElementById('user-tweets').innerText = Number(user.statuses_count).toLocaleString().replace(/\s/g, ',');
    if(user.statuses_count >= 100000) {
        let style = document.createElement('style');
        style.innerText = `
            .user-stat-div > h1 { font-size: 18px !important }
            .user-stat-div > h2 { font-size: 13px !important }
        `;
        document.head.appendChild(style);
    }
    document.getElementById('user-following').innerText = Number(user.friends_count).toLocaleString().replace(/\s/g, ',');
    document.getElementById('user-followers').innerText = Number(user.followers_count).toLocaleString().replace(/\s/g, ',');
    document.getElementById('user-tweets-div').href = `https://twitter.com/${user.screen_name}`;
    document.getElementById('user-following-div').href = `https://twitter.com/${user.screen_name}/following`;
    document.getElementById('user-followers-div').href = `https://twitter.com/${user.screen_name}/followers`;
    document.getElementById('user-banner').src = user.profile_banner_url ? user.profile_banner_url : 'https://abs.twimg.com/images/themes/theme1/bg.png';
    document.getElementById('user-avatar').src = user.profile_image_url_https.replace("_normal", "_400x400");
    document.getElementById('wtf-viewall').href = `https://twitter.com/i/connect_people?newtwitter=true&user_id=${user.id_str}`;
    document.getElementById('user-avatar-link').href = `https://twitter.com/${user.screen_name}`;
    document.getElementById('user-info').href = `https://twitter.com/${user.screen_name}`;

    if(vars.enableTwemoji) twemoji.parse(document.getElementById('user-name'));

    document.getElementById('loading-box').hidden = true;
}

setTimeout(async () => {
    if(!vars) {
        await loadVars();
    }
    // weird bug
    try {
        document.getElementById('wtf-refresh').addEventListener('click', async () => {
            renderDiscovery(false);
        });
    } catch(e) {
        setTimeout(() => location.reload(), 500);
        console.error(e);
        return;
    }

    const fontCheck = new Set([
        // Windows 10
      'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MS UI Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
        // macOS
        'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
        // other
        'Terminus', 'Terminus (TTF)', 'Terminus (TTF) for Windows'
    ].sort());
      
      let fonts = await (async() => {
        await document.fonts.ready;
      
        const fontAvailable = new Set();
      
        for (const font of fontCheck.values()) {
          if (document.fonts.check(`12px "${font}"`)) {
            fontAvailable.add(font);
          }
        }
      
        return [...fontAvailable.values()];
    })();
    let fontElement = document.getElementById('font');
    let linkColor = document.getElementById('link-color');
    let profileLinkColor = document.getElementById('profile-link-color');
    let sync = document.getElementById('sync');
    let heartsNotStars = document.getElementById('hearts-instead-stars');
    let linkColorsInTL = document.getElementById('link-colors-in-tl');
    let enableTwemoji = document.getElementById('enable-twemoji');
    let timelineType = document.getElementById('tl-type');
    let darkMode = document.getElementById('dark-mode');
    let pitchBlackMode = document.getElementById('pitch-black-mode');
    let darkModeText = document.getElementById('dark-mode-text');
    let timeMode = document.getElementById('time-mode');
    let showTopicTweets = document.getElementById('show-topic-tweets');
    let colorPreviewDark = document.getElementById('color-preview-dark');
    let colorPreviewLight = document.getElementById('color-preview-light');
    let colorPreviewBlack = document.getElementById('color-preview-black');
    let disableHotkeys = document.getElementById('disable-hotkeys');
    let customCSS = document.getElementById('custom-css');
    let customCSSVariables = document.getElementById('custom-css-variables');
    let customCSSSave = document.getElementById('custom-css-save');
    let customCSSVariablesSave = document.getElementById('custom-css-variables-save');
    let savePreferredQuality = document.getElementById('save-preferred-quality');
    let roundAvatars = document.getElementById('round-avatars-switch');
    let showOriginalImages = document.getElementById('show-original-images');
    let noBigFont = document.getElementById('no-big-font');
    let language = document.getElementById('language');
    let autoplayVideos = document.getElementById('autoplay-videos');
    let displaySensitiveContent = document.getElementById('display-sensitive-content');
    let seeTweetViews = document.getElementById('see-tweet-views');
    let twitterBlueCheckmarks = document.getElementById('twitter-blue-checkmarks');
    let developerMode = document.getElementById('developer-mode');

    let root = document.querySelector(":root");
    {
        let option = document.createElement('option');
        option.value = "_custom";
        option.innerText = '<CUSTOM FONT>';
        fontElement.append(option);
    }
    for(let i in fonts) {
        let font = fonts[i];
        let option = document.createElement('option');
        option.value = font;
        option.innerText = font;
        option.style.fontFamily = `"${font}"`;
        fontElement.append(option);
    }
    fontElement.addEventListener('change', () => {
        let font = fontElement.value;
        if(font === '_custom') {
            font = prompt('Enter a custom font name');
        }
        root.style.setProperty('--font', `"${font}"`);
        chrome.storage.sync.set({
            font: font
        }, () => { });
    });
    linkColor.addEventListener('change', () => {
        let color = linkColor.value;
        root.style.setProperty('--link-color', color);
        chrome.storage.sync.set({
            linkColor: color
        }, () => { });
    });
    heartsNotStars.addEventListener('change', () => {
        chrome.storage.sync.set({
            heartsNotStars: heartsNotStars.checked
        }, () => { });
    });
    linkColorsInTL.addEventListener('change', () => {
        chrome.storage.sync.set({
            linkColorsInTL: linkColorsInTL.checked
        }, () => { });
    });
    enableTwemoji.addEventListener('change', () => {
        chrome.storage.sync.set({
            enableTwemoji: enableTwemoji.checked
        }, () => { });
    });
    timelineType.addEventListener('change', () => {
        document.getElementById('stt-div').hidden = timelineType.value !== 'algo';
        chrome.storage.sync.set({
            timelineType: timelineType.value
        }, () => { });
    });
    showTopicTweets.addEventListener('change', () => {
        chrome.storage.sync.set({
            showTopicTweets: showTopicTweets.checked
        }, () => { });
    });
    disableHotkeys.addEventListener('change', () => {
        chrome.storage.sync.set({
            disableHotkeys: disableHotkeys.checked
        }, () => { });
    });
    savePreferredQuality.addEventListener('change', () => {
        chrome.storage.sync.set({
            savePreferredQuality: savePreferredQuality.checked
        }, () => { });
    });
    showOriginalImages.addEventListener('change', () => {
        chrome.storage.sync.set({
            showOriginalImages: showOriginalImages.checked
        }, () => { });
    });
    roundAvatars.addEventListener('change', () => {
        chrome.storage.sync.set({
            roundAvatars: roundAvatars.checked
        }, () => {
            switchRoundAvatars(roundAvatars.checked);
            roundAvatarBus.postMessage(roundAvatars.checked);
        });
    });
    noBigFont.addEventListener('change', () => {
        chrome.storage.sync.set({
            noBigFont: noBigFont.checked
        }, () => { });
    });
    autoplayVideos.addEventListener('change', () => {
        chrome.storage.sync.set({
            autoplayVideos: autoplayVideos.checked
        }, () => { });
    });
    displaySensitiveContent.addEventListener('change', () => {
        chrome.storage.sync.set({
            displaySensitiveContent: displaySensitiveContent.checked
        }, () => { });
    });
    seeTweetViews.addEventListener('change', () => {
        chrome.storage.sync.set({
            seeTweetViews: seeTweetViews.checked
        }, () => { });
    });
    twitterBlueCheckmarks.addEventListener('change', () => {
        chrome.storage.sync.set({
            twitterBlueCheckmarks: twitterBlueCheckmarks.checked
        }, () => { });
    });
    developerMode.addEventListener('change', () => {
        chrome.storage.sync.set({
            developerMode: developerMode.checked
        }, () => { });
    });
    language.addEventListener('change', () => {
        chrome.storage.sync.set({
            language: language.value
        }, () => {
            location.reload();
        });
    });
    darkMode.addEventListener('change', () => {
        themeBus.postMessage([darkMode.checked, pitchBlackMode.checked]);
        isDarkModeEnabled = darkMode.checked;
        switchDarkMode(isDarkModeEnabled);
        chrome.storage.sync.set({
            darkMode: isDarkModeEnabled
        }, () => { });
    });
    pitchBlackMode.addEventListener('change', () => {
        vars.pitchBlack = pitchBlackMode.checked;
        chrome.storage.sync.set({
            pitchBlack: pitchBlackMode.checked
        }, () => {});
        themeBus.postMessage([darkMode.checked, pitchBlackMode.checked]);
        switchDarkMode(isDarkModeEnabled);
    });
    timeMode.addEventListener('change', () => {
        if(timeMode.checked) {
            darkMode.disabled = true;
            chrome.storage.sync.set({
                darkMode: false
            }, () => { });
            darkModeText.style.color = 'var(--darker-gray)';
            let dark = isDark();
            darkMode.checked = dark;
            themeBus.postMessage([dark, pitchBlackMode.checked]);
            isDarkModeEnabled = dark;
            switchDarkMode(dark);
        } else {
            darkMode.checked = false;
            darkMode.disabled = false;
            darkModeText.style.color = 'unset';
            themeBus.postMessage([false, pitchBlackMode.checked]);
            isDarkModeEnabled = false;
            switchDarkMode(false);
        }
        vars.timeMode = timeMode.checked;
        chrome.storage.sync.set({
            timeMode: timeMode.checked
        }, () => { });
    });
    profileLinkColor.addEventListener('change', () => {
        let previewColor = profileLinkColor.value;
        
        let lightColor = makeSeeableColor(previewColor, "#ffffff");
        colorPreviewLight.style.color = lightColor;
        
        let darkColor = makeSeeableColor(previewColor, "#1b2836");
        colorPreviewDark.style.color = darkColor;

        let blackColor = makeSeeableColor(previewColor, "#000000");
        colorPreviewBlack.style.color = blackColor;
    });
    sync.addEventListener('click', async () => {
        sync.disabled = true;
        let color = profileLinkColor.value;
        if(color.startsWith('#')) color = color.slice(1);
        let tweet;
        try {
            tweet = await API.postTweet({
                status: `link_color=${color}`
            })
            let res = await fetch(`https://dimden.dev/services/twitter_link_colors/v2/set`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tweet)
            }).then(i => i.text());
            if(res === 'error') {
                alert(LOC.error_setting_color.message);
            } else {
                alert(LOC.link_color_set.message);
                chrome.storage.local.get(["linkColors"], async lc => {
                    let linkColors = lc.linkColors || {};
                    linkColors[user.id_str] = color;
                    chrome.storage.local.set({ linkColors });
                });
            }
        } catch(e) {
            console.error(e);
            alert(LOC.error_setting_color.message);
        } finally {
            sync.disabled = false;
            API.deleteTweet(tweet.id_str);
        }
    });
    customCSS.addEventListener('keydown', e => {
        if(e.key === "Tab") {
            e.preventDefault();
            e.stopImmediatePropagation();
            let pos = customCSS.selectionStart;
            customCSS.value = customCSS.value.slice(0, pos) + "    " + customCSS.value.slice(pos);
            customCSS.selectionStart = customCSS.selectionEnd = pos + 4;
        }
    });
    customCSSSave.addEventListener('click', () => {
        chrome.storage.sync.set({
            customCSS: customCSS.value
        }, () => {
            let event = new CustomEvent('customCSS', { detail: customCSS.value });
            document.dispatchEvent(event);
        });
    });
    customCSSVariablesSave.addEventListener('click', () => {
        chrome.storage.sync.set({
            customCSSVariables: customCSSVariables.value
        }, () => {
            let event = new CustomEvent('customCSSVariables', { detail: customCSSVariables.value });
            document.dispatchEvent(event);
        });
    });

    if(vars.linkColor) {
        linkColor.value = vars.linkColor;
        root.style.setProperty('--link-color', vars.linkColor);
    } else {
        linkColor.value = '#4bacd2';
    }
    if(vars.font) {
        fontElement.value = vars.font;
        root.style.setProperty('--font', `"${vars.font}"`);
    }
    heartsNotStars.checked = !!vars.heartsNotStars;
    linkColorsInTL.checked = !!vars.linkColorsInTL;
    enableTwemoji.checked = !!vars.enableTwemoji;
    timelineType.value = vars.timelineType ? vars.timelineType : 'chrono';
    showTopicTweets.checked = !!vars.showTopicTweets;
    darkMode.checked = !!vars.darkMode;
    pitchBlackMode.checked = !!vars.pitchBlack;
    timeMode.checked = !!vars.timeMode;
    disableHotkeys.checked = !!vars.disableHotkeys;
    noBigFont.checked = !!vars.noBigFont;
    autoplayVideos.checked = !!vars.autoplayVideos;
    displaySensitiveContent.checked = !!vars.displaySensitiveContent;
    seeTweetViews.checked = !!vars.seeTweetViews;
    twitterBlueCheckmarks.checked = !!vars.twitterBlueCheckmarks;
    developerMode.checked = !!vars.developerMode;
    if(vars.customCSS) {
        customCSS.value = vars.customCSS;
    }
    if(vars.customCSSVariables) {
        customCSSVariables.value = vars.customCSSVariables;
    }
    document.getElementById('stt-div').hidden = vars.timelineType !== 'algo';
    savePreferredQuality.checked = !!vars.savePreferredQuality;
    showOriginalImages.checked = !!vars.showOriginalImages;
    roundAvatars.checked = !!vars.roundAvatars;
    language.value = vars.language ? vars.language : 'en';
    if(vars.timeMode) {
        darkMode.disabled = true;
        darkMode.checked = isDark();
        darkModeText.style.color = 'var(--darker-gray)';
    }

    // Run
    updateUserData();
    renderDiscovery();
    renderTrends();
    document.getElementById('loading-box').hidden = true;
    setInterval(updateUserData, 60000 * 3);
    setInterval(() => renderDiscovery(false), 60000 * 15);
    setInterval(renderTrends, 60000 * 5);
}, 50);