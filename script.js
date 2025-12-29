document.getElementById("downloadBtn").onclick = async () => {
    let text = document.getElementById("textInput").value.trim();
    if (!text) return alert("Enter text first!");

    const payload = {
        input: { text },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" }
    };

    const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!data.audioContent) return alert("API failed. Check backend.");

    // Convert base64 to mp3
    const mp3Data = atob(data.audioContent);
    const arrayBuffer = new Uint8Array(mp3Data.length);
    for (let i = 0; i < mp3Data.length; i++) arrayBuffer[i] = mp3Data.charCodeAt(i);

    const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "voice_output.mp3";
    a.click();
};
