const qaForm = document.getElementById('qaForm');
const userQuestion = document.getElementById('userQuestion');
const loader = document.getElementById('loader');
const responseCard = document.getElementById('responseCard');
const answerText = document.getElementById('answerText');
const relatedTopics = document.getElementById('relatedTopics');
const topicsList = document.getElementById('topicsList');
const sourcesContainer = document.getElementById('sourcesContainer');
const sourceLink = document.getElementById('sourceLink');

qaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = userQuestion.value.trim();
    if (!query) return;

    // Reset da interface
    responseCard.classList.add('hidden');
    sourcesContainer.classList.add('hidden');
    relatedTopics.classList.add('hidden');
    topicsList.innerHTML = '';
    loader.classList.remove('hidden');

    try {
        // Requisição para a API Instant Answer do DuckDuckGo
        const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' nostalgia cultura pop mpb')}&format=json&no_redirect=1&no_html=1`;
        
        const response = await fetch(ddgUrl);
        const data = await response.json();

        loader.classList.add('hidden');
        responseCard.classList.remove('hidden');

        // Resposta direta
        let mainText = data.AbstractText || data.Answer;

        if (mainText) {
            answerText.innerHTML = `<p>${mainText}</p>`;
            if (data.AbstractURL) {
                sourceLink.href = data.AbstractURL;
                sourceLink.innerText = `🌐 Matéria/Fonte Original (${data.AbstractSource || 'DuckDuckGo'}) ➔`;
                sourcesContainer.classList.remove('hidden');
            }
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            // Tópicos e notícias retornados
            answerText.innerHTML = `<p>Encontramos os seguintes fatos e informações sobre <strong>"${query}"</strong> no DuckDuckGo:</p>`;
            
            let count = 0;
            data.RelatedTopics.forEach(item => {
                if (item.Text && item.FirstURL && count < 4) {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <p>${item.Text}</p>
                        <a href="${item.FirstURL}" target="_blank" class="topic-link">Ler notícia na íntegra ➔</a>
                    `;
                    topicsList.appendChild(li);
                    count++;
                }
            });

            if (count > 0) {
                relatedTopics.classList.remove('hidden');
            } else {
                renderSearchFallback(query);
            }
        } else {
            renderSearchFallback(query);
        }

    } catch (error) {
        console.error("Erro ao buscar no DuckDuckGo:", error);
        loader.classList.add('hidden');
        responseCard.classList.remove('hidden');
        renderSearchFallback(query);
    }
});

function renderSearchFallback(query) {
    answerText.innerHTML = `<p>Não foi possível sintetizar um resumo direto em um único parágrafo, mas a busca no DuckDuckGo por <strong>"${query}"</strong> está pronta para você conferir na fonte oficial.</p>`;
    sourceLink.href = `https://duckduckgo.com/?q=${encodeURIComponent(query + ' nostalgia cultura pop')}`;
    sourceLink.innerText = `🌐 Ver todos os resultados e notícias no DuckDuckGo ➔`;
    sourcesContainer.classList.remove('hidden');
}