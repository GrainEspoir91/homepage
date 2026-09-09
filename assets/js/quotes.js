import { fetchHopeQuotes } from "./quotes.service.js";

const fallbackQuotes = [
  {
    text: "L’espérance est une lumière qui reste allumée, même dans l’obscurité.",
    title: ""
  },
  {
    text: "L’espoir nous donne la force d’avancer, même lorsque le chemin semble difficile.",
    title: ""
  },
  {
    text: "Chaque nouveau jour porte en lui une nouvelle raison d’espérer.",
    title: ""
  }
];

const quoteContainer =
  document.querySelector("#daily-quote");

const quoteText =
  document.querySelector("#daily-quote-text");

const quoteAuthor =
  document.querySelector("#daily-quote-author");

let quotes = [];
let currentIndex = 0;
let rotationTimer = null;

function normalizeQuote(quote) {
  return {
    text: quote.content || "",
    title: quote.title || ""
  };
}

function renderQuote(index) {
  const quote = quotes[index];

  if (!quote) {
    return;
  }

  quoteText.textContent = quote.text;

  quoteAuthor.textContent = quote.title || "";
}

function changeQuote() {
  if (quotes.length <= 1) {
    return;
  }

  quoteContainer.classList.add("quote-hidden");

  setTimeout(() => {
    currentIndex =
      (currentIndex + 1) % quotes.length;

    renderQuote(currentIndex);

    quoteContainer.classList.remove(
      "quote-hidden"
    );
  }, 700);
}

function startRotation() {
  if (rotationTimer) {
    clearInterval(rotationTimer);
  }

  if (quotes.length <= 1) {
    return;
  }

  rotationTimer = setInterval(
    changeQuote,
    7000
  );
}

async function initQuotes() {
  try {
    const apiQuotes = await fetchHopeQuotes();

    quotes = apiQuotes
      .map(normalizeQuote)
      .filter((quote) => quote.text);

    if (quotes.length === 0) {
      throw new Error(
        "Aucune citation d'espoir disponible"
      );
    }

  } catch (error) {
    console.warn(
      "QuoVaGo indisponible, utilisation du fallback local.",
      error
    );

    quotes = fallbackQuotes;
  }

  currentIndex = 0;

  renderQuote(currentIndex);
  startRotation();
}

initQuotes();
