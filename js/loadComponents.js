const loadComponent = async (id, file) => {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
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
  const res = await fetch("data/projects.json");
  const projects = await res.json();

  const container = document.getElementById("projects-container");

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
        ${p.keywords.map(k => `<span class="text-xs px-2 py-1 bg-gray-100 rounded">${k}</span>`).join("")}
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
};

(async () => {
  await loadComponent("header", "components/header.html");
  initMenu();
  loadComponent("hero", "components/hero.html");
  loadComponent("about", "components/about.html");
  loadComponent("projects", "components/projects.html");
  await renderProjects();
  // loadComponent("experience", "components/experience.html");
  loadComponent("skills", "components/skills.html");
  loadComponent("achievements", "components/achievements.html");
  loadComponent("education", "components/education.html");
})();