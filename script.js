/**
 * TaskFlow - Modern Todo Application
 * Fully functional Vanilla JavaScript (ES6+) implementation
 */

'use strict';

// =============================================================================
// Constants & Configuration
// =============================================================================
const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v1',
  THEME: 'taskflow_theme'
};

const CATEGORIES = ['Personal', 'Work', 'Study', 'Other'];
const PRIORITIES = {
  Low: { value: 1, label: 'Low', badgeClass: 'badge-prio-Low' },
  Medium: { value: 2, label: 'Medium', badgeClass: 'badge-prio-Medium' },
  High: { value: 3, label: 'High', badgeClass: 'badge-prio-High' }
};

// Initial sample tasks loaded if storage is empty
const INITIAL_SAMPLE_TASKS = [
  {
    id: 'sample-1',
    title: 'Complete System Architecture Review',
    description: 'Review client requirements, verify scalability metrics, and finalize API documentation.',
    category: 'Work',
    priority: 'High',
    dueDate: getRelativeDateString(1, 14, 0), // Tomorrow at 2:00 PM
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: 'sample-2',
    title: 'Prepare JavaScript ES6+ Study Notes',
    description: 'Review Closures, Event Loop, Prototypes, and Async/Await patterns for upcoming workshop.',
    category: 'Study',
    priority: 'Medium',
    dueDate: getRelativeDateString(3, 10, 30), // In 3 days at 10:30 AM
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'sample-3',
    title: 'Grocery shopping & meal prep',
    description: 'Buy fresh vegetables, olive oil, Greek yogurt, and prep protein meals for the week.',
    category: 'Personal',
    priority: 'Low',
    dueDate: getRelativeDateString(2, 18, 0), // In 2 days at 6:00 PM
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
  },
  {
    id: 'sample-4',
    title: 'Submit quarterly tax assessment',
    description: 'Collect digital receipts and send accounting forms to the accountant.',
    category: 'Other',
    priority: 'High',
    dueDate: getRelativeDateString(-1, 16, 0), // Yesterday at 4:00 PM (demonstrates overdue)
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
  }
];

// Helper to generate ISO strings offset by days and time
function getRelativeDateString(daysOffset, hours, minutes) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  // Format for datetime-local input: YYYY-MM-DDTHH:mm
  const pad = num => String(num).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const m = pad(d.getMinutes());
  return `${year}-${month}-${day}T${h}:${m}`;
}

// =============================================================================
// Application State
// =============================================================================
const state = {
  tasks: [],
  filters: {
    status: 'all',      // 'all', 'active', 'pending', 'completed', 'overdue'
    category: 'all',    // 'all', 'Personal', 'Work', 'Study', 'Other'
    searchQuery: ''     // string keyword
  },
  sortBy: 'dueDateAsc', // 'dueDateAsc', 'dueDateDesc', 'priorityDesc', 'priorityAsc', 'alphaAsc', 'alphaDesc', 'createdDesc', 'createdAsc'
  editingTaskId: null,
  pendingAction: null   // callback for confirmation modal
};

