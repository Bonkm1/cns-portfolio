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
const projectPanels = Array.from(document.querySelectorAll("[data-project-panel]"));

const activateProject = (projectId) => {
  projectTabs.forEach((tab) => {
    const isActive = tab.dataset.projectTab === projectId;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  projectPanels.forEach((panel) => {
    const isActive = panel.dataset.projectPanel === projectId;
    panel.hidden = !isActive;
    panel.classList.toggle("active", isActive);
    if (isActive) {
      panel.classList.add("visible");
    }
  });
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

const pdfViewer = document.querySelector("#pdf-viewer");
const pdfFrame = document.querySelector("#pdf-frame");
const pdfTitle = document.querySelector("#pdf-title");
const pdfOpenDirect = document.querySelector("#pdf-open-direct");

const openPdfViewer = (link) => {
  const card = link.closest(".project-card");
  const title = card?.querySelector("h3")?.textContent?.trim() || "Tài liệu PDF";
  const pdfUrl = link.getAttribute("href");

  pdfTitle.textContent = title;
  pdfOpenDirect.href = pdfUrl;
  pdfFrame.src = `${pdfUrl}#toolbar=1&navpanes=0`;
  pdfViewer.classList.add("active");
  pdfViewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("pdf-open");
};

const closePdfViewer = () => {
  pdfViewer.classList.remove("active");
  pdfViewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("pdf-open");
  pdfFrame.src = "";
};

document.querySelectorAll(".file-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openPdfViewer(link);
  });
});

document.querySelectorAll("[data-pdf-close]").forEach((button) => {
  button.addEventListener("click", closePdfViewer);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && pdfViewer.classList.contains("active")) {
    closePdfViewer();
  }
});
