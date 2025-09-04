// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyABv0noSSixcS0ULDeN8weIg18KUJeRdJ4",
  authDomain: "TazED.firebaseapp.com",
  projectId: "tazed-7d8a3",
  storageBucket: "tazed-7d8a3.appspot.com",
  messagingSenderId: "474685959445",
  appId: "1:474685959445:web:d27bd418184b25dc050d1c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let teacherId = null;
let teacherSchoolId = null;
let teacherSchoolName = null;

// --- Authentication & Teacher Info ---
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  teacherId = user.uid;
  // Fetch teacher info
  const userDoc = await db.collection("users").doc(teacherId).get();
  if (!userDoc.exists || userDoc.data().role !== "teacher") {
    window.location.href = "login.html";
    return;
  }
  const teacherData = userDoc.data();
  document.getElementById("greeting").textContent = `Welcome, ${teacherData.name}!`;
  teacherSchoolId = teacherData.school;
  // Fetch school name
  const schoolDoc = await db.collection("schools").doc(teacherSchoolId).get();
  teacherSchoolName = schoolDoc.exists ? schoolDoc.data().name : "";
  document.getElementById("schoolName").value = teacherSchoolName;
  loadSubjects();
  loadStudents();
});

// --- Sidebar Navigation ---
document.getElementById("dashboardLink").addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("dashboardSection").style.display = "block";
  document.getElementById("engagementSection").style.display = "none";
  setActiveNav("dashboardLink");
});
document.getElementById("engagementLink").addEventListener("click", e => {
  e.preventDefault();
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("engagementSection").style.display = "block";
  setActiveNav("engagementLink");
});
document.getElementById("logoutBtn").addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => window.location.href = "login.html");
});

function setActiveNav(id) {
  document.querySelectorAll(".sidebar nav ul li a").forEach(a => a.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// --- Add Subject Modal ---
const addSubjectBtn = document.getElementById("addSubjectBtn");
const addSubjectModal = document.getElementById("addSubjectModal");
const closeModalBtn = document.getElementById("closeModalBtn");
addSubjectBtn.addEventListener("click", showAddSubjectModal);
addSubjectModal.addEventListener("click", function(e) {
  if (e.target === addSubjectModal) hideAddSubjectModal();
});
closeModalBtn.addEventListener("click", hideAddSubjectModal);

function showAddSubjectModal() {
  addSubjectModal.classList.add("active");
}
function hideAddSubjectModal() {
  addSubjectModal.classList.remove("active");
  document.getElementById("addSubjectForm").reset();
}

// --- Add Subject Form ---
document.getElementById("addSubjectForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = document.getElementById("subjectName").value.trim();
  const classLevel = document.getElementById("subjectClass").value;
  const desc = document.getElementById("subjectDesc").value.trim();
  if (!name || !classLevel) {
    alert("Please fill in all required fields.");
    return;
  }
  await db.collection("subjects").add({
    name,
    class: classLevel,
    description: desc,
    teacherId,
    schoolId: teacherSchoolId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("Subject added!");
  hideAddSubjectModal();
  loadSubjects();
});

// --- Load Subjects ---
async function loadSubjects() {
  const subjectsList = document.getElementById("subjectsList");
  subjectsList.innerHTML = "";
  const snapshot = await db.collection("subjects")
    .where("teacherId", "==", teacherId)
    .get();
  if (snapshot.empty) {
    subjectsList.innerHTML = "<p>No subjects added yet.</p>";
    document.getElementById("subjectFilter").innerHTML = '<option value="">All Subjects</option>';
    return;
  }
  let subjectOptions = '<option value="">All Subjects</option>';
  snapshot.forEach(doc => {
    const subj = doc.data();
    const item = document.createElement("div");
    item.className = "subject-item";
    item.textContent = `${subj.name} (${subj.class})`;
    subjectsList.appendChild(item);
    subjectOptions += `<option value="${doc.id}">${subj.name}</option>`;
  });
  document.getElementById("subjectFilter").innerHTML = subjectOptions;
}

// --- Load Students & Engagement ---
async function loadStudents() {
  const studentsTable = document.getElementById("studentsTable").querySelector("tbody");
  studentsTable.innerHTML = "";
  // Fetch students from teacher's school
  const studentsSnap = await db.collection("users")
    .where("school", "==", teacherSchoolId)
    .where("role", "==", "student")
    .get();
  const subjectsSnap = await db.collection("subjects")
    .where("teacherId", "==", teacherId)
    .get();
  const subjectsMap = {};
  subjectsSnap.forEach(doc => subjectsMap[doc.id] = doc.data().name);

  studentsSnap.forEach(doc => {
    const student = doc.data();
    // Dummy engagement score
    const engagementScore = Math.floor(Math.random() * 100) + "%";
    // Subjects registered (for demo, show all teacher's subjects)
    const subjectsRegistered = Object.values(subjectsMap).join(", ") || "None";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.name}</td>
      <td>${student.class || "-"}</td>
      <td>${subjectsRegistered}</td>
      <td>${engagementScore}</td>
    `;
    studentsTable.appendChild(tr);
  });
}

// --- Filters ---
document.getElementById("classFilter").addEventListener("change", filterStudents);
document.getElementById("subjectFilter").addEventListener("change", filterStudents);

function filterStudents() {
  const classVal = document.getElementById("classFilter").value;
  const subjectVal = document.getElementById("subjectFilter").value;
  const rows = document.getElementById("studentsTable").querySelectorAll("tbody tr");
  rows.forEach(row => {
    let show = true;
    if (classVal && !row.children[1].textContent.includes(classVal)) show = false;
    if (subjectVal && !row.children[2].textContent.includes(document.getElementById("subjectFilter").selectedOptions[0].text)) show = false;
    row.style.display = show ? "" : "none";
  });
}