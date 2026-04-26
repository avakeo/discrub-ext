/*global chrome*/
console.log("[Discrub] content script loaded");
// hasListeners() is Chrome-only; use a flag for cross-browser compatibility
if (!globalThis._discrubListenerAdded) {
  globalThis._discrubListenerAdded = true;
  chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    const { message } = request;
    console.log("[Discrub] message received:", message);
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
        console.log("[Discrub] creating overlay, body=", document.body, "existing=", document.getElementById("injected_dialog"));
        if (!document.getElementById("injected_dialog")) {
          const overlay = document.createElement("div");
          overlay.id = "injected_dialog";
          overlay.style.cssText = [
            "position:fixed",
            "top:0", "left:0",
            "width:100vw", "height:100vh",
            "display:flex",
            "align-items:center",
            "justify-content:center",
            "z-index:2147483647",
            "background:rgba(0,0,0,0.6)",
          ].join(";");
          const dbg = document.createElement("div");
          dbg.style.cssText = "width:200px;height:200px;background:red;color:white;font-size:24px;display:flex;align-items:center;justify-content:center;";
          dbg.textContent = "DISCRUB";
          overlay.appendChild(dbg);
          const iframe = document.createElement("iframe");
          iframe.id = "injected_dialog_iframe";
          iframe.src = chrome.runtime.getURL("index.html");
          iframe.style.cssText = [
            "border:none",
            "border-radius:6px",
            "width:720px", "height:615px",
          ].join(";");
          overlay.appendChild(iframe);
          document.documentElement.appendChild(overlay);
          console.log("[Discrub] overlay appended, iframe src=", iframe.src, "overlay in DOM=", !!document.getElementById("injected_dialog"));
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
          console.log("[Discrub] GET_TOKEN rawToken=", rawToken ? "found" : "null");
          callback(rawToken ? JSON.parse(rawToken) : null);
        } catch (e) {
          console.error("[Discrub] GET_TOKEN error:", e);
          callback(null);
        }
        return true;
      default:
        break;
    }
  });
}
