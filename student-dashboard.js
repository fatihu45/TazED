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

let studentId = null;
let studentSchoolId = null;
let studentClass = null;
let studentSubjects = [];

auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  studentId = user.uid;
  // Fetch student info
  const userDoc = await db.collection("users").doc(studentId).get();
  if (!userDoc.exists || userDoc.data().role !== "student") {
    window.location.href = "login.html";
    return;
  }
  const studentData = userDoc.data();
  document.getElementById("greeting").textContent = `Welcome, ${studentData.name}!`;
  studentSchoolId = studentData.school;
  studentClass = studentData.class || "";
  studentSubjects = studentData.subjects || [];
  loadSubjects();
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", e => {
  e.preventDefault();
  auth.signOut().then(() => window.location.href = "login.html");
});

// Load subjects for student's school and class
async function loadSubjects() {
  const subjectsGrid = document.getElementById("subjectsGrid");
  subjectsGrid.innerHTML = "<p>Loading subjects...</p>";
  const subjectsSnap = await db.collection("subjects")
    .where("schoolId", "==", studentSchoolId)
    .where("class", "==", studentClass)
    .get();

  if (subjectsSnap.empty) {
    subjectsGrid.innerHTML = "<p>No subjects available for your class yet.</p>";
    return;
  }

  subjectsGrid.innerHTML = "";
  for (const doc of subjectsSnap.docs) {
    const subj = doc.data();
    const subjectId = doc.id;
    // Fetch teacher name
    let teacherName = "Unknown";
    try {
      const teacherDoc = await db.collection("users").doc(subj.teacherId).get();
      if (teacherDoc.exists) teacherName = teacherDoc.data().name;
    } catch {}
    // Card
    const card = document.createElement("div");
    card.className = "subject-card";
    card.innerHTML = `
      <div class="subject-title">${subj.name}</div>
      <div class="subject-meta">Teacher: ${teacherName}</div>
      <div class="subject-meta">Class: ${subj.class}</div>
      <div class="subject-desc">${subj.description || ""}</div>
    `;
    // Join button or joined label
    if (studentSubjects.includes(subjectId)) {
      const joined = document.createElement("div");
      joined.className = "joined-label";
      joined.textContent = "Joined";
      card.appendChild(joined);
    } else {
      const joinBtn = document.createElement("button");
      joinBtn.className = "join-btn";
      joinBtn.textContent = "Join Subject";
      joinBtn.addEventListener("click", async () => {
        await db.collection("users").doc(studentId).update({
          subjects: firebase.firestore.FieldValue.arrayUnion(subjectId)
        });
        studentSubjects.push(subjectId);
        joinBtn.replaceWith(Object.assign(document.createElement("div"), {
          className: "joined-label",
          textContent: "Joined"
        }));
      });
      card.appendChild(joinBtn);
    }
    subjectsGrid.appendChild(card);
  }
}