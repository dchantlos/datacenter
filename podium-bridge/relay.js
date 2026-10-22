// Passes messages between driver.js (Podium's page) and the extension's background worker.
window.addEventListener("message", (event) => {
  if (event.source !== window || event.data?.source !== "dcss-driver") return;
  chrome.runtime.sendMessage(event.data).catch(() => undefined);
});
