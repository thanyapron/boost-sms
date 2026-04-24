const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

const closeMobileMenu = () => {
  navToggle?.classList.remove("active");
  mobileMenu?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = mobileMenu?.classList.toggle("open");
  navToggle.classList.toggle("active", !!isOpen);
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMobileMenu());
});

document.addEventListener("click", (e) => {
  if (!mobileMenu?.classList.contains("open")) return;
  if (mobileMenu.contains(e.target) || navToggle?.contains(e.target)) return;
  closeMobileMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const button = item.querySelector(".faq-q");
  button?.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach((node) => node.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".service-panel");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.target;
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    panels.forEach((p) => {
      p.classList.toggle("active", p.dataset.panel === target);
    });
  });
});

const reviewsViewport = document.querySelector(".reviews-viewport");
const reviewsTrack = document.querySelector(".reviews-track");
const reviewsDots = document.querySelectorAll(".reviews-dot");

const stepSize = () => {
  const card = reviewsTrack?.querySelector(".review-card");
  const gap = reviewsTrack ? parseFloat(getComputedStyle(reviewsTrack).gap) || 0 : 0;
  return (card?.offsetWidth || 0) + gap;
};

reviewsDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const slide = Number(dot.dataset.slide || 0);
    reviewsViewport?.scrollTo({ left: slide * stepSize(), behavior: "smooth" });
  });
});

reviewsViewport?.addEventListener("scroll", () => {
  const step = stepSize();
  if (!step) return;
  const index = Math.round(reviewsViewport.scrollLeft / step);
  reviewsDots.forEach((d, i) => d.classList.toggle("active", i === index));
});

let isDown = false;
let startX = 0;
let startScroll = 0;
reviewsViewport?.addEventListener("mousedown", (e) => {
  isDown = true;
  reviewsViewport.classList.add("dragging");
  startX = e.pageX - reviewsViewport.offsetLeft;
  startScroll = reviewsViewport.scrollLeft;
});
reviewsViewport?.addEventListener("mouseleave", () => {
  isDown = false;
  reviewsViewport.classList.remove("dragging");
});
reviewsViewport?.addEventListener("mouseup", () => {
  isDown = false;
  reviewsViewport.classList.remove("dragging");
});
reviewsViewport?.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - reviewsViewport.offsetLeft;
  const walk = (x - startX) * 1.4;
  reviewsViewport.scrollLeft = startScroll - walk;
});

const blogGrid = document.querySelector(".blog-grid");
const blogDotsContainer = document.querySelector(".blog-dots");

if (blogGrid && blogDotsContainer) {
  const blogCards = blogGrid.querySelectorAll(".blog-card");
  blogCards.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `บทความที่ ${i + 1}`);
    if (i === 0) b.classList.add("active");
    b.addEventListener("click", () => {
      const card = blogCards[i];
      blogGrid.scrollTo({ left: card.offsetLeft - blogGrid.offsetLeft, behavior: "smooth" });
    });
    blogDotsContainer.appendChild(b);
  });

  const syncBlogDots = () => {
    const first = blogCards[0];
    const second = blogCards[1];
    if (!first || !second) return;
    const step = second.offsetLeft - first.offsetLeft;
    if (!step) return;
    const idx = Math.round(blogGrid.scrollLeft / step);
    blogDotsContainer.querySelectorAll("button").forEach((d, i) => d.classList.toggle("active", i === idx));
  };
  blogGrid.addEventListener("scroll", syncBlogDots, { passive: true });
}

document.querySelectorAll(".pricing-rows").forEach((rows) => {
  rows.querySelectorAll(".plan-row").forEach((row) => {
    const dots = row.nextElementSibling;
    if (!dots || !dots.classList.contains("plan-dots")) return;
    const plans = row.querySelectorAll(".plan");
    dots.innerHTML = "";
    plans.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `แพ็กเกจที่ ${i + 1}`);
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => {
        const card = plans[i];
        row.scrollTo({ left: card.offsetLeft - row.offsetLeft, behavior: "smooth" });
      });
      dots.appendChild(b);
    });
    const syncDots = () => {
      const first = plans[0];
      const second = plans[1];
      if (!first || !second) return;
      const step = second.offsetLeft - first.offsetLeft;
      if (!step) return;
      const idx = Math.round(row.scrollLeft / step);
      dots.querySelectorAll("button").forEach((d, i) => d.classList.toggle("active", i === idx));
    };
    row.addEventListener("scroll", syncDots, { passive: true });
  });
});

if (reviewsViewport && reviewsTrack) {
  const totalCards = reviewsTrack.querySelectorAll(".review-card").length;
  const visible = 3;
  const maxIndex = Math.max(0, totalCards - visible);
  let autoIndex = 0;
  let autoTimer = null;
  let userPaused = false;

  const goTo = (index) => {
    reviewsViewport.scrollTo({ left: index * stepSize(), behavior: "smooth" });
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => {
      if (userPaused) return;
      autoIndex = autoIndex >= maxIndex ? 0 : autoIndex + 1;
      goTo(autoIndex);
    }, 4000);
  };

  const stopAuto = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  reviewsViewport.addEventListener("scroll", () => {
    autoIndex = Math.round(reviewsViewport.scrollLeft / stepSize());
  });

  const pause = () => {
    userPaused = true;
  };
  const resume = () => {
    userPaused = false;
  };

  reviewsViewport.addEventListener("mouseenter", pause);
  reviewsViewport.addEventListener("mouseleave", resume);
  reviewsViewport.addEventListener("touchstart", pause, { passive: true });
  reviewsViewport.addEventListener("touchend", resume);
  reviewsDots.forEach((d) => d.addEventListener("click", () => {
    userPaused = false;
    autoIndex = Number(d.dataset.slide || 0);
  }));

  startAuto();
}
