import { useState, useRef, useEffect } from "react";

// Import core
import { useMe } from "@/core/users/query";

// Import components
import { renderProductDetail } from "./chat-ui/product-detail-chat-view";
import { renderOrderDetail } from "./chat-ui/order-detail-chat-view";
import { renderReviews } from "./chat-ui/reviews-chat-view";
import { renderCart } from "./chat-ui/cart-detail-chat-view";

export default function ChatBotWidget() {
  const [isECVBotScriptLoaded, setIsECVBotScriptLoaded] = useState(false);
  const { data: me } = useMe();
  const ecvBotPopupShadowRootRef = useRef<HTMLDivElement | null>(null);

  // Load scripts
  useEffect(() => {
    const scriptId = "ecvBotChatPopLoadedScript";

    if (isECVBotScriptLoaded) {
      (window as any).ecvBot.reset();
      setIsECVBotScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    // Replace URL of your script here
    script.src = "/scripts/ecv-bot-embedded.js";
    script.async = true;

    script.onload = () => {
      setIsECVBotScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load script");
    };

    document.body.appendChild(script);
  }, [isECVBotScriptLoaded]);

  // Mount ECVBot Popup Chat + register UI components
  useEffect(() => {
    if (!isECVBotScriptLoaded) return;
    if (typeof (window as any).ecvBot === "undefined") return;

    const container = (window as any).ecvBot.createShadowRootContainer();
    (window as any).ecvBot.initialize(container, {
      botId: "3CyBfru3T2FmtX3KpJQoQrZHdjo",
    });

    (window as any).ecvBot.chatUIRegistry.addDOMRenderer(
      "demo_retail_get_product",
      renderProductDetail,
    );
    (window as any).ecvBot.chatUIRegistry.addDOMRenderer(
      "demo_retail_get_order",
      renderOrderDetail,
    );
    (window as any).ecvBot.chatUIRegistry.addDOMRenderer(
      "demo_retail_list_reviews",
      renderReviews,
    );
    (window as any).ecvBot.chatUIRegistry.addDOMRenderer(
      "demo_retail_get_cart",
      renderCart,
    );
  }, [isECVBotScriptLoaded]);

  useEffect(() => {
    if (me && me.id) {
      (window as any).ecvBot.user.setters.setUserId(me.id);
    }
  }, [me]);

  return <div ref={ecvBotPopupShadowRootRef}></div>;
}
