console.clear();

gsap.registerPlugin(ScrollTrigger);

const pad2 = (n) => String(n).padStart(2, "0");

const pinSections = gsap.utils.toArray(".pin-section");

pinSections.forEach((section, sectionIndex) => {
  const steps = gsap.utils.toArray(".scroll-progress__step", section);
  const slidesLeft = gsap.utils.toArray(
    ".twin__panel--left .slide",
    section
  );
  const slidesRight = gsap.utils.toArray(
    ".twin__panel--right .slide",
    section
  );
  const counterCurrent = section.querySelector(".slide-counter__current");
  const counterTotal = section.querySelector(".slide-counter__total");
  const stepBar = section.querySelector(".scroll-progress__steps");
  const stepClip = section.querySelector(".scroll-progress__clip");

  const n = steps.length;

  if (slidesLeft.length !== n || slidesRight.length !== n) {
    console.warn(
      "[twin slides] Left/right slide count must match nav steps:",
      slidesLeft.length,
      slidesRight.length,
      n
    );
  }

  if (counterTotal) {
    counterTotal.textContent = pad2(n);
  }

  let tl;

  function slipProgressBarToScroll() {
    if (!stepBar || !stepClip || !tl) return;
    const st = tl.scrollTrigger;
    if (!st) return;
    const p = st.progress;
    if (!Number.isFinite(p)) return;
    const maxShift = Math.max(0, stepBar.offsetWidth - stepClip.clientWidth);
    gsap.set(stepBar, { x: -p * maxShift });
  }

  function setStep(stepIndex) {
    steps.forEach((el, idx) => {
      el.classList.toggle("is-active", idx === stepIndex);
    });
    if (counterCurrent) {
      counterCurrent.textContent = pad2(stepIndex + 1);
    }
  }

  const allSlides = [...slidesLeft, ...slidesRight];
  gsap.set(allSlides, { autoAlpha: 0 });
  gsap.set(slidesLeft[0], { autoAlpha: 1 });
  gsap.set(slidesRight[0], { autoAlpha: 1, yPercent: 0 });
  gsap.set(slidesRight.slice(1), { autoAlpha: 1, yPercent: 100 });
  gsap.set(stepBar, { x: 0 });
  setStep(0);

  function stepIndexFromTime(t) {
    if (!Number.isFinite(t) || t < 0) return 0;
    return Math.min(n - 1, Math.max(0, Math.floor(t / 0.5 + 1e-6)));
  }

  let activeStepIndex = 0;

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=" + n * 50 + "%",
      pin: true,
      scrub: true,
      id: sectionIndex + 1,
      onUpdate() {
        slipProgressBarToScroll();
        const t = tl.time();
        if (!Number.isFinite(t)) return;
        const step = stepIndexFromTime(t);
        if (step !== activeStepIndex) {
          activeStepIndex = step;
          setStep(step);
        }
      }
    }
  });

  steps.forEach((_, j) => {
    if (j === 0) return;

    // Right panel: next image slides up over the current one (clip reveal)
    tl.fromTo(
      slidesRight[j],
      { autoAlpha: 1, yPercent: 100 },
      { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: "none" },
      0.5 * j
    );

    // Left panel: simple crossfade as before
    tl.to(
      slidesLeft[j],
      { autoAlpha: 1, duration: 0.25, ease: "none" },
      0.5 * j
    ).to(
      slidesLeft[j - 1],
      { autoAlpha: 0, duration: 0.25, ease: "none" },
      0.5 * j
    );
  });

  gsap.delayedCall(0, () => {
    ScrollTrigger.refresh();
    slipProgressBarToScroll();
    const t = tl.time();
    const step = stepIndexFromTime(Number.isFinite(t) ? t : 0);
    activeStepIndex = step;
    setStep(step);
  });
});