// =============================================================================
// DOM Elements Cache
// =============================================================================
const DOM = {
  // Theme
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),

  // Mobile sidebar
  sidebar: document.getElementById('sidebar'),
  sidebarBackdrop: document.getElementById('sidebarBackdrop'),
  openSidebarBtn: document.getElementById('openSidebarBtn'),
  closeSidebarBtn: document.getElementById('closeSidebarBtn'),

  // Search
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),

  // Topbar titles
  pageTitle: document.getElementById('pageTitle'),
  pageSubtitle: document.getElementById('pageSubtitle'),

  // Buttons to open task modal
  sidebarNewTaskBtn: document.getElementById('sidebarNewTaskBtn'),
  topNewTaskBtn: document.getElementById('topNewTaskBtn'),
  mobileFabBtn: document.getElementById('mobileFabBtn'),
  emptyStateNewTaskBtn: document.getElementById('emptyStateNewTaskBtn'),

  // Metrics
  metricTotal: document.getElementById('metricTotal'),
  metricPending: document.getElementById('metricPending'),
  metricCompleted: document.getElementById('metricCompleted'),
  metricOverdue: document.getElementById('metricOverdue'),

  // Sidebar counters
  countAll: document.getElementById('countAll'),
  countActive: document.getElementById('countActive'),
  countCompleted: document.getElementById('countCompleted'),
  countOverdue: document.getElementById('countOverdue'),
  countPersonal: document.getElementById('countPersonal'),
  countWork: document.getElementById('countWork'),
  countStudy: document.getElementById('countStudy'),
  countOther: document.getElementById('countOther'),

  // Sidebar Progress
  sidebarProgressBar: document.getElementById('sidebarProgressBar'),
  sidebarProgressPercent: document.getElementById('sidebarProgressPercent'),
  sidebarProgressTasks: document.getElementById('sidebarProgressTasks'),

  // Filter & Sort Controls
  filterTabs: document.querySelectorAll('.tab-btn'),
  statusFilterItems: document.querySelectorAll('#statusFilterList .nav-item'),
  categoryFilterItems: document.querySelectorAll('#categoryFilterList .nav-item'),
  categorySelectFilter: document.getElementById('categorySelectFilter'),
  sortSelect: document.getElementById('sortSelect'),

  // Active filter banner
  activeFilterBanner: document.getElementById('activeFilterBanner'),
  filterBannerText: document.getElementById('filterBannerText'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),

  // Task list & empty state
  taskCardsList: document.getElementById('taskCardsList'),
  taskCountVisible: document.getElementById('taskCountVisible'),
  emptyState: document.getElementById('emptyState'),
  emptyTitle: document.getElementById('emptyTitle'),
  emptyMessage: document.getElementById('emptyMessage'),

  // Clear completed buttons
  clearCompletedBtn: document.getElementById('clearCompletedBtn'),
  clearCompletedQuickBtn: document.getElementById('clearCompletedQuickBtn'),

  // Task Modal Elements
  taskModalBackdrop: document.getElementById('taskModalBackdrop'),
  taskModalTitle: document.getElementById('taskModalTitle'),
  closeTaskModalBtn: document.getElementById('closeTaskModalBtn'),
  cancelTaskModalBtn: document.getElementById('cancelTaskModalBtn'),
  taskForm: document.getElementById('taskForm'),
  taskIdInput: document.getElementById('taskIdInput'),
  taskTitleInput: document.getElementById('taskTitleInput'),
  taskDescInput: document.getElementById('taskDescInput'),
  taskCategoryInput: document.getElementById('taskCategoryInput'),
  taskPriorityInput: document.getElementById('taskPriorityInput'),
  taskDueDateInput: document.getElementById('taskDueDateInput'),
  titleError: document.getElementById('titleError'),
  dueDateError: document.getElementById('dueDateError'),
  saveBtnText: document.getElementById('saveBtnText'),

  // Confirmation Modal Elements
  confirmModalBackdrop: document.getElementById('confirmModalBackdrop'),
  confirmModalTitle: document.getElementById('confirmModalTitle'),
  confirmModalMessage: document.getElementById('confirmModalMessage'),
  closeConfirmModalBtn: document.getElementById('closeConfirmModalBtn'),
  cancelConfirmBtn: document.getElementById('cancelConfirmBtn'),
  actionConfirmBtn: document.getElementById('actionConfirmBtn'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

// =============================================================================
// Storage Functions
// =============================================================================
function loadTasksFromStorage() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!serialized) {
      // First time launch: initialize with sample tasks
      saveTasksToStorage(INITIAL_SAMPLE_TASKS);
      return [...INITIAL_SAMPLE_TASKS];
    }
    const parsed = JSON.parse(serialized);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load tasks from localStorage:', err);
    return [];
  }
}

function saveTasksToStorage(tasks) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage:', err);
    showToast('Failed to save to local storage. Storage might be full.', 'danger');
  }
}

// =============================================================================
// Theme Management
// =============================================================================
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Check OS preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

