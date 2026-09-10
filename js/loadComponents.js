const loadComponent = async (id, file) => {
  try {
    const res = await fetch(file, { cache: "no-cache" });
    const html = await res.text();

    const el = document.getElementById(id);
    if (!el) {
      console.error(`❌ Element with id "${id}" not found`);
      return;
    }

    el.innerHTML = html;
  } catch (err) {
    console.error(`❌ Failed to load component: ${file}`, err);
  }
};

const initMenu = () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
};

const initThemeToggle = () => {
  const btn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-toggle-icon");

  if (!btn) return;

  const updateIcon = () => {
    if (icon) {
      icon.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
    }
  };

  updateIcon();

  btn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
    updateIcon();
  });
};

const renderExperience = async () => {
  try {
    const res = await fetch("data/experience.json", { cache: "no-cache" });
    const experiences = await res.json();

    const container = document.getElementById("experience-container");

    if (!container) {
      console.error("❌ #experience-container not found");
      return;
    }

    container.innerHTML = experiences
      .map(
        (e) => `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">

        <!-- Image -->
        <img src="${e.image}" class="w-full h-40 object-cover rounded mb-4" />

        <!-- Title -->
        <h3 class="text-2xl font-semibold my-4">${e.title}</h3>

        <!-- Organization / Location -->
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          ${e.organization}${e.location ? ` • ${e.location}` : ""}
        </p>

        <!-- Duration -->
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${e.duration}</p>

        <!-- Description -->
        <p class="text-gray-600 dark:text-gray-400 mb-4 text-base">
          ${e.description}
        </p>

        <!-- Keywords -->
        <div class="flex flex-wrap gap-2">
          ${e.keywords
            .map(
              (k) => `
            <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">${k}</span>
          `,
            )
            .join("")}
        </div>

      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error("❌ Failed to render experience", err);
  }
};

const renderProjects = async () => {
  try {
    const res = await fetch("data/projects.json", { cache: "no-cache" });
    const projects = await res.json();

    const container = document.getElementById("projects-container");

    if (!container) {
      console.error("❌ #projects-container not found");
      return;
    }

    container.innerHTML = projects
      .map(
        (p) => `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">

        <!-- Image -->
        <img src="${p.image}" class="w-full h-40 object-cover rounded mb-4" />

        <!-- Title -->
        <h3 class="text-2xl font-semibold my-4">${p.title}</h3>

        <!-- Duration -->
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${p.duration}</p>

        <!-- Description -->
        <p class="text-gray-600 dark:text-gray-400 mb-4 text-base">
          ${p.description}
        </p>

        <!-- Guide -->
        ${p.guide ? `<p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Guide: ${p.guide}</p>` : ""}

        <!-- Keywords -->
        <div class="flex flex-wrap gap-2 mb-4">
          ${p.keywords
            .map(
              (k) => `
            <span class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded">${k}</span>
          `,
            )
            .join("")}
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center text-sm">

          ${p.report
            ? `<button onclick="openPDF('${p.report}')" class="text-blue-600 dark:text-blue-400 hover:underline">
                 View Report
               </button>`
            : `<span></span>`
          }

          <a href="${p.github}" target="_blank" class="text-gray-700 dark:text-gray-300 hover:underline">
            GitHub
          </a>

        </div>

      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error("❌ Failed to render projects", err);
  }
};

(async () => {
  try {
    await loadComponent("header", "components/header.html");
    initMenu();
    initThemeToggle();

    await loadComponent("hero", "components/hero.html");
    await loadComponent("about", "components/about.html");

    // ✅ IMPORTANT: wait before rendering
    await loadComponent("experience", "components/experience.html");
    await renderExperience();

    await loadComponent("projects", "components/projects.html");
    await renderProjects();

    await loadComponent("achievements", "components/achievements.html");
    await loadComponent("skills", "components/skills.html");
    await loadComponent("education", "components/education.html");
  } catch (err) {
    console.error("❌ App initialization failed", err);
  }
})();
