document.getElementById('translateBtn').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const outputText = document.getElementById('outputText');

    if (!inputText.trim()) {
        outputText.textContent = 'Please enter some text to translate';
        return;
    }

    try {
        const translation = await translateText(inputText, 'en', 'zh');
        if (!translation) {
            throw new Error('No translation received from API');
        }
        outputText.textContent = translation;
    } catch (error) {
        outputText.textContent = 'Translation failed. Please try again.';
        console.error('Translation error:', {
            error: error.message,
            input: inputText,
            stack: error.stack
        });
    }
});

async function translateText(text, sourceLang, targetLang) {
    const url = 'https://libretranslate.com/translate';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text'
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.translatedText) {
            throw new Error('Invalid response from translation API');
        }

        return data.translatedText;
    } catch (error) {
        console.error('API Error:', {
            message: error.message,
            text: text,
            status: response?.status
        });
        throw error;
    }
}
