const popupContainer = document.getElementById('popupContainer');
const popup = document.getElementById('popup');
const carbonCalculator = document.getElementById('carbonCalculator');
const bikeTracker = document.getElementById('bikeTracker');
const result = document.getElementById('result');
const loadingOverlay = document.getElementById('loadingOverlay');
const newsSummaries = [
  "Perkembangan Energi Terbarukan di Indonesia: Indonesia semakin mempercepat pengembangan energi terbarukan dengan fokus pada panel surya dan tenaga angin. Pemerintah menargetkan penggunaan energi terbarukan mencapai 23% pada tahun 2025 untuk mengurangi ketergantungan pada energi fosil.",
  "Solusi Mengurangi Sampah Plastik di Laut: Pemerintah dan LSM lokal bekerja sama untuk mengurangi sampah plastik di laut dengan program pengumpulan dan daur ulang plastik. Kampanye ini bertujuan untuk melibatkan masyarakat dalam menjaga kebersihan laut.",
  "Tantangan Perubahan Iklim dan Mitigasinya: Perubahan iklim semakin menjadi ancaman global. Banyak negara, termasuk Indonesia, melaksanakan langkah-langkah mitigasi untuk mengurangi dampak perubahan iklim dengan menanam pohon dan beralih ke energi bersih."
];

function hideIntroPage() {
  const introPage = document.getElementById('introPage');
  introPage.classList.add('hide');
  setTimeout(() => {
    introPage.style.display = 'none';
    document.getElementById('homePage').style.display = 'block';
    setTimeout(showGuidePopup, 800); 
  }, 800);
}

function hideGuidePopup() {
  document.getElementById('guidePopup').style.display = 'none'; 
  document.getElementById('homePage').style.display = 'block'; 
}


document.getElementById('closeGuidePopupButton').addEventListener('click', hideGuidePopup);


const introPage = document.getElementById('introPage');
document.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const xPercent = (clientX / width) * 100;
  const yPercent = (clientY / height) * 100;

  introPage.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
});   

function showGuidePopup() {
  console.log("Popup sedang ditampilkan...");
  document.getElementById('guidePopup').style.display = 'flex';
}

function hideGuidePopup() {
  console.log("Popup sedang disembunyikan...");
  document.getElementById('guidePopup').style.display = 'none';
}



window.onload = function() {
  document.getElementById('introPage').style.display = 'flex';
  document.getElementById('guidePopup').style.display = 'none';
  setTimeout(() => showGuidePopup(), 1000);
};

function showHomePage() {
  document.getElementById("popupContainer").style.display = 'none';
  document.getElementById("carbonCalculator").style.display = 'none';
  document.getElementById("bikeTracker").style.display = 'none';
  document.getElementById("guidePopup").style.display = 'block';
}

let currentNewsIndex = 0;

function nextNews() {
  currentNewsIndex = (currentNewsIndex + 1) % newsSummaries.length;
  updateNews('slide-left');
}

function prevNews() {
  currentNewsIndex = (currentNewsIndex - 1 + newsSummaries.length) % newsSummaries.length;
  updateNews('slide-right');
}

function updateNews(animationClass) {
  popup.classList.remove('slide-left', 'slide-right');
  popup.offsetWidth;
  popup.classList.add(animationClass);

  setTimeout(() => {
    popup.textContent = newsSummaries[currentNewsIndex];
    popup.classList.remove(animationClass);
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
    bikeTracker.style.display = 'none';
    popup.textContent = newsSummaries[currentNewsIndex];
  });
}

function showCarbonCalculator() {
  delayedAction(() => {
    carbonCalculator.style.display = 'flex';
    popupContainer.style.display = 'none';
    bikeTracker.style.display = 'none';
  });
}

function showProfile() {
  delayedAction(() => {
    popupContainer.style.display = 'none';
    carbonCalculator.style.display = 'none';
    bikeTracker.style.display = 'flex';
  });
}

function calculateCarbon() {
  const distance = parseFloat(document.getElementById('distance').value);
  const fuelEfficiency = parseFloat(document.getElementById('fuel').value);

  if (isNaN(distance) || isNaN(fuelEfficiency) || distance <= 0 || fuelEfficiency <= 0) {
    result.textContent = "Masukkan nilai valid.";
    return;
  }

  const carbonEmission = (distance / fuelEfficiency) * 2.31;
  result.textContent = `Jejak karbon Anda: ${carbonEmission.toFixed(2)} kg CO2.`;
}

let trackingInterval;
let timerInterval;
let totalCalories = 0;
let isTracking = false;
let startTime;

function startBikeTracking() {
  if (isTracking) return;

  const startStopBtn = document.getElementById('startStopBtn');
  startStopBtn.textContent = 'Tracking Dimulai';
  startStopBtn.classList.add('tracking-started');

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  if (navigator.geolocation) {
    trackingInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const speed = position.coords.speed || 0;
        const speedKmH = (speed * 3.6).toFixed(2);
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
  if (!isTracking) return;

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
  return 0.029 * speedKmH;
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
