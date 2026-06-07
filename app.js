const progressBar = document.querySelector(".progress span");
const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
};

const setActiveNav = () => {
  const current = sections.reduce((active, section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 130 ? section : active;
  }, sections[0]);

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${current.id}`;
    link.classList.toggle("active", isActive);
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  revealObserver.observe(element);
});

window.addEventListener("scroll", () => {
  updateProgress();
  setActiveNav();
});

window.addEventListener("load", () => {
  updateProgress();
  setActiveNav();
});

const projectTabs = Array.from(document.querySelectorAll("[data-project-tab]"));
const projectPdfFrame = document.querySelector("#project-pdf-frame");
const projectPdfTitle = document.querySelector("#project-pdf-title");
const projectPdfPanel = document.querySelector("#project-pdf-panel");

const activateProject = (projectId) => {
  let activeTab = null;

  projectTabs.forEach((tab) => {
    const isActive = tab.dataset.projectTab === projectId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    if (isActive) {
      activeTab = tab;
    }
  });

  if (!activeTab || !projectPdfFrame || !projectPdfTitle || !projectPdfPanel) {
    return;
  }

  const pdfUrl = activeTab.dataset.pdf;
  const title = activeTab.dataset.title || activeTab.textContent.trim();

  projectPdfTitle.textContent = title;
  projectPdfPanel.setAttribute("aria-labelledby", activeTab.id);
  projectPdfFrame.src = `${pdfUrl}#toolbar=1&navpanes=0`;
};

projectTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    activateProject(tab.dataset.projectTab);
  });

  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + projectTabs.length) % projectTabs.length;
    const nextTab = projectTabs[nextIndex];
    nextTab.focus();
    activateProject(nextTab.dataset.projectTab);
  });
});
