# Ex03 To-Do List using JavaScript
## Date:16/11/2026

## AIM
To create a To-do Application with all features using JavaScript.

## ALGORITHM
### STEP 1
Build the HTML structure (index.html).

### STEP 2
Style the App (style.css).

### STEP 3
Plan the features the To-Do App should have.

### STEP 4
Create a To-do application using Javascript.

### STEP 5
Add functionalities.

### STEP 6
Test the App.

### STEP 7
Open the HTML file in a browser to check layout and functionality.

### STEP 8
Fix styling issues and refine content placement.

### STEP 9
Deploy the website.

### STEP 10
Upload to GitHub Pages for free hosting.

## PROGRAM
```
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="TaskFlow - A modern, responsive Todo Dashboard with categories, priorities, due dates, search, and local storage.">
  <title>TaskFlow | Modern Todo Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Application Layout -->
  <div class="app-layout">
    
    <!-- Mobile Overlay Backdrop -->
    <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

    <!-- Sidebar Navigation -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="brand-logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          <div class="brand-text">
            <h2>Task<span>Flow</span></h2>
            <p class="tagline">Personal Productivity</p>
          </div>
        </div>
        <button class="icon-btn mobile-close-btn" id="closeSidebarBtn" title="Close Menu" aria-label="Close menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Add Task Action -->
      <div class="sidebar-action">
        <button class="btn btn-primary btn-block" id="sidebarNewTaskBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Task</span>
        </button>
      </div>

      <!-- Navigation Views -->
      <nav class="sidebar-nav">
        <div class="nav-group">
          <div class="nav-label">Status Filters</div>
          <ul class="nav-list" id="statusFilterList">
            <li>
              <button class="nav-item active" data-filter-type="status" data-filter-value="all">
                <span class="nav-item-left">
                  <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span>All Tasks</span>
                </span>
                <span class="badge" id="countAll">0</span>
              </button>
            </li>
            <li>
              <button class="nav-item" data-filter-type="status" data-filter-value="active">
                <span class="nav-item-left">
                  <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Active & Pending</span>
                </span>
                <span class="badge" id="countActive">0</span>
              </button>
            </li>
            <li>
              <button class="nav-item" data-filter-type="status" data-filter-value="completed">
                <span class="nav-item-left">
                  <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Completed</span>
                </span>
                <span class="badge" id="countCompleted">0</span>
              </button>
            </li>
            <li>
              <button class="nav-item" data-filter-type="status" data-filter-value="overdue">
                <span class="nav-item-left">
                  <svg class="nav-icon warning-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>Overdue</span>
                </span>
                <span class="badge badge-warning" id="countOverdue">0</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Categories Filter -->
        <div class="nav-group">
          <div class="nav-label">Categories</div>
          <ul class="nav-list" id="categoryFilterList">
            <li>
              <button class="nav-item" data-filter-type="category" data-filter-value="Personal">
                <span class="nav-item-left">
                  <span class="category-bullet bullet-personal"></span>
                  <span>Personal</span>
                </span>
                <span class="badge" id="countPersonal">0</span>
              </button>
            </li>
            <li>
              <button class="nav-item" data-filter-type="category" data-filter-value="Work">
                <span class="nav-item-left">
                  <span class="category-bullet bullet-work"></span>
                  <span>Work</span>
                </span>
                <span class="badge" id="countWork">0</span>
              </button>
            </li>
            <li>
              <button class="nav-item" data-filter-type="category" data-filter-value="Study">
                <span class="nav-item-left">
                  <span class="category-bullet bullet-study"></span>
                  <span>Study</span>
                </span>
                <span class="badge" id="countStudy">0</span>
              </button>
            </li>
            <li>
              <button class="nav-item" data-filter-type="category" data-filter-value="Other">
                <span class="nav-item-left">
                  <span class="category-bullet bullet-other"></span>
                  <span>Other</span>
                </span>
                <span class="badge" id="countOther">0</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Sidebar Progress & Quick Stats Card -->
      <div class="sidebar-progress-card">
        <div class="progress-info">
          <span class="progress-title">Overall Progress</span>
          <span class="progress-percent" id="sidebarProgressPercent">0%</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" id="sidebarProgressBar" style="width: 0%"></div>
        </div>
        <div class="progress-meta">
          <span id="sidebarProgressTasks">0 of 0 tasks done</span>
        </div>
      </div>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <button class="btn btn-outline-danger btn-sm btn-block" id="clearCompletedBtn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Clear Completed</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">

      <!-- Header Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="icon-btn hamburger-btn" id="openSidebarBtn" title="Open Menu" aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="topbar-heading">
            <h1 class="page-title" id="pageTitle">All Tasks</h1>
            <p class="page-subtitle" id="pageSubtitle">Manage and organize your day-to-day work</p>
          </div>
        </div>

        <div class="topbar-right">
          <!-- Live Search Bar -->
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="searchInput" placeholder="Search tasks by title or note..." autocomplete="off">
            <button class="clear-search-btn" id="clearSearchBtn" title="Clear search" aria-label="Clear search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Theme Toggle Button -->
          <button class="theme-toggle-btn" id="themeToggleBtn" title="Toggle Theme" aria-label="Switch between light and dark theme">
            <span class="theme-toggle-thumb">
              <!-- Sun Icon -->
              <svg class="theme-icon icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <!-- Moon Icon -->
              <svg class="theme-icon icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </span>
          </button>

          <!-- Top Quick Add Button -->
          <button class="btn btn-primary top-add-btn" id="topNewTaskBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Task</span>
          </button>
        </div>
      </header>

      <!-- Dashboard Body -->
      <div class="dashboard-body">

        <!-- Metrics Overview Grid -->
        <section class="metrics-grid">
          <div class="metric-card metric-total">
            <div class="metric-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <div class="metric-details">
              <span class="metric-title">Total Tasks</span>
              <span class="metric-value" id="metricTotal">0</span>
            </div>
          </div>

          <div class="metric-card metric-pending">
            <div class="metric-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div class="metric-details">
              <span class="metric-title">Pending Tasks</span>
              <span class="metric-value" id="metricPending">0</span>
            </div>
          </div>

          <div class="metric-card metric-completed">
            <div class="metric-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="metric-details">
              <span class="metric-title">Completed Tasks</span>
              <span class="metric-value" id="metricCompleted">0</span>
            </div>
          </div>

          <div class="metric-card metric-overdue">
            <div class="metric-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="metric-details">
              <span class="metric-title">Overdue Tasks</span>
              <span class="metric-value" id="metricOverdue">0</span>
            </div>
          </div>
        </section>

        <!-- Controls & Filters Bar -->
        <section class="toolbar-section">
          <!-- Filter Tabs -->
          <div class="filter-tabs" role="tablist">
            <button class="tab-btn active" data-filter="all">All</button>
            <button class="tab-btn" data-filter="active">Active</button>
            <button class="tab-btn" data-filter="pending">Pending</button>
            <button class="tab-btn" data-filter="completed">Completed</button>
            <button class="tab-btn" data-filter="overdue">Overdue</button>
          </div>

          <!-- Secondary Toolbar Controls (Category filter & Sorting) -->
          <div class="toolbar-controls">
            <!-- Category Filter Dropdown -->
            <div class="select-wrapper">
              <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 21v-7"></path>
                <path d="M4 10V3"></path>
                <path d="M12 21v-9"></path>
                <path d="M12 8V3"></path>
                <path d="M20 21v-5"></path>
                <path d="M20 12V3"></path>
                <circle cx="4" cy="14" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="20" cy="16" r="2"></circle>
              </svg>
              <select id="categorySelectFilter" aria-label="Filter by Category">
                <option value="all">All Categories</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Sort By Dropdown -->
            <div class="select-wrapper">
              <svg class="select-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="15" y2="6"></line>
                <line x1="3" y1="12" x2="11" y2="12"></line>
                <line x1="3" y1="18" x2="7" y2="18"></line>
                <polyline points="17 9 20 6 23 9"></polyline>
                <line x1="20" y1="6" x2="20" y2="18"></line>
              </svg>
              <select id="sortSelect" aria-label="Sort Tasks By">
                <option value="dueDateAsc">Due Date: Soonest</option>
                <option value="dueDateDesc">Due Date: Latest</option>
                <option value="priorityDesc">Priority: High to Low</option>
                <option value="priorityAsc">Priority: Low to High</option>
                <option value="alphaAsc">Title: A to Z</option>
                <option value="alphaDesc">Title: Z to A</option>
                <option value="createdDesc">Created: Newest First</option>
                <option value="createdAsc">Created: Oldest First</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Active Filter Indicator Bar -->
        <div class="active-filter-banner" id="activeFilterBanner" style="display: none;">
          <span class="filter-banner-text" id="filterBannerText">Filtered by: <strong>Work</strong></span>
          <button class="filter-reset-link" id="resetFiltersBtn">Reset filters</button>
        </div>

        <!-- Task List Container -->
        <section class="task-list-section">
          <div class="task-list-header">
            <h2 class="section-title">
              Tasks (<span id="taskCountVisible">0</span>)
            </h2>
            <div class="list-quick-actions">
              <button class="text-btn danger-text" id="clearCompletedQuickBtn">
                Clear Completed
              </button>
            </div>
          </div>

          <!-- Dynamic Task Cards Container -->
          <div class="task-cards-list" id="taskCardsList">
            <!-- Dynamically injected via script.js -->
          </div>

          <!-- Empty State Container -->
          <div class="empty-state" id="emptyState" style="display: none;">
            <div class="empty-illustration">
              <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M10 4v4"></path>
                <path d="M2 8h20"></path>
                <path d="m9 15 2 2 4-4"></path>
              </svg>
            </div>
            <h3 class="empty-title" id="emptyTitle">No tasks found</h3>
            <p class="empty-message" id="emptyMessage">You're completely caught up! Click the button below to add your first task.</p>
            <button class="btn btn-primary" id="emptyStateNewTaskBtn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Create New Task</span>
            </button>
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- Modal: Add / Edit Task -->
  <div class="modal-backdrop" id="taskModalBackdrop">
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="taskModalTitle">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <div class="modal-icon-badge" id="modalIconBadge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <h2 class="modal-title" id="taskModalTitle">Create New Task</h2>
        </div>
        <button class="icon-btn modal-close-btn" id="closeTaskModalBtn" title="Close" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <form id="taskForm" novalidate>
        <!-- Hidden input for task id when editing -->
        <input type="hidden" id="taskIdInput">

        <div class="modal-body">
          <!-- Title Input -->
          <div class="form-group">
            <label for="taskTitleInput" class="form-label">
              Task Title <span class="required-star">*</span>
            </label>
            <input 
              type="text" 
              id="taskTitleInput" 
              class="form-control" 
              placeholder="e.g. Design homepage wireframe"
              maxlength="120"
              required
            >
            <div class="form-error" id="titleError">Please enter a task title.</div>
          </div>

          <!-- Description Input -->
          <div class="form-group">
            <label for="taskDescInput" class="form-label">
              Description <span class="optional-label">(Optional)</span>
            </label>
            <textarea 
              id="taskDescInput" 
              class="form-control" 
              rows="3" 
              placeholder="Add key notes, checklist details, or reminders..."
              maxlength="500"
            ></textarea>
          </div>

          <!-- Row: Category & Priority -->
          <div class="form-row">
            <!-- Category -->
            <div class="form-group col-half">
              <label for="taskCategoryInput" class="form-label">Category</label>
              <select id="taskCategoryInput" class="form-control">
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Priority -->
            <div class="form-group col-half">
              <label for="taskPriorityInput" class="form-label">Priority</label>
              <select id="taskPriorityInput" class="form-control">
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>

          <!-- Due Date Input -->
          <div class="form-group">
            <label for="taskDueDateInput" class="form-label">
              Due Date & Time <span class="required-star">*</span>
            </label>
            <div class="input-with-icon">
              <input 
                type="datetime-local" 
                id="taskDueDateInput" 
                class="form-control"
                required
              >
            </div>
            <div class="form-error" id="dueDateError">Please select a valid due date.</div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="cancelTaskModalBtn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="saveTaskBtn">
            <span id="saveBtnText">Save Task</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: Confirmation Dialog -->
  <div class="modal-backdrop" id="confirmModalBackdrop">
    <div class="modal-dialog modal-dialog-sm" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
      <div class="modal-header border-0 pb-0">
        <div class="confirm-icon-box danger-icon-box" id="confirmIconBox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <button class="icon-btn modal-close-btn" id="closeConfirmModalBtn" title="Close" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body text-center">
        <h3 class="confirm-title" id="confirmModalTitle">Are you sure?</h3>
        <p class="confirm-message" id="confirmModalMessage">This action cannot be undone.</p>
      </div>
      <div class="modal-footer justify-center">
        <button type="button" class="btn btn-secondary" id="cancelConfirmBtn">Cancel</button>
        <button type="button" class="btn btn-danger" id="actionConfirmBtn">Delete Task</button>
      </div>
    </div>
  </div>

  <!-- Toast Notification Container -->
  <div class="toast-container" id="toastContainer" aria-live="polite"></div>

  <!-- Floating Mobile Action Button (FAB) -->
  <button class="fab-btn" id="mobileFabBtn" title="Add Task" aria-label="Add new task">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  </button>

  <script src="script.js"></script>
</body>
</html>

```

## OUTPUT
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/b79a45d9-f3eb-4303-96a7-fae929d4973c" />



## RESULT
The program for creating To-do list using JavaScript is executed successfully.
