let speech = window.speechSynthesis;
let voiceSelect = document.getElementById("voiceSelect");
let textInput = document.getElementById("textInput");

function loadVoices() {
    let voices = speech.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach((voice, i) => {
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(opt);
    });
}
window.speechSynthesis.onvoiceschanged = loadVoices;

document.getElementById("rate").oninput = e => {
    document.getElementById("rateVal").textContent = e.target.value;
};
document.getElementById("pitch").oninput = e => {
    document.getElementById("pitchVal").textContent = e.target.value;
};

document.getElementById("speakBtn").onclick = () => {
    if (!textInput.value.trim()) return alert("Please enter some text first.");

    let utter = new SpeechSynthesisUtterance(textInput.value);
    let voices = speech.getVoices();
    utter.voice = voices[voiceSelect.value];
    utter.rate = document.getElementById("rate").value;
    utter.pitch = document.getElementById("pitch").value;
    speech.speak(utter);
};

document.getElementById("downloadBtn").onclick = () => {
    alert("MP3 export needs backend API. I can build Node.js/Python API for full download support.");
};

document.getElementById("whatsappShare").href =
    "https://api.whatsapp.com/send?text=" +
    encodeURIComponent("Try this Free Text-to-Speech Tool: " + window.location.href);

document.getElementById("facebookShare").href =
    "https://www.facebook.com/sharer/sharer.php?u=" +
    encodeURIComponent(window.location.href);
