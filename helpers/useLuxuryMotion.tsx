import { useEffect } from "react";

export function useLuxuryMotion(dependency?: unknown) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduceMotion) return;

    const parallaxImages = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax-image]"));
    const tiltCards = finePointer ? Array.from(document.querySelectorAll<HTMLElement>("[data-tilt-card]")) : [];
    const visible = new Set<HTMLElement>();
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement;
            if (entry.isIntersecting) visible.add(element);
            else visible.delete(element);
          });
        }, { rootMargin: "20% 0px 20% 0px" })
      : null;

    parallaxImages.forEach((image) => observer?.observe(image));
    if (!observer) parallaxImages.forEach((image) => visible.add(image));

    let scrollRaf = 0;
    let dirty = true;
    const renderParallax = () => {
      scrollRaf = 0;
      if (!dirty) return;
      dirty = false;
      const viewport = Math.max(window.innerHeight, 1);

      visible.forEach((image) => {
        const container = image.closest<HTMLElement>("[data-parallax-container]") || image.parentElement;
        const rect = container?.getBoundingClientRect();
        if (!rect || rect.height <= 0) return;

        const center = rect.top + rect.height / 2;
        const progress = Math.max(-1, Math.min(1, (viewport / 2 - center) / (viewport / 2 + rect.height / 2)));
        const strength = image.dataset.parallaxStrength === "hero" ? 24 : 18;
        const target = progress * strength;
        const current = Number(image.dataset.parallaxCurrent || "0");
        const next = current + (target - current) * 0.12;
        image.dataset.parallaxCurrent = String(next);
        image.style.transform = `translate3d(0, ${next.toFixed(2)}px, 0) scale(1.035)`;
      });

      if (visible.size) {
        const stillMoving = Array.from(visible).some((image) => {
          const container = image.closest<HTMLElement>("[data-parallax-container]") || image.parentElement;
          if (!container) return false;
          const rect = container.getBoundingClientRect();
          const viewport = Math.max(window.innerHeight, 1);
          const center = rect.top + rect.height / 2;
          const progress = Math.max(-1, Math.min(1, (viewport / 2 - center) / (viewport / 2 + rect.height / 2)));
          const strength = image.dataset.parallaxStrength === "hero" ? 24 : 18;
          const target = progress * strength;
          return Math.abs(target - Number(image.dataset.parallaxCurrent || "0")) > 0.05;
        });
        if (stillMoving) scrollRaf = requestAnimationFrame(renderParallax);
      }
    };

    const scheduleParallax = () => {
      dirty = true;
      if (!scrollRaf) scrollRaf = requestAnimationFrame(renderParallax);
    };

    scheduleParallax();
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax, { passive: true });

    const tiltCleanups = tiltCards.map((card) => {
      let raf = 0;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const render = () => {
        raf = 0;
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        card.style.transform = `perspective(1200px) rotateX(${currentY.toFixed(2)}deg) rotateY(${currentX.toFixed(2)}deg) translate3d(0,0,0)`;
        if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) raf = requestAnimationFrame(render);
      };

      const move = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        targetX = x * 2.2;
        targetY = y * -2.2;
        if (!raf) raf = requestAnimationFrame(render);
      };

      const leave = () => {
        targetX = 0;
        targetY = 0;
        if (!raf) raf = requestAnimationFrame(render);
      };

      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);

      return () => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
      };
    });

    return () => {
      window.removeEventListener("scroll", scheduleParallax);
      window.removeEventListener("resize", scheduleParallax);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      observer?.disconnect();
      tiltCleanups.forEach((cleanup) => cleanup());
      parallaxImages.forEach((image) => {
        image.style.transform = "";
        delete image.dataset.parallaxCurrent;
      });
    };
  }, [dependency]);
}