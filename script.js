function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');

  if (!menu || !icon) {
    return;
  }

  menu.classList.toggle('open');
  icon.classList.toggle('open');
}

function getProjectCards() {
  const projectGrid = document.querySelector('#projects .project-grid');

  if (!projectGrid) {
    return { projectGrid: null, cards: [] };
  }

  const cards = Array.from(projectGrid.querySelectorAll('.project-card'));
  return { projectGrid, cards };
}

function populateYearFilter(cards, yearSelect) {
  if (!yearSelect) {
    return;
  }

  const years = [...new Set(cards.map((card) => card.dataset.year).filter(Boolean))].sort((a, b) => Number(b) - Number(a));

  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });
}

function applyProjectFiltersAndSort() {
  const { projectGrid, cards } = getProjectCards();
  const sortSelect = document.querySelector('#project-sort');
  const yearSelect = document.querySelector('#project-year');
  const favoriteSelect = document.querySelector('#project-favorite');
  const searchInput = document.querySelector('#project-search');

  if (!projectGrid || !sortSelect || !yearSelect || !favoriteSelect || !searchInput) {
    return;
  }

  const order = sortSelect.value;
  const year = yearSelect.value;
  const favorite = favoriteSelect.value;
  const searchTerm = searchInput.value.trim().toLowerCase();

  const visibleCards = cards.filter((card) => {
    const matchesYear = year === 'all' || card.dataset.year === year;
    const matchesFavorite = favorite === 'all' || card.dataset.favorite === 'true';
    const searchableText = card.textContent.toLowerCase();
    const matchesSearch = !searchTerm || searchableText.includes(searchTerm);

    return matchesYear && matchesFavorite && matchesSearch;
  });

  visibleCards.sort((a, b) => {
    const aDate = new Date(a.dataset.date || '1970-01-01').getTime();
    const bDate = new Date(b.dataset.date || '1970-01-01').getTime();

    return order === 'oldest' ? aDate - bDate : bDate - aDate;
  });

  cards.forEach((card) => {
    card.style.display = 'none';
  });

  visibleCards.forEach((card) => {
    card.style.display = '';
    projectGrid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const { cards } = getProjectCards();
  const sortSelect = document.querySelector('#project-sort');
  const yearSelect = document.querySelector('#project-year');
  const favoriteSelect = document.querySelector('#project-favorite');
  const searchInput = document.querySelector('#project-search');

  if (!sortSelect || !yearSelect || !favoriteSelect || !searchInput) {
    return;
  }

  populateYearFilter(cards, yearSelect);
  applyProjectFiltersAndSort();

  sortSelect.addEventListener('change', applyProjectFiltersAndSort);
  yearSelect.addEventListener('change', applyProjectFiltersAndSort);
  favoriteSelect.addEventListener('change', applyProjectFiltersAndSort);
  searchInput.addEventListener('input', applyProjectFiltersAndSort);
});
