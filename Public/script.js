// Move all JavaScript from your HTML to this file
// This makes your code cleaner and easier to maintain

// API Configuration
const API_BASE_URL = window.location.origin;

// DOM Elements
const textInput = document.getElementById('textInput');
const languageSelect = document.getElementById('language');
const voiceTypeSelect = document.getElementById('voiceType');
const maleBtn = document.getElementById('maleBtn');
const femaleBtn = document.getElementById('femaleBtn');
const neutralBtn = document.getElementById('neutralBtn');
const rateSlider = document.getElementById('rate');
const pitchSlider = document.getElementById('pitch');
const volumeSlider = document.getElementById('volume');
const rateValue = document.getElementById('rateValue');
const pitchValue = document.getElementById('pitchValue');
const volumeValue = document.getElementById('volumeValue');
const speakBtn = document.getElementById('speakBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadMp3Btn = document.getElementById('downloadMp3Btn');
const testApiBtn = document.getElementById('testApiBtn');
const clearBtn = document.getElementById('clearBtn');

// State variables
let speech = null;
let isSpeaking = false;
let isPaused = false;
let currentGender = 'male';
let audioFiles = [];

// Initialize the app
function init() {
    setupEventListeners();
    updateTextAnalysis();
    updateLanguageDisplay();
    loadAudioFiles();
    
    // Test API connection on load
    testApiConnection();
}

function setupEventListeners() {
    // Slider updates
    rateSlider.addEventListener('input', () => rateValue.textContent = rateSlider.value);
    pitchSlider.addEventListener('input', () => pitchValue.textContent = pitchSlider.value);
    volumeSlider.addEventListener('input', () => volumeValue.textContent = volumeSlider.value);
    
    // Text analysis
    textInput.addEventListener('input', updateTextAnalysis);
    
    // Gender buttons
    maleBtn.addEventListener('click', () => setGender('male'));
    femaleBtn.addEventListener('click', () => setGender('female'));
    neutralBtn.addEventListener('click', () => setGender('neutral'));
    
    // Action buttons
    speakBtn.addEventListener('click', speakText);
    pauseBtn.addEventListener('click', togglePause);
    stopBtn.addEventListener('click', stopSpeech);
    downloadMp3Btn.addEventListener('click', generateMp3);
    testApiBtn.addEventListener('click', testApiConnection);
    clearBtn.addEventListener('click', clearText);
    
    // Language change
    languageSelect.addEventListener('change', updateLanguageDisplay);
}

function setGender(gender) {
    currentGender = gender;
    [maleBtn, femaleBtn, neutralBtn].forEach(btn => btn.classList.remove('active'));
    if (gender === 'male') maleBtn.classList.add('active');
    else if (gender === 'female') femaleBtn.classList.add('active');
    else neutralBtn.classList.add('active');
    showNotification(`Voice set to ${gender}`, 'info');
}

function updateTextAnalysis() {
    const text = textInput.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    
    document.getElementById('wordCount').textContent = words.length;
    document.getElementById('charCount').textContent = characters;
    
    const readTime = Math.ceil(words.length / 150 * 60);
    document.getElementById('readTime').textContent = `${readTime}s`;
}

function updateLanguageDisplay() {
    const langCode = languageSelect.value.substring(0, 2).toUpperCase();
    document.getElementById('languageCode').textContent = langCode;
}

// Speech functions
function speakText() {
    const text = textInput.value.trim();
    
    if (!text) {
        showNotification('Please enter some text to speak.', 'warning');
        return;
    }
    
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        speech = new SpeechSynthesisUtterance(text);
        speech.lang = languageSelect.value;
        speech.rate = parseFloat(rateSlider.value);
        speech.pitch = parseFloat(pitchSlider.value);
        speech.volume = parseFloat(volumeSlider.value);
        
        const voices = window.speechSynthesis.getVoices();
        const selectedLang = languageSelect.value;
        let voice = voices.find(v => v.lang === selectedLang);
        
        if (voice) {
            speech.voice = voice;
        }
        
        speech.onstart = () => {
            isSpeaking = true;
            isPaused = false;
            updateStatus('speak');
            showNotification('Speaking now...', 'info');
        };
        
        speech.onend = () => {
            isSpeaking = false;
            isPaused = false;
            updateStatus('ready');
            showNotification('Speech completed.', 'success');
        };
        
        speech.onerror = (event) => {
            isSpeaking = false;
            isPaused = false;
            updateStatus('stop');
            showNotification('Speech error occurred.', 'error');
            console.error('Speech error:', event);
        };
        
        window.speechSynthesis.speak(speech);
    } else {
        showNotification('Speech synthesis not supported in your browser.', 'error');
    }
}

function togglePause() {
    if (!isSpeaking) return;
    
    if (isPaused) {
        window.speechSynthesis.resume();
        isPaused = false;
        updateStatus('speak');
        showNotification('Resumed speaking.', 'info');
    } else {
        window.speechSynthesis.pause();
        isPaused = true;
        updateStatus('pause');
        showNotification('Paused speech.', 'warning');
    }
}

function stopSpeech() {
    if (speech) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        isPaused = false;
        updateStatus('stop');
        showNotification('Speech stopped.', 'info');
    }
}

function updateStatus(status) {
    const statusIndicator = document.getElementById('statusIndicator');
    statusIndicator.className = 'status-indicator';
    
    switch(status) {
        case 'speak':
            statusIndicator.classList.add('status-speak');
            statusIndicator.innerHTML = '<i class="fas fa-volume-up"></i> Speaking...';
            break;
        case 'pause':
            statusIndicator.classList.add('status-pause');
            statusIndicator.innerHTML = '<i class="fas fa-pause"></i> Paused';
            break;
        case 'stop':
            statusIndicator.classList.add('status-stop');
            statusIndicator.innerHTML = '<i class="fas fa-stop"></i> Stopped';
            break;
        default:
            statusIndicator.classList.add('status-ready');
            statusIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Ready to speak';
    }
}

