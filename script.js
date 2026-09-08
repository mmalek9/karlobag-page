(function () {
  "use strict";

  var rail = document.querySelector("[data-rail]");
  var progress = document.querySelector("[data-rail-progress]");
  var prevBtn = document.querySelector("[data-rail-prev]");
  var nextBtn = document.querySelector("[data-rail-next]");

  if (rail) {
    var step = function () {
      return Math.max(240, rail.clientWidth * 0.72);
    };
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        rail.scrollBy({ left: -step(), behavior: "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        rail.scrollBy({ left: step(), behavior: "smooth" });
      });
    }

    var syncProgress = function () {
      if (!progress) return;
      var max = rail.scrollWidth - rail.clientWidth;
      var visible = Math.max(6, (rail.clientWidth / rail.scrollWidth) * 100);
      progress.style.width = visible + "%";
      var travel = max > 0 ? (rail.scrollLeft / max) * ((100 - visible) / visible) * 100 : 0;
      progress.style.transform = "translateX(" + travel + "%)";
    };
    rail.addEventListener("scroll", syncProgress, { passive: true });
    window.addEventListener("resize", syncProgress);
    requestAnimationFrame(syncProgress);
    setTimeout(syncProgress, 600);

    rail.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      var atStart = e.deltaY < 0 && rail.scrollLeft <= 0;
      var atEnd = e.deltaY > 0 && rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1;
      if (atStart || atEnd) return;
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  var revealTargets = document.querySelectorAll("[data-reveal]");
  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealTargets.length && !prefersReducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.06 });
    revealTargets.forEach(function (t) { io.observe(t); });
  } else {
    revealTargets.forEach(function (t) { t.classList.add("is-visible"); });
  }
})();
