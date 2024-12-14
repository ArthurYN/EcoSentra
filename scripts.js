const popupContainer = document.getElementById('popupContainer');
const popup = document.getElementById('popup');
const carbonCalculator = document.getElementById('carbonCalculator');
const bikeTracker = document.getElementById('bikeTracker');
const result = document.getElementById('result');
const loadingOverlay = document.getElementById('loadingOverlay');
const newsSummaries = [
  "Berita 1: Lingkungan hidup di Indonesia.",
  "Berita 2: Kemajuan energi terbarukan.",
  "Berita 3: Tips hidup ramah lingkungan."
];

function hideIntroPage() {
  const introPage = document.getElementById('introPage');
  // Tambahkan kelas animasi
  introPage.classList.add('hide');
  setTimeout(() => {
    introPage.style.display = 'none'; // Sembunyikan setelah animasi selesai
    document.getElementById('homePage').style.display = 'block'; // Tampilkan halaman utama
  }, 800); // Sesuaikan dengan durasi animasi
}
// Tampilkan intro page saat halaman dimuat
window.onload = function() {
  document.getElementById('introPage').style.display = 'flex';
  document.getElementById('homePage').style.display = 'none';
};

// Gradient mengikuti kursor
const introPage = document.getElementById('introPage');
document.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const xPercent = (clientX / width) * 100;
  const yPercent = (clientY / height) * 100;

  introPage.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
});

function showHomePage() {
  document.getElementById("popupContainer").style.display = 'none';
  document.getElementById("carbonCalculator").style.display = 'none';
  document.getElementById("homePage").style.display = 'block'; // Navigasi ke Home
}

let currentNewsIndex = 0;

function nextNews() {
  currentNewsIndex = (currentNewsIndex + 1) % newsSummaries.length; // Loop kembali ke awal
  updateNews('slide-left');
}

function prevNews() {
  currentNewsIndex = (currentNewsIndex - 1 + newsSummaries.length) % newsSummaries.length; // Loop ke akhir
  updateNews('slide-right');
}

function updateNews(animationClass) {
  popup.classList.remove('slide-left', 'slide-right');
  popup.offsetWidth; // Trigger reflow untuk reset animasi
  popup.classList.add(animationClass);

  setTimeout(() => {
    popup.textContent = newsSummaries[currentNewsIndex]; // Tampilkan berita sesuai indeks
    popup.classList.remove(animationClass); // Hapus animasi setelah selesai
  }, 500); // Sinkronkan dengan durasi animasi CSS
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

let trackingInterval;
let timerInterval;
let totalCalories = 0;
let isTracking = false; // Status tracking
let startTime;

function showBikeTracker() {
  document.getElementById('bikeTracker').style.display = 'block';
}

function startBikeTracking() {
  if (isTracking) return; // Jika sudah tracking, abaikan

  const startStopBtn = document.getElementById('startStopBtn');
  startStopBtn.textContent = 'Tracking Dimulai';
  startStopBtn.classList.add('tracking-started');

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  if (navigator.geolocation) {
    trackingInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const speed = position.coords.speed || 0; // Kecepatan dalam m/s
        const speedKmH = (speed * 3.6).toFixed(2); // Konversi ke km/j
        document.getElementById('speed').textContent = speedKmH;

        const caloriesBurned = calculateCalories(speedKmH);
        totalCalories += caloriesBurned;
        document.getElementById('calories').textContent = totalCalories.toFixed(2);
      });
    }, 1000);
    isTracking = true;
  } else {
    alert("Geolocation tidak didukung oleh browser ini.");
  }
}

function stopBikeTracking() {
  if (!isTracking) return; // Jika belum tracking, abaikan

  clearInterval(trackingInterval);
  clearInterval(timerInterval);

  alert(`Tracking dihentikan. Total kalori terbakar: ${totalCalories.toFixed(2)} kcal`);

  const startStopBtn = document.getElementById('startStopBtn');
  startStopBtn.textContent = 'Mulai';
  startStopBtn.classList.remove('tracking-started');

  isTracking = false;
}

function calculateCalories(speedKmH) {
  if (speedKmH <= 0) return 0;
  return 0.029 * speedKmH; // Estimasi sederhana: 0.029 kcal per km/j
}

function updateTimer() {
  const now = Date.now();
  const elapsed = now - startTime;

  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

  document.getElementById('timer').textContent = 
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}