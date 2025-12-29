let speech = window.speechSynthesis;
let voiceSelect = document.getElementById("voiceSelect");
let textInput = document.getElementById("textInput");

function loadVoices() {
    let voices = speech.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach((voice, i) => {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = voice.name;
        voiceSelect.appendChild(option);
    });
}

window.speechSynthesis.onvoiceschanged = loadVoices;

document.getElementById("speakBtn").onclick = () => {
    let utter = new SpeechSynthesisUtterance(textInput.value);
    let voices = speech.getVoices();
    utter.voice = voices[voiceSelect.value];
    utter.rate = document.getElementById("rate").value;
    utter.pitch = document.getElementById("pitch").value;
    speech.speak(utter);
};

document.getElementById("downloadBtn").onclick = () => {
    alert("Browser TTS doesn’t export MP3 directly. Use backend API later for real MP3 generation.");
};

document.getElementById("whatsappShare").href =
    "https://api.whatsapp.com/send?text=" + encodeURIComponent("Try this Text-to-Speech Tool: " + window.location.href);

document.getElementById("facebookShare").href =
    "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href);
