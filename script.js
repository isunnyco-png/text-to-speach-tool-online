function speak() {
    const text = document.getElementById("text").value;
    const lang = document.getElementById("lang").value;

    if(!text.trim()) {
        alert("Please enter some text first");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang;
    speech.pitch = 1;
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
}