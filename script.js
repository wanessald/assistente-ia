document.addEventListener("DOMContentLoaded", () => {
  const inputApiKey = document.querySelector("#apiKey");
  const textAreaQuestion = document.querySelector("#question");
  const askForm = document.querySelector("#askForm");
  const responseContent = document.querySelector("#responseContent");

  textAreaQuestion.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      askForm.requestSubmit();
    }
  });

  async function sendQuestion() {
    console.log("Iniciando requisição...");
    responseContent.textContent = "Carregando...";
    try {
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }
      console.log("Requisição enviada");
      const data = await response.json();
      console.log("Resposta recebida", data);

      const res =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta";
      responseContent.innerHTML = marked.parse(res);
    } catch (error) {
      console.error("Erro na requisição:", error);
      responseContent.textContent = "Erro ao buscar resposta.";
    }
  }
  askForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendQuestion();
  });
  formatResponseText(responseContent.text);
});
