const loadComponent = async (id, file) => {
  try {
    const res = await fetch(file);
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

const renderProjects = async () => {
  try {
    const res = await fetch("data/projects.json");
    const projects = await res.json();

    const container = document.getElementById("projects-container");

    if (!container) {
      console.error("❌ #projects-container not found");
      return;
    }

    container.innerHTML = projects.map(p => `
      <div class="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg hover:scale-101 transition-all duration-300">

        <!-- Image -->
        <img src="${p.image}" class="w-full h-40 object-cover rounded mb-4" />

        <!-- Title -->
        <h3 class="text-xl font-semibold mb-1">${p.title}</h3>

        <!-- Duration -->
        <p class="text-sm text-gray-500 mb-2">${p.duration}</p>

        <!-- Description -->
        <p class="text-gray-600 mb-4 text-sm">
          ${p.description}
        </p>

        <!-- Guide -->
        ${p.guide ? `<p class="text-xs text-gray-500 mb-3">Guide: ${p.guide}</p>` : ""}

        <!-- Keywords -->
        <div class="flex flex-wrap gap-2 mb-4">
          ${p.keywords.map(k => `
            <span class="text-xs px-2 py-1 bg-gray-100 rounded">${k}</span>
          `).join("")}
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center text-sm">

          ${p.report 
            ? `<button onclick="openPDF('${p.report}')" class="text-blue-600 hover:underline">
                 View Report
               </button>` 
            : `<span></span>`
          }

          <a href="${p.github}" target="_blank" class="text-gray-700 hover:underline">
            GitHub
          </a>

        </div>

      </div>
    `).join("");

  } catch (err) {
    console.error("❌ Failed to render projects", err);
  }
};

(async () => {
  try {
    await loadComponent("header", "components/header.html");
    initMenu();

    await loadComponent("hero", "components/hero.html");
    await loadComponent("about", "components/about.html");

    // ✅ IMPORTANT: wait before rendering
    await loadComponent("projects", "components/projects.html");
    await renderProjects();

    await loadComponent("skills", "components/skills.html");
    await loadComponent("achievements", "components/achievements.html");
    await loadComponent("education", "components/education.html");

  } catch (err) {
    console.error("❌ App initialization failed", err);
  }
})();