function applyTheme(theme) {
  DOM.html.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

function toggleTheme() {
  const currentTheme = DOM.html.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme} theme`, 'info');
}

// =============================================================================
// Task Helper Utilities
// =============================================================================
function isTaskOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  return new Date(task.dueDate).getTime() < Date.now();
}

function isTaskDueToday(task) {
  if (task.completed || !task.dueDate) return false;
  const taskDate = new Date(task.dueDate);
  const today = new Date();
  return (
    taskDate.getFullYear() === today.getFullYear() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getDate() === today.getDate()
  );
}

function formatDisplayDate(dateInput) {
  if (!dateInput) return 'No due date';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'Invalid date';

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };
  return d.toLocaleDateString('en-US', options);
}

function formatCreationDate(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return `Created ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

// Escape HTML characters to prevent XSS
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate unique ID
function generateId() {
  return 'task-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
}

// =============================================================================
// Rendering & Calculation Pipeline
// =============================================================================

/**
 * Filter, sort, and render all tasks and dashboard metrics.
 */
function renderApp() {
  updateMetrics();
  updateSidebarCounters();
  updateProgressBar();
  renderTaskList();
  updatePageHeadings();
}

/**
 * Calculate and update the 4 metric cards at the top
 */
function updateMetrics() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const overdue = state.tasks.filter(t => isTaskOverdue(t)).length;

  DOM.metricTotal.textContent = total;
  DOM.metricPending.textContent = pending;
  DOM.metricCompleted.textContent = completed;
  DOM.metricOverdue.textContent = overdue;
}

/**
 * Update the badge counters in the sidebar navigation
 */
function updateSidebarCounters() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const active = total - completed;
  const overdue = state.tasks.filter(t => isTaskOverdue(t)).length;

  DOM.countAll.textContent = total;
  DOM.countActive.textContent = active;
  DOM.countCompleted.textContent = completed;
  DOM.countOverdue.textContent = overdue;

  CATEGORIES.forEach(cat => {
    const count = state.tasks.filter(t => t.category === cat).length;
    const el = DOM[`count${cat}`];
    if (el) el.textContent = count;
  });
}

/**
 * Update sidebar progress bar and completion fraction
 */
function updateProgressBar() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  DOM.sidebarProgressBar.style.width = `${percentage}%`;
  DOM.sidebarProgressPercent.textContent = `${percentage}%`;
  DOM.sidebarProgressTasks.textContent = `${completed} of ${total} tasks done`;
}

/**
 * Dynamic page headings based on active filters
 */
function updatePageHeadings() {
  const { status, category, searchQuery } = state.filters;
  let title = 'All Tasks';
  let subtitle = 'Manage and organize your day-to-day work';

  if (searchQuery.trim()) {
    title = `Search Results`;
    subtitle = `Showing tasks matching "${searchQuery.trim()}"`;
  } else if (category !== 'all') {
    title = `${category} Tasks`;
    subtitle = `Tasks filed under category "${category}"`;
  } else {
    switch (status) {
      case 'active':
      case 'pending':
        title = 'Active & Pending Tasks';
        subtitle = 'Tasks that still require your attention';
        break;
      case 'completed':
        title = 'Completed Tasks';
        subtitle = 'Archive of all finished tasks';
        break;
      case 'overdue':
        title = 'Overdue Tasks';
        subtitle = 'Tasks that have passed their scheduled deadline';
        break;
      default:
        title = 'All Tasks';
        subtitle = 'Manage and organize your day-to-day work';
    }
  }

  DOM.pageTitle.textContent = title;
  DOM.pageSubtitle.textContent = subtitle;

  // Update active filter banner visibility
  const hasCustomFilter = status !== 'all' || category !== 'all' || searchQuery.trim() !== '';
  if (hasCustomFilter) {
    const filterParts = [];
    if (status !== 'all') filterParts.push(`Status: <strong>${status}</strong>`);
    if (category !== 'all') filterParts.push(`Category: <strong>${category}</strong>`);
    if (searchQuery.trim()) filterParts.push(`Keyword: <strong>"${escapeHTML(searchQuery.trim())}"</strong>`);

    DOM.filterBannerText.innerHTML = `Active Filters: ${filterParts.join(' • ')}`;
    DOM.activeFilterBanner.style.display = 'flex';
  } else {
    DOM.activeFilterBanner.style.display = 'none';
  }
}

/**
 * Filter and sort task array
 */
