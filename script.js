// Sidebar active link highlight (works for all pages with sidebar)
document.addEventListener('DOMContentLoaded', function() {
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
    link.addEventListener('click', function() {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// Signup form handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // You can add validation or API call here
    alert('Account created successfully!');
    window.location.href = 'login.html';
  });
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // You can add validation or API call here
    alert('Logged in successfully!');
    window.location.href = 'dashboard.html';
  });
}

// Add Subject button (Dashboard)
const addSubjectBtn = document.querySelector('.courses .button');
if (addSubjectBtn) {
  addSubjectBtn.addEventListener('click', function() {
    alert('Add Subject functionality coming soon!');
    // You can open a modal or form here
  });
}

// Class list filter (Students page)
const classListItems = document.querySelectorAll('.class-list li');
const studentsTableRows = document.querySelectorAll('.students-table tbody tr');
if (classListItems.length && studentsTableRows.length) {
  classListItems.forEach(item => {
    item.addEventListener('click', function() {
      classListItems.forEach(li => li.classList.remove('active'));
      this.classList.add('active');
      const selectedClass = this.textContent.trim();
      studentsTableRows.forEach(row => {
        if (selectedClass === 'All' || row.children[1].textContent.trim() === selectedClass) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

// AI Tutor page: Ask AI and Summarize (demo only)
const aiAskForm = document.querySelector('.section form');
if (aiAskForm && window.location.pathname.includes('ai-tutor.html')) {
  aiAskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const textarea = aiAskForm.querySelector('textarea');
    const answerCard = document.querySelector('.summary-card .content');
    if (textarea && answerCard) {
      answerCard.textContent = "This is a demo answer from the AI Tutor. (Integrate with backend for real responses.)";
    }
  });
}

// AI Tutor page: Summarize PDF (demo only)
const summarizeForm = document.querySelectorAll('.section form')[1];
if (summarizeForm && window.location.pathname.includes('ai-tutor.html')) {
  summarizeForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const summaryCard = document.querySelectorAll('.summary-card .content')[1];
    if (summaryCard) {
      summaryCard.textContent = "This is a demo summary of your text or PDF. (Integrate with backend for real summaries.)";
    }
  });
}

// Dashboard: AI Engagement Tracker (demo only)
const generateSummaryBtn = document.querySelector('.ai-tracker button');
if (generateSummaryBtn) {
  generateSummaryBtn.addEventListener('click', function() {
    alert('AI Engagement summary functionality coming soon!');
    // You can show