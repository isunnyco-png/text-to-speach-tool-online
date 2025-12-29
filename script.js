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
    if (!textInput.value.trim()) return alert("Please enter text");
    let utter = new SpeechSynthesisUtterance(textInput.value);
    let voices = speech.getVoices();
    utter.voice = voices[voiceSelect.value];
    utter.rate = document.getElementById("rate").value;
    utter.pitch = document.getElementById("pitch").value;
    speech.speak(utter);
};

document.getElementById("downloadBtn").onclick = async () => {
    if (!textInput.value.trim()) return alert("Enter text first");
    const res = await fetch("http://localhost:3000/tts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text: textInput.value })
    });
    if(!res.ok){ alert("Error generating audio"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tts.mp3";
    a.click();
    URL.revokeObjectURL(url);
};
