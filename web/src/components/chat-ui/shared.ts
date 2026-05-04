import { createRoot } from "react-dom/client";
import chatUiCss from "@/styles/chat-ui.css?inline";

export function injectChatUiCss() {
  const shadowRoot = document.querySelector("#ecv-bot-iframe-root")?.shadowRoot;
  if (shadowRoot && !shadowRoot.querySelector("[data-chat-ui-css]")) {
    const style = document.createElement("style");
    style.setAttribute("data-chat-ui-css", "");
    style.textContent = chatUiCss;
    shadowRoot.appendChild(style);
  }
}

export function renderToDOM(element: React.ReactElement): HTMLElement {
  injectChatUiCss();
  const container = document.createElement("div");
  createRoot(container).render(element);
  return container;
}
