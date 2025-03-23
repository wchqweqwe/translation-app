document.getElementById('translateBtn').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');

    if (!inputText.trim()) {
        outputText.textContent = 'Please enter some text to translate';
        return;
    }

    // Show loading state
    translateBtn.disabled = true;
    translateBtn.textContent = 'Translating...';
    outputText.textContent = '';

    try {
        // Try primary translation API
        let translation = await translateText(inputText, 'en', 'zh');

        if (!translation) {
            // Fallback to secondary API if primary fails
            translation = await fallbackTranslateText(inputText, 'en', 'zh');
            if (!translation) {
                throw new Error('No translation received from APIs');
            }
        }

        outputText.textContent = translation;
    } catch (error) {
        outputText.textContent = 'Translation failed. Please try again.';
        console.error('Translation error:', {
            error: error.message,
            input: inputText,
            stack: error.stack
        });
    } finally {
        // Restore button state
        translateBtn.disabled = false;
        translateBtn.textContent = 'Translate';
    }
});

async function fallbackTranslateText(text, sourceLang, targetLang) {
    // Fallback translation service using MyMemory API
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        return data.responseData?.translatedText || null;
    } catch (error) {
        console.error('Fallback translation error:', error);
        return null;
    }
}

async function translateText(text, sourceLang, targetLang) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorResponse}`);
        }

        const data = await response.json();
        console.log('MyMemory API Response:', data);

        if (!data.responseData || !data.responseData.translatedText) {
            throw new Error('Invalid response from translation API');
        }

        return data.responseData.translatedText;
    } catch (error) {
        console.error('MyMemory API Error:', {
            message: error.message,
            text: text,
            status: response?.status,
            fullError: error
        });
        throw error;
    }
}

async function fallbackTranslateText(text, sourceLang, targetLang) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorResponse}`);
        }

        const data = await response.json();
        console.log('MyMemory API Response:', data);

        if (!data.responseData || !data.responseData.translatedText) {
            throw new Error('Invalid response from fallback translation API');
        }

        return data.responseData.translatedText;
    } catch (error) {
        console.error('MyMemory API Error:', {
            message: error.message,
            text: text,
            status: response?.status,
            fullError: error
        });
        return null;
    }
}
