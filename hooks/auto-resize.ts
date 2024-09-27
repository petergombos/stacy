import { RefObject, useEffect } from "react";

export function useAutoResize(
  ref: RefObject<HTMLTextAreaElement>,
  value: string
) {
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    adjustHeight();

    textarea.addEventListener("input", adjustHeight);
    window.addEventListener("resize", adjustHeight);

    return () => {
      textarea.removeEventListener("input", adjustHeight);
      window.removeEventListener("resize", adjustHeight);
    };
  }, [ref, value]);
}
