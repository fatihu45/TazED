// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyABv0noSsiXcS0ULDeN8weIg18KUJeRdJ4",
  authDomain: "tazed-7d8a3.firebaseapp.com",
  projectId: "tazed-7d8a3",
  storageBucket: "tazed-7d8a3.firebasestorage.app",
  messagingSenderId: "474685959445",
  appId: "1:474685959445:web:d27bd418184b25dc050d1c",
  measurementId: "G-17717XG1J7"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const roleSelect = document.getElementById('roleSelect');
const studentBtn = document.getElementById('studentBtn');
const teacherBtn = document.getElementById('teacherBtn');
const studentForm = document.getElementById('studentForm');
const teacherForm = document.getElementById('teacherForm');
const backToRole1 = document.getElementById('backToRole1');
const backToRole2 = document.getElementById('backToRole2');
const studentSchool = document.getElementById('studentSchool');
const teacherSchool = document.getElementById('teacherSchool');

// Show/hide forms
studentBtn.addEventListener('click', () => {
  roleSelect.style.display = 'none';
  studentForm.style.display = 'flex';
  teacherForm.style.display = 'none';
});
teacherBtn.addEventListener('click', () => {
  roleSelect.style.display = 'none';
  teacherForm.style.display = 'flex';
  studentForm.style.display = 'none';
});
backToRole1.addEventListener('click', (e) => {
  e.preventDefault();
  studentForm.reset();
  studentForm.style.display = 'none';
  roleSelect.style.display = 'block';
});
backToRole2.addEventListener('click', (e) => {
  e.preventDefault();
  teacherForm.reset();
  teacherForm.style.display = 'none';
  roleSelect.style.display = 'block';
});

// Load schools from Firestore
function loadSchools(selectEl) {
  db.collection('schools').get().then(snapshot => {
    snapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.data().name;
      selectEl.appendChild(option);
    });
  });
}
loadSchools(studentSchool);
loadSchools(teacherSchool);

// Student signup
studentForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('studentName').value;
  const email = document.getElementById('studentEmail').value;
  const password = document.getElementById('studentPassword').value;
  const schoolId = studentSchool.value;

  if (!schoolId) {
    alert("Please select a school.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      return db.collection('users').doc(uid).set({
        name,
        email,
        role: 'student',
        school: schoolId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert('Student account created successfully!');
      window.location.href = 'login.html';
    })
    .catch(err => alert(err.message));
});

// Teacher signup
teacherForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('teacherName').value;
  const email = document.getElementById('teacherEmail').value;
  const password = document.getElementById('teacherPassword').value;
  const schoolId = teacherSchool.value;

  if (!schoolId) {
    alert("Please select a school.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const uid = userCredential.user.uid;
      return db.collection('users').doc(uid).set({
        name,
        email,
        role: 'teacher',
        school: schoolId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
            alert('Teacher account created successfully!');
            window.location.href = 'login.html';
          })
          .catch(err => alert(err.message));
      });