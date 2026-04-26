/* eslint-disable no-undef */
/*global chrome*/
import * as module from "./sw.js";

chrome.action.onClicked.addListener((tab) => {
  console.log("[Discrub] icon clicked", tab);
  if (chrome && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("[Discrub] active tabs:", tabs);
      if (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { message: "INJECT_DIALOG" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("[Discrub] sendMessage error:", chrome.runtime.lastError.message);
            }
          }
        );
      }
    });
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (chrome && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { message: "INJECT_BUTTON" },
          () => { void chrome.runtime.lastError; }
        );
      }
    });
  }
});
