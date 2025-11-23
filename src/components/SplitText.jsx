import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  className = "",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  delay = 50,
  duration = 0.6,
  ease = "power3.out",
  direction = "ltr", // Pass from LanguageSwitcher
  tag = "p",
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === "loaded") setFontsLoaded(true);
    else document.fonts.ready.then(() => setFontsLoaded(true));
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;

      const el = ref.current;
      el.style.direction = direction;
      el.style.unicodeBidi = "plaintext";

      // Kill old ScrollTriggers
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });

      // Revert old SplitText
      if (el._splitInstance) {
        try {
          el._splitInstance.revert();
        } catch (_) {}
        el._splitInstance = null;
      }

      const start = `top ${100 * (1 - 0.1)}%+=-100px`;
      const isArabic = direction === "rtl";

      if (isArabic) {
        // Animate Arabic as a single block
        gsap.fromTo(
          el,
          { ...from },
          { ...to, duration, ease, scrollTrigger: { trigger: el, start, once: true }, onComplete: onLetterAnimationComplete }
        );
        return;
      }

      // Split English text
      const split = new GSAPSplitText(el, { type: splitType });
      const targets =
        splitType === "chars"
          ? split.chars
          : splitType === "words"
          ? split.words
          : split.lines;

      gsap.fromTo(
        targets,
        { ...from },
        { ...to, duration, ease, stagger: delay / 1000, scrollTrigger: { trigger: el, start, once: true }, onComplete: onLetterAnimationComplete }
      );

      el._splitInstance = split;
    },
    [text, direction, fontsLoaded]
  );

  const Tag = tag;

  return (
    <Tag
      ref={ref}
      dir={direction}
      lang={direction === "rtl" ? "ar" : "en"}
      style={{
        textAlign: direction === "rtl" ? "right" : "left",
        direction,
        unicodeBidi: "plaintext",
        wordWrap: "break-word",
        willChange: "transform, opacity",
      }}
      className={`split-parent overflow-hidden inline-block whitespace-normal ${className}`}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
