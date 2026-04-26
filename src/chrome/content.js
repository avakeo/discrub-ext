/*global chrome*/
// hasListeners() is Chrome-only; use a flag for cross-browser compatibility
if (!globalThis._discrubListenerAdded) {
  globalThis._discrubListenerAdded = true;
  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    const { message } = request;
    switch (message) {
      case "INJECT_BUTTON":
        // eslint-disable-next-line no-case-declarations
        const element =
          document.querySelector('[aria-label="Inbox"]')?.parentElement ||
          document.querySelector('[aria-label="Help"]')?.parentElement;
        if (!document.getElementById("injected_iframe_button") && element) {
          element.style.display = "flex";
          element.style.flexDirection = "row-reverse";
          element.style.alignItems = "center";
          element.style.justifyContent = "center";
          const iframe = document.createElement("iframe");
          iframe.id = "injected_iframe_button";
          iframe.src = chrome.runtime.getURL("button_injection.html");
          iframe.scrolling = "no";
          iframe.width = 30;
          iframe.height = 30;
          element.appendChild(iframe);
        }
        break;
      case "INJECT_DIALOG":
        if (!document.getElementById("injected_dialog")) {
          const overlay = document.createElement("div");
          overlay.id = "injected_dialog";
          overlay.style.cssText = [
            "position:fixed",
            "top:50%", "left:50%",
            "transform:translate(-50%,-50%)",
            "z-index:2147483647",
            "pointer-events:none",
          ].join(";");
          const iframe = document.createElement("iframe");
          iframe.id = "injected_dialog_iframe";
          iframe.src = chrome.runtime.getURL("index.html");
          iframe.style.cssText = [
            "border:none",
            "border-radius:6px",
            "width:720px", "height:615px",
            "pointer-events:auto",
          ].join(";");
          overlay.appendChild(iframe);
          document.documentElement.appendChild(overlay);
        } else {
          document.getElementById("injected_dialog").style.display = "flex";
        }
        break;
      case "CLOSE_INJECTED_DIALOG":
        // eslint-disable-next-line no-case-declarations
        const dialog = document.getElementById("injected_dialog");
        if (dialog) dialog.style.display = "none";
        break;
      case "GET_TOKEN":
        // eslint-disable-next-line no-case-declarations
        try {
          const rawToken = localStorage.getItem("token");
          callback(rawToken ? JSON.parse(rawToken) : null);
        } catch (e) {
          callback(null);
        }
        return true;
      default:
        break;
    }
  });
}
