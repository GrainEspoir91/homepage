const QUOVAGO_API_URL =
  "https://api.quovago.com/v1/quotes";

const QUOTE_FILTERS = [
  {
    classification: "ETH_VAL_ESP",
    classificationValue: "POSITIF",
    label: "Espoir"
  },
  {
    classification: "ETH_VAL_AMO",
    classificationValue: "CHALEUREUX",
    label: "Amour"
  }
];

const COMMON_QUERY_PARAMS = {
  language: "fr",
  page: "1",
  pageSize: "100"
};

async function fetchQuotesForFilter(filter) {
  const params = new URLSearchParams({
    ...COMMON_QUERY_PARAMS,
    classification:
      filter.classification,
    classificationValue:
      filter.classificationValue
  });

  const response = await fetch(
    `${QUOVAGO_API_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Erreur API QuoVaGo : HTTP ${response.status}`
    );
  }

  const result = await response.json();

  if (
    !result.success ||
    !Array.isArray(result.data)
  ) {
    throw new Error(
      "Réponse QuoVaGo invalide"
    );
  }

  return result.data;
}

export async function fetchHopeQuotes() {
  const results = await Promise.all(
    QUOTE_FILTERS.map(
      fetchQuotesForFilter
    )
  );

  const quotesById = new Map();

  results.forEach((quotes) => {
    quotes.forEach((quote) => {
      const key =
        quote.id ||
        quote.code ||
        `${quote.title}|${quote.content}`;

      if (!quotesById.has(key)) {
        quotesById.set(
          key,
          quote
        );
      }
    });
  });

  return Array.from(
    quotesById.values()
  );
}
