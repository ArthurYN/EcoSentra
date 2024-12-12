const popupContainer = document.getElementById('popupContainer');
const popup = document.getElementById('popup');
const carbonCalculator = document.getElementById('carbonCalculator');
const bikeTracker = document.getElementById('bikeTracker');
const result = document.getElementById('result');
const loadingOverlay = document.getElementById('loadingOverlay');
const newsSummaries = [
  "Rangkuman ",
  "Rangkuman berita 2",
  "Rangkuman berita 3"
];

window.onload = function() {
  document.title = "EcoSentra"; // Set title saat halaman dimuat
  document.getElementById("popupContainer").style.display = 'none';
  document.getElementById("carbonCalculator").style.display = 'none';
  document.getElementById("homePage").style.display = 'block'; // Menampilkan Home
};

function showHomePage() {
  document.getElementById("popupContainer").style.display = 'none';
  document.getElementById("carbonCalculator").style.display = 'none';
  document.getElementById("homePage").style.display = 'block'; // Navigasi ke Home
}



let currentNewsIndex = 0;

function nextNews() {
  currentNewsIndex = (currentNewsIndex + 1) % newsSummaries.length;
  popup.classList.remove('slide-right', 'slide-left');
  popup.offsetWidth; // Trigger reflow
  popup.classList.add('slide-left');
  setTimeout(() => {
    popup.textContent = newsSummaries[currentNewsIndex];
    popup.classList.remove('slide-left');
  }, 500);
}

function showLoading() {
  loadingOverlay.classList.add('show');
}

function hideLoading() {
  loadingOverlay.classList.remove('show');
}

function delayedAction(action, delay = 1000) {
  showLoading();
  setTimeout(() => {
    action();
    hideLoading();
  }, delay);
}

function showPopup() {
  delayedAction(() => {
    popupContainer.style.display = 'flex';
    carbonCalculator.style.display = 'none';
    bikeTracker.style.display = 'none'; // Pastikan tracker disembunyikan saat popup Home
    popup.textContent = newsSummaries[currentNewsIndex];
  });
}

function showCarbonCalculator() {
  delayedAction(() => {
    carbonCalculator.style.display = 'flex';
    popupContainer.style.display = 'none';
    bikeTracker.style.display = 'none'; // Menyembunyikan tracker jika berganti ke Calculator
  });
}

function showProfile() {
  delayedAction(() => {
    popupContainer.style.display = 'none'; // Sembunyikan popup lain
    carbonCalculator.style.display = 'none'; // Sembunyikan calculator
    bikeTracker.style.display = 'flex'; // Menampilkan bike tracker saat Profile ditekan
  });
}

let timerInterval;
let isTimerRunning = false;
let secondsElapsed = 0;
let distance = 0; // Jarak dalam km
let caloriesBurned = 0;
let initialTime = null; // Waktu mulai penghitungan

const timerDisplay = document.getElementById('timer');
const bikeStats = document.getElementById('bikeStats');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const bikeDistanceInput = document.getElementById('bikeDistance');

function calculateCarbon() {
  const distance = parseFloat(document.getElementById('distance').value);
  const fuelEfficiency = parseFloat(document.getElementById('fuel').value);

  if (isNaN(distance) || isNaN(fuelEfficiency) || distance <= 0 || fuelEfficiency <= 0) {
    result.textContent = "Masukkan nilai valid.";
    return;
  }

  const carbonEmission = (distance / fuelEfficiency) * 2.31; // CO2 in kg assuming 2.31 kg/l
  result.textContent = `Jejak karbon Anda: ${carbonEmission.toFixed(2)} kg CO2.`;
}



// Fungsi untuk memulai dan menghentikan timer
function toggleTimer() {
  if (isTimerRunning) {
    clearInterval(timerInterval);
    startStopBtn.textContent = 'Mulai';
    isTimerRunning = false;
  } else {
    startStopBtn.textContent = 'Hentikan';
    isTimerRunning = true;
    initialTime = Date.now(); // Waktu mulai
    timerInterval = setInterval(updateTimer, 1000);
  }
}

// Fungsi untuk memperbarui timer
function updateTimer() {
  secondsElapsed++;
  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;
  
  timerDisplay.textContent = `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  
  // Menghitung kalori berdasarkan kecepatan rata-rata
  if (initialTime && distance > 0) {
    const elapsedTimeInHours = (Date.now() - initialTime) / 3600000; // Waktu dalam jam
    const averageSpeed = distance / elapsedTimeInHours; // Kecepatan rata-rata km/jam
    caloriesBurned = averageSpeed * 40; // Asumsi kalori terbakar 40 per km pada kecepatan tertentu
    updateStats();
  }
}

// Fungsi untuk menambahkan nol di depan angka kurang dari 10
function padTime(num) {
  return num < 10 ? '0' + num : num;
}

// Fungsi untuk mengatur ulang timer
function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  secondsElapsed = 0;
  timerDisplay.textContent = '00:00:00';
  startStopBtn.textContent = 'Mulai';
  caloriesBurned = 0;
  distance = 0;
  bikeDistanceInput.value = '';
  bikeStats.textContent = '';
  initialTime = null; // Reset waktu mulai
}

// Fungsi untuk memperbarui statistik
function updateStats() {
  bikeStats.textContent = `
    Jarak Tempuh: ${distance} km
    Kecepatan Rata-rata: ${(distance / (secondsElapsed / 3600)).toFixed(2)} km/jam
    Kalori Terbakar: ${caloriesBurned.toFixed(0)} kalori
  `;
}

// Fungsi untuk memperbarui jarak dan menghitung ulang kalori
bikeDistanceInput.addEventListener('input', function() {
  distance = parseFloat(bikeDistanceInput.value);
  if (!isNaN(distance) && distance > 0) {
    updateStats();
  }
});
