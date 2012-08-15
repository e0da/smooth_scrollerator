// Fetch version number of Smooth Scrollerator
function get_manifest(callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(JSON.parse(xhr.responseText));
  };
  xhr.open('GET', '../manifest.json', true);
  xhr.send(null);
}

get_manifest(function (manifest) {
  version = manifest.version;
  init();
});

function setDefault(key, value) {
  if (localStorage[key] == null) {
    localStorage[key] = value;
  }
}

function init() {

  // TODO: store the defaults in the localStorage so
  // they are available for sscr.js and on options.html

  // Set the default settings
  setDefault("version", version);
  // general & mouse
  setDefault("framerate", 150);
  setDefault("animtime",  400);
  setDefault("scrollsz",  120);
  setDefault("middlemouse", false);
  // accel
  setDefault("accelMax",   1);
  setDefault("accelDelta", 20);
  // pulse
  setDefault("pulseAlgorithm", true);
  setDefault("pulseScale", 8);
  setDefault("pulseNormalize", 1);
  // keyboard
  setDefault("keyboardsupport", true);
  setDefault("arrscroll", 50);
  // exlude page
  setDefault("fixedback", true);
  setDefault("exclude", "example.com, another.example.com");
  // marketing
  setDefault("smoothscrollapp.marketing", true);
  /**
   * NOTE: It's easier if we give an example
   * how to format the excluded pages list,
   */

  var store = localStorage;

  // Fresh install
  if (!store.version) {
    //chrome.tabs.create({url: "chrome-extension://cccpiddacjljmfbbgeimpelpndgpoknn/options_page/options.html"});
  }

  // If updated do something
  if (store.version != version) {

    store.version = version;

    if (store.framerate == "50") {
      store.framerate = 150;
    }

    store.exclude = store.exclude.replace(/ /g, "");

    var list = [];
    var domains = store.exclude.split(/[,\n] ?/);
    for (var i = 0; i < domains.length; i++) {
        if (domains[i] === "twitter.com")
           store.fixedback = false;
        else if (domains[i] && domains[i] !== "mail.google.com")
           list.push(domains[i]);
    }

    store.exclude = list.join(", ");

    // This should be replaced by an infobar once the API is ready
    //chrome.tabs.create({url: "chrome-extension://cccpiddacjljmfbbgeimpelpndgpoknn/options_page/options.html"});
  }
}

// If content scripts connect send the settings
chrome.extension.onConnect.addListener(function (port) {
  if (port.name == 'smoothscroll') {
    port.postMessage(localStorage);
  }
});