// API Integration Functions
async function generateMp3() {
    const text = textInput.value.trim();
    
    if (!text) {
        showNotification('Please enter some text to convert to MP3.', 'warning');
        return;
    }
    
    showProgress('Starting MP3 generation...', 0);
    
    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                language: languageSelect.value,
                voice: currentGender,
                speed: parseFloat(rateSlider.value),
                pitch: parseFloat(pitchSlider.value)
            })
        });
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Simulate progress
            simulateProgress(100);
            
            // Create download
            const audioFile = {
                id: Date.now(),
                filename: data.audio.filename,
                text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
                language: languageSelect.value,
                gender: currentGender,
                size: formatBytes(data.audio.size),
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                url: data.download_url
            };
            
            // Add to audio library
            audioFiles.unshift(audioFile);
            saveAudioFiles();
            renderAudioLibrary();
            
            // Trigger download
            triggerDownload(audioFile);
            
            showNotification('MP3 generated successfully!', 'success');
        } else {
            throw new Error(data.error || 'Failed to generate MP3');
        }
        
    } catch (error) {
        console.error('MP3 Generation Error:', error);
        showNotification(`Error: ${error.message}`, 'error');
        hideProgress();
    }
}

async function testApiConnection() {
    showNotification('Testing API connection...', 'info');
    
    try {
        const response = await fetch('/api/health');
        
        if (response.ok) {
            const data = await response.json();
            showNotification(`API Status: ${data.status} ✓`, 'success');
            console.log('API Health:', data);
        } else {
            showNotification('API connection failed', 'error');
        }
    } catch (error) {
        showNotification(`Cannot connect to API: ${error.message}`, 'error');
    }
}

// Helper functions
function showNotification(message, type = 'info') {
    // Use browser notifications or create your own
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // You can use Toastify or create custom notifications
    if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: getNotificationColor(type),
        }).showToast();
    } else {
        alert(message);
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#2ecc71';
        case 'error': return '#e74c3c';
        case 'warning': return '#f39c12';
        default: return '#3498db';
    }
}

function showProgress(message, percent) {
    const progressContainer = document.getElementById('progressContainer');
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    
    if (progressContainer && progressText && progressFill) {
        progressContainer.style.display = 'block';
        progressText.textContent = message;
        progressFill.style.width = `${percent}%`;
    }
}

function hideProgress() {
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 1000);
    }
}

function simulateProgress(targetPercent) {
    let currentPercent = 0;
    const interval = setInterval(() => {
        currentPercent += 10;
        showProgress(`Generating MP3... ${currentPercent}%`, currentPercent);
        
        if (currentPercent >= targetPercent) {
            clearInterval(interval);
            showProgress('MP3 generated successfully!', 100);
            setTimeout(hideProgress, 2000);
        }
    }, 200);
}

function triggerDownload(audioFile) {
    // Create download link
    const link = document.createElement('a');
    link.href = audioFile.url || '#';
    link.download = audioFile.filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function loadAudioFiles() {
    const saved = localStorage.getItem('tts_audio_files');
    if (saved) {
        audioFiles = JSON.parse(saved);
        renderAudioLibrary();
    }
}

function saveAudioFiles() {
    // Keep only last 10 files
    if (audioFiles.length > 10) {
        audioFiles = audioFiles.slice(0, 10);
    }
    localStorage.setItem('tts_audio_files', JSON.stringify(audioFiles));
}

function renderAudioLibrary() {
    const audioLibrary = document.getElementById('audioLibrary');
    if (!audioLibrary) return;
    
    if (audioFiles.length === 0) {
        audioLibrary.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">
                <i class="fas fa-music" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                <h3>No audio files yet</h3>
                <p>Generate your first MP3 file to see it here!</p>
            </div>
        `;
        return;
    }
    
    audioLibrary.innerHTML = audioFiles.map(file => `
        <div class="audio-item">
            <div class="audio-info">
                <div class="audio-title">${file.filename}</div>
                <div class="audio-meta">
                    ${file.language.toUpperCase()} • ${file.gender} • ${file.size} • ${file.date} ${file.time}
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 5px;">
                    ${file.text}
                </div>
            </div>
            <div class="audio-actions">
                <button class="btn-icon" onclick="playAudio('${file.id}')" title="Play">
                    <i class="fas fa-play"></i>
                </button>
                <button class="btn-icon" onclick="downloadAudio('${file.id}')" title="Download">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon" onclick="deleteAudio('${file.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Global functions for audio library
window.playAudio = function(id) {
    const file = audioFiles.find(f => f.id === id);
    if (file) {
        textInput.value = file.text + '...';
        speakText();
        showNotification(`Playing: ${file.filename}`, 'info');
    }
};

window.downloadAudio = function(id) {
    const file = audioFiles.find(f => f.id === id);
    if (file) {
        triggerDownload(file);
        showNotification(`Downloading: ${file.filename}`, 'success');
    }
};

window.deleteAudio = function(id) {
    if (confirm('Are you sure you want to delete this audio file?')) {
        audioFiles = audioFiles.filter(f => f.id !== id);
        saveAudioFiles();
        renderAudioLibrary();
        showNotification('Audio file deleted', 'info');
    }
};

function clearText() {
    if (textInput.value.trim() !== '' && confirm('Clear all text?')) {
        textInput.value = '';
        updateTextAnalysis();
        showNotification('Text cleared', 'info');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);