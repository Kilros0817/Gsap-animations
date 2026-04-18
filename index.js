console.clear();

gsap.registerPlugin(ScrollTrigger);

const pad2 = (n) => String(n).padStart(2, "0");

const pinSections = gsap.utils.toArray(".pin-section");

pinSections.forEach((section, sectionIndex) => {
  const list = section.querySelector(".list");
  const listItems = gsap.utils.toArray("li", list);
  const slidesLeft = gsap.utils.toArray(
    ".twin__panel--left .slide",
    section
  );
  const slidesRight = gsap.utils.toArray(
    ".twin__panel--right .slide",
    section
  );
  const highlight = section.querySelector(".scroll-progress__highlight");
  const counterCurrent = section.querySelector(".slide-counter__current");
  const counterTotal = section.querySelector(".slide-counter__total");

  const n = listItems.length;
  const segmentPct = 100 / n;
  const maxLeftPct = 100 - segmentPct;

  section.style.setProperty("--progress-steps", String(n));

  if (slidesLeft.length !== n || slidesRight.length !== n) {
    console.warn(
      "[twin slides] Left/right slide count must match nav items:",
      slidesLeft.length,
      slidesRight.length,
      n
    );
  }

  if (counterTotal) {
    counterTotal.textContent = pad2(n);
  }

  if (highlight) {
    gsap.set(highlight, {
      width: `${segmentPct}%`,
      left: "0%"
    });
  }

  const inactiveLabel = "rgba(255,255,255,0.45)";
  const activeLabel = "#ffffff";

  function setCounter(stepIndex) {
    if (counterCurrent) {
      counterCurrent.textContent = pad2(stepIndex + 1);
    }
  }

  const allSlides = [...slidesLeft, ...slidesRight];
  gsap.set(allSlides, { autoAlpha: 0 });
  gsap.set([slidesLeft[0], slidesRight[0]], { autoAlpha: 1 });
  listItems.forEach((item, idx) => {
    gsap.set(item, {
      color: idx === 0 ? activeLabel : inactiveLabel,
      fontWeight: idx === 0 ? 700 : 500
    });
  });
  setCounter(0);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=" + n * 50 + "%",
      pin: true,
      scrub: true,
      id: sectionIndex + 1
    }
  });

  listItems.forEach((item, j) => {
    const stepTime = j === 0 ? 0 : 0.5 * j;

    tl.call(() => setCounter(j), [], stepTime);

    if (listItems[j - 1]) {
      tl.set(item, { color: activeLabel, fontWeight: 700 }, 0.5 * j)
        .to(
          [slidesLeft[j], slidesRight[j]],
          {
            autoAlpha: 1,
            duration: 0.2
          },
          "<"
        )
        .set(listItems[j - 1], { color: inactiveLabel, fontWeight: 500 }, "<")
        .to(
          [slidesLeft[j - 1], slidesRight[j - 1]],
          {
            autoAlpha: 0,
            duration: 0.2
          },
          "<"
        );
    } else {
      tl.set(item, { color: activeLabel, fontWeight: 700 }, 0).to(
        [slidesLeft[j], slidesRight[j]],
        {
          autoAlpha: 1,
          duration: 0.2
        },
        "<"
      );
    }
  });

  const totalDuration = tl.duration();

  if (highlight && totalDuration > 0) {
    tl.fromTo(
      highlight,
      { left: "0%" },
      {
        left: `${maxLeftPct}%`,
        ease: "none",
        duration: totalDuration
      },
      0
    );
  }
});
