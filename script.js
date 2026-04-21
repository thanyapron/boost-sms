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
