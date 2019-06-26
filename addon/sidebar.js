/* globals buildSettings */

function element(selector) {
  return document.querySelector(selector);
}

function applyDarkTheme() {
  document.querySelector(".page").classList.add("dark-theme");
}

async function checkForDark() {
  if (!browser.management) {
    return;
  }
  browser.management.getAll().then((extensions) => {
    for (let extension of extensions) {
    // The user has the default dark theme enabled
    if (extension.id ===
      "firefox-compact-dark@mozilla.org@personas.mozilla.org"
      && extension.enabled) {
        applyDarkTheme();
      }
    }
  });
}

async function init() {
  document.documentElement.classList.toggle("in-subpanel", window.top !== window);

  element("#watch-tutorial").onclick = () => {
    const url = "https://youtu.be/no6D_B4wgo8";
    let openedWindow;
    try {
      openedWindow = window.open(url);
    } catch (error) {
    }
    if (!openedWindow) {
      browser.runtime.sendMessage({
        type: "openUrlInTab",
        url,
      });
    }
  };

  const isTSTSupported = element("#isTSTSupported");
  isTSTSupported.onclick = () => {
    browser.runtime.sendMessage({
      type: "setTSTSupported",
      value: isTSTSupported.checked,
    });
  };
  browser.runtime.sendMessage({
    type: "isTSTSupported",
  }).then(value => isTSTSupported.checked = value);

  if (!browser.management) {
    return;
  }

  checkForDark();
  browser.management.onEnabled.addListener((info) => {
    checkForDark();
  });
}

init();
