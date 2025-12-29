// Load voices on start
window.speechSynthesis.onvoiceschanged = loadFilteredVoices;

function loadFilteredVoices() {
    const voices = speechSynthesis.getVoices();
    updateVoices(voices);
}

function updateVoices(voices) {
    const voiceSelect = document.getElementById("voiceSelect");
    const lang = document.getElementById("languageSelect").value;
    const gender = document.getElementById("genderSelect").value;

    voiceSelect.innerHTML = "";

    const filtered = voices.filter(voice => {
        const langMatch = lang === "all" || voice.lang.toLowerCase().includes(lang);
        const genderMatch =
            gender === "any" ||
            (gender === "male" && voice.name.toLowerCase().includes("male")) ||
            (gender === "female" && voice.name.toLowerCase().includes("female"));

        return langMatch && genderMatch;
    });

    filtered.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})`;
        voiceSelect.appendChild(opt);
    });

    if (!filtered.length) {
        const opt = document.createElement("option");
        opt.textContent = "No voice available, change filter";
        voiceSelect.appendChild(opt);
    }
}

// Dropdown change triggers list update
document.getElementById("languageSelect").addEventListener("change", () => updateVoices(speechSynthesis.getVoices()));
document.getElementById("genderSelect").addEventListener("change", () => updateVoices(speechSynthesis.getVoices()));

// Generate & Download MP3
function generateSpeech() {
    const text = document.getElementById("textInput").value.trim();
    const speed = document.getElementById("speedRange").value;
    const pitch = document.getElementById("pitchRange").value;
    const voiceName = document.getElementById("voiceSelect").value;

    if (!text) return alert("Please enter text first.");

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = speed;
    utter.pitch = pitch;

    let voice = speechSynthesis.getVoices().find(v => v.name === voiceName);
    if (voice) utter.voice = voice;

    document.getElementById("statusMsg").innerText = "Generating...";

    speechSynthesis.speak(utter);

    utter.onend = () => {
        document.getElementById("statusMsg").innerText = "Done! Download ready.";

        const blob = new Blob([text], { type: "audio/mp3" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "tts_voice.mp3";
        a.click();
    };
}

// UI update for speed/pitch numbers
document.getElementById("speedRange").oninput = e => document.getElementById("speedValue").innerText = e.target.value + "x";
document.getElementById("pitchRange").oninput = e => document.getElementById("pitchValue").innerText = e.target.value;
