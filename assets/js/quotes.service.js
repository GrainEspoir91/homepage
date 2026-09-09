const QUOVAGO_API_URL =
  "https://api.quovago.com/v1/quotes";

const QUERY_PARAMS = {
  classification: "ETH_VAL_ESP",
  classificationValue: "POSITIF",
  language: "fr",
  page: "1",
  pageSize: "100"
};

export async function fetchHopeQuotes() {
  const params = new URLSearchParams(QUERY_PARAMS);

  const response = await fetch(
    `${QUOVAGO_API_URL}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Erreur API QuoVaGo : HTTP ${response.status}`
    );
  }

  const result = await response.json();

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error(
      "Réponse QuoVaGo invalide"
    );
  }

  return result.data;
}
