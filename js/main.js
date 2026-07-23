/* ============================================================
   RC Fragnance — shared interactivity (jQuery + GSAP + Lenis)
   Mirrors the behavior of the Next.js/React/Framer Motion source,
   feature-detected per page so one file works everywhere.
   ============================================================ */
(function ($) {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------------------------------------------------- */
  /* Preloader                                                    */
  /* ---------------------------------------------------------- */
  function initPreloader() {
    var $pre = $("#preloader");
    if ($pre.length === 0) return;

    if (reduceMotion) {
      $pre.remove();
      return;
    }

    var DURATION = 1800;
    var start = Date.now();
    $("body").css("overflow", "hidden");

    var interval = setInterval(function () {
      var pct = Math.min(100, Math.round(((Date.now() - start) / DURATION) * 100));
      $("#preloader-curtain").css("width", (100 - pct) + "%");
      $("#preloader-pct").text(String(pct).padStart(3, "0") + "%");
      $("#preloader-pct-wrap").css("opacity", Math.max(0, 1 - Math.max(0, pct - 85) / 15));
      if (pct >= 100) clearInterval(interval);
    }, 40);

    var revealTimer = setTimeout(function () {
      $("#preloader-icon, .preloader-word").addClass("show");
    }, DURATION + 150);

    var finish = setTimeout(finishPreloader, DURATION + 900);
    var failsafe = setTimeout(finishPreloader, 5000);

    function finishPreloader() {
      clearInterval(interval);
      clearTimeout(revealTimer);
      clearTimeout(finish);
      clearTimeout(failsafe);
      $("body").css("overflow", "");
      $pre.addClass("hide");
      setTimeout(function () {
        $pre.remove();
      }, 850);
    }
  }

  /* ---------------------------------------------------------- */
  /* Smooth scroll (Lenis) + GSAP ticker sync                    */
  /* ---------------------------------------------------------- */
  var lenis = null;
  function initSmoothScroll() {
    if (reduceMotion || typeof Lenis === "undefined") return;
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return 1 - Math.pow(1 - t, 3); },
      smoothWheel: true,
      touchMultiplier: 1.1,
    });
    if (typeof gsap !== "undefined") {
      lenis.on("scroll", function () {
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.update();
      });
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /* ---------------------------------------------------------- */
  /* Scroll progress bar                                          */
  /* ---------------------------------------------------------- */
  function initScrollProgress() {
    var $bar = $("#scroll-progress");
    if ($bar.length === 0) return;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? window.scrollY / max : 0;
      $bar.css("transform", "scaleX(" + pct + ")");
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------------------------------------------------------- */
  /* Navbar: hide-at-top (home only) + hover pill/dropdown        */
  /* ---------------------------------------------------------- */
  function initNavbar() {
    var $navWrap = $("#nav-wrap");
    if ($navWrap.length === 0) return;
    var isHome = $navWrap.data("home") === true || $navWrap.data("home") === "true";

    function onScroll() {
      var scrolled = window.scrollY > 24;
      if (isHome) {
        $navWrap.toggleClass("hidden-at-top", !scrolled);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Shared sliding hover-pill (layoutId equivalent): move one pill
    // element to whichever nav-link-item is hovered. Touch devices fire
    // mouseenter on tap but never mouseleave, leaving the pill stuck —
    // so only enable it for real hover-capable pointers.
    if (finePointer) {
      var $pill = $('<div class="nav-hover-pill" style="opacity:0;"></div>');
      var $list = $("#nav-links");
      $list.css("position", "relative").prepend($pill);
      $pill.css({ position: "absolute", inset: 0, "z-index": 0 });

      $(".nav-link-item").on("mouseenter", function () {
        var $item = $(this);
        var offset = $item.position();
        $pill.stop(true).animate(
          { left: offset.left, top: offset.top, width: $item.outerWidth(), height: $item.outerHeight(), opacity: 1 },
          { duration: 220, easing: "swing" }
        );
      });
      $list.on("mouseleave", function () {
        $pill.stop(true).animate({ opacity: 0 }, 200);
      });
    }
  }

  /* ---------------------------------------------------------- */
  /* Reveal-on-scroll (Framer whileInView equivalent)             */
  /* ---------------------------------------------------------- */
  function initReveals() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var mountItems = document.querySelectorAll('[data-reveal-trigger="mount"]');
    mountItems.forEach(function (el) {
      requestAnimationFrame(function () { el.classList.add("is-visible"); });
    });

    var viewItems = Array.prototype.filter.call(items, function (el) {
      return el.getAttribute("data-reveal-trigger") !== "mount";
    });

    // 0.3 was too strict for tall blocks on small screens (30% of a
    // near-viewport-height element may take a lot of scroll to show),
    // leaving mobile sections stuck invisible.
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    viewItems.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------- */
  /* Line-split heading reveal (SplitReveal equivalent)           */
  /* Wraps each word in a span, groups by line via offsetTop,     */
  /* wraps each line in an overflow-hidden div, animates in.      */
  /* ---------------------------------------------------------- */
  function splitLines($el) {
    var text = $el.data("orig-text") || $el.text();
    $el.data("orig-text", text);
    var words = text.split(" ");
    $el.empty();
    words.forEach(function (w, i) {
      $el.append($("<span/>").addClass("sl-word").text(w));
      if (i < words.length - 1) $el.append(" ");
    });

    var $words = $el.find(".sl-word");
    var lines = [];
    var currentTop = null;
    var currentLine = [];
    $words.each(function () {
      var top = this.offsetTop;
      if (currentTop === null || Math.abs(top - currentTop) < 2) {
        currentLine.push(this);
        currentTop = top;
      } else {
        lines.push(currentLine);
        currentLine = [this];
        currentTop = top;
      }
    });
    if (currentLine.length) lines.push(currentLine);

    $el.empty();
    lines.forEach(function (lineEls, i) {
      var $lineWrap = $('<span class="split-line"></span>');
      var $inner = $('<span class="split-line-inner"></span>').css({
        display: "inline-block",
        transform: "translateY(110%)",
        opacity: 0,
        transition: "transform 1s cubic-bezier(0.16,1,0.3,1) " + (i * 0.09) + "s, opacity 1s cubic-bezier(0.16,1,0.3,1) " + (i * 0.09) + "s",
      });
      lineEls.forEach(function (wordEl, wi) {
        $inner.append($(wordEl));
        if (wi < lineEls.length - 1) $inner.append(" ");
      });
      $lineWrap.append($inner);
      $el.append($lineWrap);
    });
  }

  function initSplitReveal() {
    var $targets = $("[data-split-reveal]");
    if (!$targets.length) return;

    function playIn($el) {
      $el.data("revealed", true);
      $el.find(".split-line-inner").css({ transform: "translateY(0)", opacity: 1 });
    }

    function build() {
      $targets.each(function () {
        var $el = $(this);
        splitLines($el);
        if (reduceMotion || $el.data("revealed")) {
          $el.find(".split-line-inner").css({ transform: "none", opacity: 1, transition: "none" });
        }
      });
    }

    function arm() {
      build();

      if (reduceMotion) {
        $targets.each(function () { $(this).data("revealed", true); });
        return;
      }

      $targets.each(function () {
        var $el = $(this);
        if ($el.data("split-trigger") === "load") {
          setTimeout(function () { playIn($el); }, 50);
        } else {
          var io = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  playIn($(entry.target));
                  io.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.15 }
          );
          io.observe(this);
        }
      });

      // Line grouping depends on where words wrap, so rebuild when the
      // viewport width really changes (orientation flip) — but ignore
      // mobile URL-bar show/hide, which only changes the height.
      var lastW = window.innerWidth;
      var resizeTimer = null;
      window.addEventListener("resize", function () {
        if (Math.abs(window.innerWidth - lastW) < 24) return;
        lastW = window.innerWidth;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 150);
      });
    }

    // Fraunces has very different metrics from the fallback serif; splitting
    // before the webfont arrives groups words into the wrong lines and the
    // reveal animates broken line breaks (most visible on narrow screens).
    var started = false;
    function kick() {
      if (started) return;
      started = true;
      arm();
    }
    if (document.fonts && document.fonts.ready && !reduceMotion) {
      document.fonts.ready.then(kick);
      setTimeout(kick, 2500);
    } else {
      kick();
    }
  }

  /* ---------------------------------------------------------- */
  /* Counter (stat count-up)                                      */
  /* ---------------------------------------------------------- */
  function initCounters() {
    var $counters = $("[data-counter-to]");
    if (!$counters.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var $el = $(entry.target);
          io.unobserve(entry.target);
          var to = parseInt($el.attr("data-counter-to"), 10);
          var suffix = $el.attr("data-counter-suffix") || "";
          var prefix = $el.attr("data-counter-prefix") || "";
          if (reduceMotion) {
            $el.text(prefix + to + suffix);
            return;
          }
          $({ v: 0 }).animate(
            { v: to },
            {
              duration: 1400,
              easing: "swing",
              step: function (v) { $el.text(prefix + Math.round(v) + suffix); },
              complete: function () { $el.text(prefix + to + suffix); },
            }
          );
        });
      },
      { threshold: 0.6 }
    );
    $counters.each(function () { io.observe(this); });
  }

  /* ---------------------------------------------------------- */
  /* TiltCard: 3D tilt + glow following the mouse                 */
  /* ---------------------------------------------------------- */
  function initTiltCards() {
    if (!finePointer) return;
    $(".tilt-card").each(function () {
      var $card = $(this);
      var max = parseFloat($card.data("tilt-max")) || 8;
      var $glow = $card.find(".tilt-glow");

      $card.on("mousemove", function (e) {
        var rect = this.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rotateX = (py - 0.5) * -2 * max;
        var rotateY = (px - 0.5) * 2 * max;
        $card.css("transform", "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)");
        $glow.css({ "--gx": (px * 100) + "%", "--gy": (py * 100) + "%" });
      });
      $card.on("mouseleave", function () {
        $card.css("transform", "perspective(800px) rotateX(0deg) rotateY(0deg)");
      });
    });
  }

  /* ---------------------------------------------------------- */
  /* Magnetic buttons                                              */
  /* ---------------------------------------------------------- */
  function initMagnetic() {
    if (!finePointer) return;
    $(".magnetic").each(function () {
      var $el = $(this);
      var strength = parseFloat($el.data("magnetic-strength")) || 0.35;
      $el.on("mousemove", function (e) {
        var rect = this.getBoundingClientRect();
        var relX = e.clientX - (rect.left + rect.width / 2);
        var relY = e.clientY - (rect.top + rect.height / 2);
        $el.css("transform", "translate(" + relX * strength + "px, " + relY * strength + "px)");
      });
      $el.on("mouseleave", function () {
        $el.css("transform", "translate(0, 0)");
      });
    });
  }

  /* ---------------------------------------------------------- */
  /* Hero scroll-expand (home page only)                          */
  /* ---------------------------------------------------------- */
  function initHero() {
    var $track = $("#hero-track");
    if ($track.length === 0) return;

    var startW, startH;
    function computeSizes() {
      var mobile = window.matchMedia("(max-width: 767px)").matches;
      startW = mobile ? 90 : 58;
      startH = mobile ? 68 : 70;
    }
    computeSizes();
    var phase = "intro";

    var $media = $("#hero-media");
    var $intro = $("#hero-intro");
    var $scrollhint = $("#hero-scrollhint");
    var $final = $("#hero-final");
    var $overlay = $("#hero-media-overlay");

    function clamp01(v) { return Math.max(0, Math.min(1, v)); }
    function lerp(a, b, t) { return a + (b - a) * t; }

    function onUpdate() {
      var rect = $track[0].getBoundingClientRect();
      var trackHeight = $track.outerHeight();
      var viewportH = window.innerHeight;
      var scrolled = -rect.top;
      var progress = clamp01(scrolled / (trackHeight - viewportH));

      var t = clamp01(progress / 0.7);
      var w = lerp(startW, 100, t);
      var h = lerp(startH, 100, t);
      var radius = lerp(24, 0, t);
      $media.css({ width: w + "vw", height: h + "vh", borderRadius: radius + "px" });

      var overlayT = clamp01((progress - 0.5) / 0.25);
      $overlay.css("opacity", overlayT);

      var nextPhase = progress < 0.12 ? "intro" : progress < 0.58 ? "mid" : "final";
      if (nextPhase !== phase) {
        phase = nextPhase;
        $intro.add($scrollhint).css({
          opacity: phase === "intro" ? 1 : 0,
          transform: phase === "intro" ? "translateY(0)" : "translateY(-20px)",
          "pointer-events": phase === "intro" ? "auto" : "none",
        });
        $final.css({
          opacity: phase === "final" ? 1 : 0,
          transform: phase === "final" ? "translateY(0)" : "translateY(24px)",
          "pointer-events": phase === "final" ? "auto" : "none",
        });
      }
    }

    // Lenis animates the real scroll position, so native scroll events fire
    // either way — listen to both so the hero keeps tracking on touch
    // devices even if Lenis's own event emission hiccups.
    if (lenis) {
      lenis.on("scroll", onUpdate);
    }
    window.addEventListener("scroll", onUpdate, { passive: true });
    window.addEventListener("resize", function () {
      computeSizes();
      onUpdate();
    });
    onUpdate();

    var video = document.getElementById("hero-video");
    if (video) {
      var tryPlay = function () { video.play().catch(function () {}); };
      tryPlay();
      video.addEventListener("loadedmetadata", tryPlay);
      video.addEventListener("canplay", tryPlay);
    }
  }

  /* ---------------------------------------------------------- */
  /* Essential Oils carousel (home page)                          */
  /* ---------------------------------------------------------- */
  function initOilsCarousel() {
    var $track = $("#oils-track");
    if ($track.length === 0) return;

    var track = $track[0];
    var $slides = $track.children();
    var count = $slides.length;
    if (count < 2) return;

    var index = 0;
    var paused = false;
    var AUTO_MS = 5000;
    var autoTimer = null;
    var syncTimer = null;

    function setDot(i) {
      $(".oils-dot").removeClass("active").eq(i).addClass("active");
    }

    // jQuery .animate({scrollLeft}) fights the track's mandatory scroll
    // snapping (the browser re-snaps every intermediate frame), so scroll
    // natively — the snap-aligned target position keeps the two in accord.
    function goTo(i) {
      index = ((i % count) + count) % count;
      var left = $slides.eq(index)[0].offsetLeft - track.offsetLeft;
      if (track.scrollTo) {
        track.scrollTo({ left: left, behavior: reduceMotion ? "auto" : "smooth" });
      } else {
        track.scrollLeft = left;
      }
      setDot(index);
    }

    function restartAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        if (!paused && !document.hidden) goTo(index + 1);
      }, AUTO_MS);
    }

    $("#oils-prev").on("click", function () { goTo(index - 1); restartAuto(); });
    $("#oils-next").on("click", function () { goTo(index + 1); restartAuto(); });
    $(".oils-dot").on("click", function () { goTo($(this).index()); restartAuto(); });

    // Keep index + dots in sync when the user swipes the track directly.
    $track.on("scroll", function () {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(function () {
        var i = Math.round(track.scrollLeft / (track.clientWidth || 1));
        i = Math.max(0, Math.min(count - 1, i));
        if (i !== index) {
          index = i;
          setDot(index);
        }
      }, 100);
    });

    $track.on("mouseenter", function () { paused = true; });
    $track.on("mouseleave", function () { paused = false; });
    $track.on("touchstart", function () { paused = true; restartAuto(); });
    $track.on("touchend touchcancel", function () { paused = false; });

    restartAuto();
  }

  /* ---------------------------------------------------------- */
  /* Oil detail modal ("Also in the collection" grid)             */
  /* ---------------------------------------------------------- */
  function initOilModal() {
    var $modal = $("#oil-modal");
    if ($modal.length === 0) return;

    function openModal(name) {
      var oil = ALL_OILS.filter(function (o) { return o.name === name; })[0];
      if (!oil) return;
      $("#oil-modal-img").attr("src", OIL_IMAGES[oil.name]).attr("alt", oil.name + " essential oil");
      $("#oil-modal-name").text(oil.name);
      $("#oil-modal-desc").text(oil.description);
      $("#oil-modal-top").text(oil.top.join(", "));
      $("#oil-modal-middle").text(oil.middle.join(", "));
      $("#oil-modal-base").text(oil.base.join(", "));
      $modal.css("display", "flex").hide().fadeIn(200);
      $("body").css("overflow", "hidden");
    }
    function closeModal() {
      $modal.fadeOut(200, function () {
        $("body").css("overflow", "");
      });
    }

    $(document).on("click", "[data-oil-open]", function (e) {
      e.preventDefault();
      openModal($(this).attr("data-oil-open"));
    });
    $modal.on("click", function (e) {
      if (e.target === this) closeModal();
    });
    $("#oil-modal-close").on("click", closeModal);
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ---------------------------------------------------------- */
  /* Contact form (mailto, matches Contact.tsx behavior)          */
  /* ---------------------------------------------------------- */
  function initContactForm() {
    var $form = $("#contact-form");
    if ($form.length === 0) return;

    $form.find("input, textarea").on("focus blur input", function () {
      var $field = $(this).closest(".form-field");
      var floated = $(this).is(":focus") || $(this).val().length > 0;
      $field.toggleClass("floated", floated);
    });

    $form.on("submit", function (e) {
      e.preventDefault();
      var name = $("#contact-name").val();
      var email = $("#contact-email").val();
      var message = $("#contact-message").val();
      var subject = encodeURIComponent("Enquiry from " + (name || "the RC Fragnance site"));
      var body = encodeURIComponent(message + "\n\n— " + name + "\n" + email);
      window.location.href = "mailto:" + CONTACT.email + "?subject=" + subject + "&body=" + body;

      $form.hide();
      $("#contact-sent").show();
    });

    $("#contact-send-another").on("click", function () {
      $form[0].reset();
      $form.find(".form-field").removeClass("floated");
      $("#contact-sent").hide();
      $form.show();
    });
  }

  /* ---------------------------------------------------------- */
  /* Footer year                                                   */
  /* ---------------------------------------------------------- */
  function initFooterYear() {
    $("#footer-year").text(new Date().getFullYear());
  }

  /* ---------------------------------------------------------- */
  /* Mobile nav dropdown (tap-to-toggle on touch devices)          */
  /* ---------------------------------------------------------- */
  function initTouchDropdown() {
    if (finePointer) return;
    $(".nav-link-item[data-has-children]").on("click", function (e) {
      var $item = $(this);
      if (!$item.hasClass("dropdown-open")) {
        e.preventDefault();
        $(".nav-link-item").removeClass("dropdown-open");
        $item.addClass("dropdown-open");
      }
    });
    // Tap anywhere outside the nav closes an open dropdown.
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".nav-link-item[data-has-children]").length) {
        $(".nav-link-item").removeClass("dropdown-open");
      }
    });
  }

  /* ---------------------------------------------------------- */
  /* Image recovery: retry images that fail on flaky connections   */
  /* ---------------------------------------------------------- */
  function initImageRecovery() {
    var MAX_RETRIES = 2;

    function retry(img) {
      var tries = parseInt(img.getAttribute("data-img-retries") || "0", 10);
      if (tries >= MAX_RETRIES) return;
      img.setAttribute("data-img-retries", String(tries + 1));
      setTimeout(function () {
        img.src = img.src.split("?")[0] + "?retry=" + (tries + 1);
      }, 700 * (tries + 1));
    }

    // Error events on <img> don't bubble, so listen in the capture phase.
    document.addEventListener("error", function (e) {
      var el = e.target;
      if (el && el.tagName === "IMG" && el.getAttribute("src")) retry(el);
    }, true);

    // Catch images that already failed before this handler was attached.
    function sweep() {
      Array.prototype.forEach.call(document.images, function (img) {
        if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) retry(img);
      });
    }
    sweep();
    window.addEventListener("load", sweep);
  }

  $(function () {
    initImageRecovery();
    initPreloader();
    initSmoothScroll();
    initScrollProgress();
    initNavbar();
    initTouchDropdown();
    initReveals();
    initSplitReveal();
    initCounters();
    initTiltCards();
    initMagnetic();
    initHero();
    initOilsCarousel();
    initOilModal();
    initContactForm();
    initFooterYear();
  });
})(jQuery);
