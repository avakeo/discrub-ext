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
          const DIALOG_W = 720;
          const DIALOG_H = 615;
          const HANDLE_H = 22;
          const initialLeft = Math.max(0, window.innerWidth - DIALOG_W - 20);
          const initialTop = 20;

          const overlay = document.createElement("div");
          overlay.id = "injected_dialog";
          overlay.style.cssText = [
            "position:fixed",
            `top:${initialTop}px`,
            `left:${initialLeft}px`,
            "z-index:2147483647",
            "pointer-events:none",
            "display:flex",
            "flex-direction:column",
          ].join(";");

          const handle = document.createElement("div");
          handle.style.cssText = [
            `width:${DIALOG_W}px`,
            `height:${HANDLE_H}px`,
            "background:rgba(30,30,30,0.85)",
            "border-radius:6px 6px 0 0",
            "cursor:grab",
            "pointer-events:auto",
            "display:flex",
            "align-items:center",
            "justify-content:center",
            "user-select:none",
          ].join(";");
          const grip = document.createElement("div");
          grip.style.cssText =
            "width:36px;height:4px;background:rgba(255,255,255,0.35);border-radius:2px";
          handle.appendChild(grip);

          const iframe = document.createElement("iframe");
          iframe.id = "injected_dialog_iframe";
          iframe.src = chrome.runtime.getURL("index.html");
          iframe.style.cssText = [
            "border:none",
            "border-radius:0 0 6px 6px",
            `width:${DIALOG_W}px`,
            `height:${DIALOG_H}px`,
            "pointer-events:auto",
          ].join(";");

          overlay.appendChild(handle);
          overlay.appendChild(iframe);
          document.documentElement.appendChild(overlay);

          let dragging = false;
          let startX, startY, startLeft, startTop;

          handle.addEventListener("mousedown", (e) => {
            dragging = true;
            handle.style.cursor = "grabbing";
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(overlay.style.left, 10);
            startTop = parseInt(overlay.style.top, 10);

            // Capture layer so iframe doesn't swallow mousemove/mouseup
            const cap = document.createElement("div");
            cap.id = "discrub_drag_cap";
            cap.style.cssText =
              "position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483646;cursor:grabbing";
            document.documentElement.appendChild(cap);
            e.preventDefault();
          });

          document.addEventListener("mousemove", (e) => {
            if (!dragging) return;
            overlay.style.left = startLeft + (e.clientX - startX) + "px";
            overlay.style.top = startTop + (e.clientY - startY) + "px";
          });

          document.addEventListener("mouseup", () => {
            if (!dragging) return;
            dragging = false;
            handle.style.cursor = "grab";
            const cap = document.getElementById("discrub_drag_cap");
            if (cap) cap.remove();
          });
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
