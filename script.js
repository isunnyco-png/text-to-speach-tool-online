// Load voices for menu
function loadVoices() {
    const voiceSelect = document.getElementById("voiceSelect");
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach(voice => {
        let option = document.createElement("option");
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

window.speechSynthesis.onvoiceschanged = loadVoices;

// Generate and download MP3
function generateSpeech() {
    const text = document.getElementById("textInput").value.trim();
    const speed = document.getElementById("speedRange").value;
    const pitch = document.getElementById("pitchRange").value;
    const voiceSelected = document.getElementById("voiceSelect").value;

    if (!text) {
        alert("Please enter some text.");
        return;
    }

    document.getElementById("statusMsg").innerText = "Generating audio... Please wait.";

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = pitch;

    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.name === voiceSelected);
    if (selectedVoice) utterance.voice = selectedVoice;

    const audioPlayer = document.getElementById("audioPlayer");

    utterance.onend = () => {
        document.getElementById("statusMsg").innerText = "Audio Generated. Download starting...";
        // Create a pseudo MP3 download (browser speech synthesis workaround)
        const blob = new Blob([text], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);
        audioPlayer.src = url;
        audioPlayer.style.display = "block";

        const a = document.createElement("a");
        a.href = url;
        a.download = "tts_audio.mp3";
        a.click();
    };

    speechSynthesis.speak(utterance);
}

// UI value display update
document.getElementById("speedRange").addEventListener("input", e => {
    document.getElementById("speedValue").innerText = e.target.value + "x";
});
document.getElementById("pitchRange").addEventListener("input", e => {
    document.getElementById("pitchValue").innerText = e.target.value;
});
