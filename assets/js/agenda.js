const DATA_URL =
  "./assets/data/agenda.json";

const track =
  document.querySelector(
    "#agenda-track"
  );

const emptyState =
  document.querySelector(
    "#agenda-empty"
  );

const previousButton =
  document.querySelector(
    "#agenda-previous"
  );

const nextButton =
  document.querySelector(
    "#agenda-next"
  );

let events = [];
let currentIndex = 0;
let rotationTimer = null;


function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  ).format(
    new Date(`${value}T12:00:00`)
  );
}


function renderEvents() {
  track.replaceChildren();

  events.forEach(
    (event) => {
      const article =
        document.createElement(
          "article"
        );

      article.className =
        "agenda-slide";

      const image =
        document.createElement(
          "img"
        );

      image.src = event.file;
      image.alt = event.title;
      image.loading = "lazy";

      article.appendChild(image);

      if (event.date) {
        const date =
          document.createElement(
            "div"
          );

        date.className =
          "agenda-slide-date";

        date.textContent =
          formatDate(event.date);

        article.appendChild(date);
      }

      track.appendChild(article);
    }
  );

  updatePosition();
}


function updatePosition() {
  track.style.transform =
    `translateX(-${currentIndex * 100}%)`;
}


function showNext() {
  if (events.length <= 1) {
    return;
  }

  currentIndex =
    (currentIndex + 1)
    % events.length;

  updatePosition();
}


function showPrevious() {
  if (events.length <= 1) {
    return;
  }

  currentIndex =
    (
      currentIndex
      - 1
      + events.length
    )
    % events.length;

  updatePosition();
}


function startRotation() {
  if (rotationTimer) {
    clearInterval(rotationTimer);
  }

  if (events.length <= 1) {
    return;
  }

  rotationTimer = setInterval(
    showNext,
    6500
  );
}


async function initAgenda() {
  try {
    const response =
      await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    events =
      await response.json();

    if (!Array.isArray(events)) {
      throw new Error(
        "Manifest agenda invalide"
      );
    }

    if (events.length === 0) {
      emptyState.hidden = false;
      return;
    }

    renderEvents();
    startRotation();

  } catch (error) {
    console.warn(
      "Agenda indisponible :",
      error
    );

    emptyState.hidden = false;
  }
}


previousButton?.addEventListener(
  "click",
  () => {
    showPrevious();
    startRotation();
  }
);


nextButton?.addEventListener(
  "click",
  () => {
    showNext();
    startRotation();
  }
);


initAgenda();
