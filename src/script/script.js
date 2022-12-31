import languages from "./languages.js";

const body = document.querySelector("html"),
    toggle = document.getElementById("btn-moon-sun"),
    icon = document.getElementById("dark-mode-icon");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "moon") {
    body.classList.add("moon");
    icon.classList.add("bx-sun")
    toggle.classList.add("active");
}

toggle.addEventListener("click", () => {
    body.classList.toggle("moon");
    icon.classList.toggle("bx-sun")

    if (!body.classList.contains("moon")) {
        return localStorage.setItem("mode", "sun");
    }
    localStorage.setItem("mode", "moon");
});

toggle.addEventListener("click", () => toggle.classList.toggle("active"));

const selectFirst = document.querySelector(".first")
const selectSecond = document.querySelector(".second")
const translate = document.querySelector(".translate")
const fromText = document.querySelector(".fromText")
const toText = document.querySelector(".toText")
const change = document.getElementById("change")
const reades = document.querySelectorAll(".read")
const listen = document.querySelector(".listen")
const language1 = "en-GB"
const language2 = "es-ES"

for (const i in languages) {
    const key = Object.keys(languages[i]).toString()
    const value = Object.values(languages[i]).toString()
    selectFirst.innerHTML += `<option value=${key}>${value}</option>`
    selectSecond.innerHTML += `<option value=${key}>${value}</option>`
}

selectFirst.value = language1
selectSecond.value = language2

change.addEventListener("click", _ => {
    const selectFirstValue = selectFirst.value
    selectFirst.value = selectSecond.value
    selectSecond.value = selectFirstValue

    if (!toText.value) return
    const fromTextValue = fromText.value
    fromText.value = toText.value
    toText.value = fromTextValue
})

translate.addEventListener("click", async _ => {
    if (!fromText.value) return
    toText.setAttribute('placeholder', 'Traduciendo...');
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${fromText.value}&langpair=${selectFirst.value}|${selectSecond.value}`)
    const data = await res.json()
    toText.value = data.responseData.translatedText
})

fromText.addEventListener('keyup', () => {
    if (!fromText.value) {
        toText.value = "";
        toText.setAttribute('placeholder', 'Traducción');
    }
})

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const recognition = new SpeechRecognition()

reades.forEach((read, index) => {
    read.addEventListener("click", _ => {
        const textToRead = index == 0 ? fromText.value : toText.value
        if (!textToRead) return
        speechSynthesis.speak(new SpeechSynthesisUtterance(textToRead))
    })
});

recognition.onresult = (event) => {
    fromText.value = event.results[0][0].transcript
}

listen.addEventListener("click", _ => {
    recognition.start()
})
