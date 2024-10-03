import { RefObject, useEffect } from "react";

export function useAutoResize(ref: RefObject<HTMLTextAreaElement>) {
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    // Create a MutationObserver to watch for changes in the textarea's content
    const observer = new MutationObserver(adjustHeight);

    // Configure the observer to watch for changes in the textarea's childList and characterData
    observer.observe(textarea, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    // Initial adjustment
    adjustHeight();

    // Handle window resize
    window.addEventListener("resize", adjustHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", adjustHeight);
    };
  }, [ref]);
}