function getFilteredAndSortedTasks() {
  const { status, category, searchQuery } = state.filters;
  const query = searchQuery.trim().toLowerCase();

  // 1. Filter
  let filtered = state.tasks.filter(task => {
    // Status filter
    if (status === 'active' || status === 'pending') {
      if (task.completed) return false;
    } else if (status === 'completed') {
      if (!task.completed) return false;
    } else if (status === 'overdue') {
      if (!isTaskOverdue(task)) return false;
    }

    // Category filter
    if (category !== 'all') {
      if (task.category !== category) return false;
    }

    // Search query filter
    if (query) {
      const matchTitle = (task.title || '').toLowerCase().includes(query);
      const matchDesc = (task.description || '').toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  // 2. Sort
  filtered.sort((a, b) => {
    switch (state.sortBy) {
      case 'dueDateAsc': {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return timeA - timeB;
      }
      case 'dueDateDesc': {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : -Infinity;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : -Infinity;
        return timeB - timeA;
      }
      case 'priorityDesc': {
        const pA = PRIORITIES[a.priority]?.value || 0;
        const pB = PRIORITIES[b.priority]?.value || 0;
        return pB - pA;
      }
      case 'priorityAsc': {
        const pA = PRIORITIES[a.priority]?.value || 0;
        const pB = PRIORITIES[b.priority]?.value || 0;
        return pA - pB;
      }
      case 'alphaAsc':
        return a.title.localeCompare(b.title);
      case 'alphaDesc':
        return b.title.localeCompare(a.title);
      case 'createdAsc': {
        const cA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const cB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return cA - cB;
      }
      case 'createdDesc':
      default: {
        const cA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const cB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return cB - cA;
      }
    }
  });

  return filtered;
}

/**
 * Render the task cards into the DOM
 */
function renderTaskList() {
  const visibleTasks = getFilteredAndSortedTasks();
  DOM.taskCountVisible.textContent = visibleTasks.length;

  // Handle empty state
  if (visibleTasks.length === 0) {
    DOM.taskCardsList.innerHTML = '';
    DOM.taskCardsList.style.display = 'none';
    DOM.emptyState.style.display = 'flex';

    if (state.filters.searchQuery.trim()) {
      DOM.emptyTitle.textContent = 'No matching tasks found';
      DOM.emptyMessage.textContent = `No tasks matched your search query "${state.filters.searchQuery}". Try searching with different keywords.`;
    } else if (state.filters.status === 'completed') {
      DOM.emptyTitle.textContent = 'No completed tasks yet';
      DOM.emptyMessage.textContent = 'Finish some of your pending tasks to see them completed here!';
    } else if (state.filters.status === 'overdue') {
      DOM.emptyTitle.textContent = 'Awesome! No overdue tasks';
      DOM.emptyMessage.textContent = 'You are completely up to date on all your deadlines.';
    } else if (state.filters.category !== 'all') {
      DOM.emptyTitle.textContent = `No tasks in ${state.filters.category}`;
      DOM.emptyMessage.textContent = `You don't have any tasks categorized under "${state.filters.category}". Create one now!`;
    } else {
      DOM.emptyTitle.textContent = 'Your task list is empty';
      DOM.emptyMessage.textContent = 'Get organized and stay productive! Click below to create your very first task.';
    }
    return;
  }

  DOM.emptyState.style.display = 'none';
  DOM.taskCardsList.style.display = 'flex';

  // Build card elements
  const fragment = document.createDocumentFragment();

  visibleTasks.forEach(task => {
    const isOverdue = isTaskOverdue(task);
    const isToday = isTaskDueToday(task);

    const card = document.createElement('article');
    card.className = `task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'is-overdue' : ''}`;
    card.setAttribute('data-id', task.id);

    // Checkbox HTML
    const checkboxHtml = `
      <div class="checkbox-wrap">
        <button type="button" class="custom-checkbox" aria-label="${task.completed ? 'Mark uncompleted' : 'Mark completed'}" data-action="toggle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    `;

    // Priority badge
    const prioClass = PRIORITIES[task.priority]?.badgeClass || 'badge-prio-Low';
    const prioBadge = `<span class="meta-badge ${prioClass}">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
      ${task.priority} Priority
    </span>`;

    // Category badge
    const catClass = `badge-cat-${task.category}`;
    const catBadge = `<span class="meta-badge ${catClass}">
      <span class="category-bullet bullet-${task.category.toLowerCase()}"></span>
      ${task.category}
    </span>`;

    // Due date badge
    let dueClass = 'badge-due';
    let dueLabel = formatDisplayDate(task.dueDate);
    let dueIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;

    if (isOverdue) {
      dueClass += ' is-overdue';
      dueLabel = `Overdue • ${formatDisplayDate(task.dueDate)}`;
      dueIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else if (isToday) {
      dueClass += ' is-today';
      dueLabel = `Today • ${new Date(task.dueDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }

    const dueBadge = task.dueDate ? `<span class="meta-badge ${dueClass}">${dueIcon}${dueLabel}</span>` : '';
    const createdBadge = task.createdAt ? `<span class="badge-created">${formatCreationDate(task.createdAt)}</span>` : '';

    // Description HTML
    const descHtml = task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : '';

    // Full Card content
    card.innerHTML = `
      ${checkboxHtml}
      <div class="task-main">
        <div class="task-header-row">
          <h3 class="task-title">${escapeHTML(task.title)}</h3>
          <div class="task-actions">
            <button type="button" class="action-btn edit-btn" title="Edit task" data-action="edit" aria-label="Edit task">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button type="button" class="action-btn delete-btn" title="Delete task" data-action="delete" aria-label="Delete task">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        ${descHtml}
        <div class="task-meta-row">
          ${catBadge}
          ${prioBadge}
          ${dueBadge}
          ${createdBadge}
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  DOM.taskCardsList.innerHTML = '';
  DOM.taskCardsList.appendChild(fragment);
}

// =============================================================================
// Task Operations (Add, Edit, Delete, Toggle)
// =============================================================================

/**
 * Open task modal for creating or editing
 */
function openTaskModal(taskIdToEdit = null) {
  clearTaskFormErrors();
  state.editingTaskId = taskIdToEdit;

  if (taskIdToEdit) {
    // Edit mode
    const task = state.tasks.find(t => t.id === taskIdToEdit);
    if (!task) return;

    DOM.taskModalTitle.textContent = 'Edit Task';
    DOM.saveBtnText.textContent = 'Save Changes';
    DOM.taskIdInput.value = task.id;
    DOM.taskTitleInput.value = task.title;
    DOM.taskDescInput.value = task.description || '';
    DOM.taskCategoryInput.value = task.category;
    DOM.taskPriorityInput.value = task.priority;
    DOM.taskDueDateInput.value = task.dueDate || '';
  } else {
    // Create mode
    DOM.taskModalTitle.textContent = 'Create New Task';
    DOM.saveBtnText.textContent = 'Create Task';
    DOM.taskForm.reset();
    DOM.taskIdInput.value = '';
    DOM.taskCategoryInput.value = 'Personal';
    DOM.taskPriorityInput.value = 'Medium';

    // Set default due date to tomorrow at 5:00 PM
    DOM.taskDueDateInput.value = getRelativeDateString(1, 17, 0);
  }

  DOM.taskModalBackdrop.classList.add('is-active');
  setTimeout(() => DOM.taskTitleInput.focus(), 100);
}

function closeTaskModal() {
  DOM.taskModalBackdrop.classList.remove('is-active');
  DOM.taskForm.reset();
  state.editingTaskId = null;
  clearTaskFormErrors();
}

function clearTaskFormErrors() {
  DOM.titleError.classList.remove('visible');
  DOM.dueDateError.classList.remove('visible');
}

/**
 * Handle form submission for add/edit task
 */
function handleTaskFormSubmit(e) {
  e.preventDefault();

  const title = DOM.taskTitleInput.value.trim();
  const description = DOM.taskDescInput.value.trim();
  const category = DOM.taskCategoryInput.value;
  const priority = DOM.taskPriorityInput.value;
  const dueDate = DOM.taskDueDateInput.value;

  // Validation
  let hasError = false;
  if (!title) {
    DOM.titleError.classList.add('visible');
    hasError = true;
  } else {
    DOM.titleError.classList.remove('visible');
  }

  if (!dueDate) {
    DOM.dueDateError.classList.add('visible');
    hasError = true;
  } else {
    DOM.dueDateError.classList.remove('visible');
  }

  if (hasError) return;

  if (state.editingTaskId) {
    // Update existing task
    const index = state.tasks.findIndex(t => t.id === state.editingTaskId);
    if (index !== -1) {
      state.tasks[index] = {
        ...state.tasks[index],
        title,
        description,
        category,
        priority,
        dueDate
      };
      saveTasksToStorage(state.tasks);
      renderApp();
      showToast('Task updated successfully!', 'success');
    }
  } else {
    // Create new task
    const newTask = {
      id: generateId(),
      title,
      description,
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    state.tasks.unshift(newTask);
    saveTasksToStorage(state.tasks);
    renderApp();
    showToast('New task added successfully!', 'success');
  }

  closeTaskModal();
}

/**
 * Toggle task completion status
 */
function toggleTaskCompletion(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasksToStorage(state.tasks);
  renderApp();

  const message = task.completed
    ? `Task "${task.title.substring(0, 24)}..." completed! 🎉`
    : `Task restored to pending.`;
  showToast(message, task.completed ? 'success' : 'info');
}

/**
 * Delete a single task with confirmation
 */
function confirmDeleteTask(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  openConfirmModal({
    title: 'Delete Task?',
    message: `Are you sure you want to delete "${task.title}"? This action cannot be reversed.`,
    confirmText: 'Delete Task',
    isDanger: true,
    onConfirm: () => {
      state.tasks = state.tasks.filter(t => t.id !== taskId);
      saveTasksToStorage(state.tasks);
      renderApp();
      showToast('Task deleted successfully.', 'danger');
    }
  });
}

/**
 * Clear all completed tasks with confirmation
 */
function confirmClearCompleted() {
  const completedCount = state.tasks.filter(t => t.completed).length;
  if (completedCount === 0) {
    showToast('There are no completed tasks to clear.', 'info');
    return;
  }

  openConfirmModal({
    title: 'Clear Completed Tasks?',
    message: `You are about to permanently delete all ${completedCount} completed task(s). Are you sure?`,
    confirmText: `Clear ${completedCount} Tasks`,
    isDanger: true,
    onConfirm: () => {
      state.tasks = state.tasks.filter(t => !t.completed);
      saveTasksToStorage(state.tasks);
      renderApp();
      showToast(`Cleared ${completedCount} completed task(s).`, 'success');
    }
  });
}

// =============================================================================
// Confirmation Dialog Modal
// =============================================================================
function openConfirmModal({ title, message, confirmText, isDanger, onConfirm }) {
  DOM.confirmModalTitle.textContent = title || 'Are you sure?';
  DOM.confirmModalMessage.textContent = message || 'This action cannot be undone.';
  DOM.actionConfirmBtn.textContent = confirmText || 'Confirm';

  if (isDanger) {
    DOM.actionConfirmBtn.className = 'btn btn-danger';
  } else {
    DOM.actionConfirmBtn.className = 'btn btn-primary';
  }

  state.pendingAction = onConfirm;
  DOM.confirmModalBackdrop.classList.add('is-active');
}

function closeConfirmModal() {
  DOM.confirmModalBackdrop.classList.remove('is-active');
  state.pendingAction = null;
}

function executePendingConfirm() {
  if (typeof state.pendingAction === 'function') {
    state.pendingAction();
  }
  closeConfirmModal();
}

// =============================================================================
// Toast Notification System
// =============================================================================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'danger') {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <span class="toast-msg">${escapeHTML(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  // Auto remove after 3.2 seconds
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }, 3200);
}

// =============================================================================
// Filters, Sorting & Search Event Handlers
// =============================================================================

/**
 * Set active status filter and sync UI tabs and sidebar
 */
function setStatusFilter(status) {
  state.filters.status = status;

  // Sync toolbar tabs
  DOM.filterTabs.forEach(tab => {
    if (tab.getAttribute('data-filter') === status) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Sync sidebar navigation items
  DOM.statusFilterItems.forEach(item => {
    if (item.getAttribute('data-filter-value') === status) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  renderApp();
}

/**
 * Set active category filter and sync dropdown & sidebar
 */
function setCategoryFilter(category) {
  state.filters.category = category;

  // Sync dropdown selector
  DOM.categorySelectFilter.value = category;

  // Sync sidebar category items
  DOM.categoryFilterItems.forEach(item => {
    if (item.getAttribute('data-filter-value') === category) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  renderApp();
}

/**
 * Reset all active filters back to default
 */
function resetAllFilters() {
  state.filters.status = 'all';
  state.filters.category = 'all';
  state.filters.searchQuery = '';
  DOM.searchInput.value = '';
  DOM.clearSearchBtn.classList.remove('visible');

  // Sync controls
  setStatusFilter('all');
  setCategoryFilter('all');
}

// =============================================================================
// Mobile Drawer & Overlay Management
// =============================================================================
function openMobileSidebar() {
  DOM.sidebar.classList.add('is-open');
  DOM.sidebarBackdrop.classList.add('is-active');
}

function closeMobileSidebar() {
  DOM.sidebar.classList.remove('is-open');
  DOM.sidebarBackdrop.classList.remove('is-active');
}

// =============================================================================
// Event Listeners Setup
// =============================================================================
function initEventListeners() {
  // Theme toggle
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // Mobile drawer
  DOM.openSidebarBtn.addEventListener('click', openMobileSidebar);
  DOM.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  DOM.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Modals trigger buttons
  DOM.sidebarNewTaskBtn.addEventListener('click', () => {
    closeMobileSidebar();
    openTaskModal();
  });
  DOM.topNewTaskBtn.addEventListener('click', () => openTaskModal());
  DOM.mobileFabBtn.addEventListener('click', () => openTaskModal());
  DOM.emptyStateNewTaskBtn.addEventListener('click', () => openTaskModal());

  // Task Modal events
  DOM.closeTaskModalBtn.addEventListener('click', closeTaskModal);
  DOM.cancelTaskModalBtn.addEventListener('click', closeTaskModal);
  DOM.taskForm.addEventListener('submit', handleTaskFormSubmit);

  // Close modals on clicking outside content
  DOM.taskModalBackdrop.addEventListener('click', e => {
    if (e.target === DOM.taskModalBackdrop) closeTaskModal();
  });

  // Confirmation modal events
  DOM.closeConfirmModalBtn.addEventListener('click', closeConfirmModal);
  DOM.cancelConfirmBtn.addEventListener('click', closeConfirmModal);
  DOM.actionConfirmBtn.addEventListener('click', executePendingConfirm);
  DOM.confirmModalBackdrop.addEventListener('click', e => {
    if (e.target === DOM.confirmModalBackdrop) closeConfirmModal();
  });

  // Keyboard accessibility: ESC to close modals
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (DOM.taskModalBackdrop.classList.contains('is-active')) closeTaskModal();
      if (DOM.confirmModalBackdrop.classList.contains('is-active')) closeConfirmModal();
      if (DOM.sidebar.classList.contains('is-open')) closeMobileSidebar();
    }
  });

  // Clear completed buttons
  DOM.clearCompletedBtn.addEventListener('click', () => {
    closeMobileSidebar();
    confirmClearCompleted();
  });
  DOM.clearCompletedQuickBtn.addEventListener('click', confirmClearCompleted);

  // Search input with debounce/instant filtering
  DOM.searchInput.addEventListener('input', e => {
    const val = e.target.value;
    state.filters.searchQuery = val;
    if (val.trim()) {
      DOM.clearSearchBtn.classList.add('visible');
    } else {
      DOM.clearSearchBtn.classList.remove('visible');
    }
    renderApp();
  });

  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.filters.searchQuery = '';
    DOM.clearSearchBtn.classList.remove('visible');
    DOM.searchInput.focus();
    renderApp();
  });

  // Main Toolbar Status Filter Tabs
  DOM.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');
      setStatusFilter(filter);
    });
  });

  // Sidebar Status Filters
  DOM.statusFilterItems.forEach(item => {
    item.addEventListener('click', () => {
      const val = item.getAttribute('data-filter-value');
      setStatusFilter(val);
      closeMobileSidebar();
    });
  });

  // Sidebar Category Filters
  DOM.categoryFilterItems.forEach(item => {
    item.addEventListener('click', () => {
      const val = item.getAttribute('data-filter-value');
      // If clicking already active category, toggle back to 'all'
      if (state.filters.category === val) {
        setCategoryFilter('all');
      } else {
        setCategoryFilter(val);
      }
      closeMobileSidebar();
    });
  });

  // Toolbar Category Select
  DOM.categorySelectFilter.addEventListener('change', e => {
    setCategoryFilter(e.target.value);
  });

  // Toolbar Sort Select
  DOM.sortSelect.addEventListener('change', e => {
    state.sortBy = e.target.value;
    renderApp();
  });

  // Reset Filters link in banner
  DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);

  // Task list Event Delegation (Checkbox, Edit, Delete)
  DOM.taskCardsList.addEventListener('click', e => {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const action = button.getAttribute('data-action');
    const card = button.closest('.task-card');
    if (!card) return;
    const taskId = card.getAttribute('data-id');

    if (action === 'toggle') {
      toggleTaskCompletion(taskId);
    } else if (action === 'edit') {
      openTaskModal(taskId);
    } else if (action === 'delete') {
      confirmDeleteTask(taskId);
    }
  });
}

// =============================================================================
// Application Initialization
// =============================================================================
function initApp() {
  initTheme();
  state.tasks = loadTasksFromStorage();
  initEventListeners();
  renderApp();
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
