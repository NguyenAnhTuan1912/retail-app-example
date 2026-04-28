import { useState, useRef, useEffect } from "react";

import { useMe } from "@/core/users/query";

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

  // Mount ECVBot Popup Chat
  useEffect(() => {
    window.onload = function () {
      if (typeof (window as any).ecvBot !== "undefined") {
        const container = (window as any).ecvBot.createShadowRootContainer();
        (window as any).ecvBot.initialize(container, {
          botId: "3CyBfru3T2FmtX3KpJQoQrZHdjo",
        });
      } else {
        console.error("window.ecvBot is not available!");
      }
    };
  }, []);

  useEffect(() => {
    if (me && me.id) {
      (window as any).ecvBot.user.setters.setUserId(me.id);
    }
  }, [me]);

  return (
    <div ref={ecvBotPopupShadowRootRef}></div>
  );
}
