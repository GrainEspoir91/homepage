const quotes = [
  {
    text: "L’espérance est une lumière qui reste allumée, même dans l’obscurité.",
    author: ""
  },
  {
    text: "L’espoir nous donne la force d’avancer, même lorsque le chemin semble difficile.",
    author: ""
  },
  {
    text: "Chaque nouveau jour porte en lui une nouvelle raison d’espérer.",
    author: ""
  }
];

const quoteContainer = document.querySelector("#daily-quote");
const quoteText = document.querySelector("#daily-quote-text");
const quoteAuthor = document.querySelector("#daily-quote-author");

let currentIndex = 0;

function renderQuote(index) {
  const quote = quotes[index];

  quoteText.textContent = quote.text;

  quoteAuthor.textContent = quote.author
    ? `— ${quote.author}`
    : "";
}

function changeQuote() {
  quoteContainer.classList.add("quote-hidden");

  setTimeout(() => {
    currentIndex = (currentIndex + 1) % quotes.length;

    renderQuote(currentIndex);

    quoteContainer.classList.remove("quote-hidden");
  }, 700);
}


/* Première citation */

renderQuote(currentIndex);


/* Citation suivante toutes les 7 secondes */

setInterval(changeQuote, 7000);
