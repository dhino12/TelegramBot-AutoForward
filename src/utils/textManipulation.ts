const toMarkdownV2 = (text: string) => {
    // https://stackoverflow.com/questions/40626896/telegram-does-not-escape-some-markdown-characters
    // Replace double asterisks with single asterisks for bold text
    let markdownText = text.replace(/\*\*/g, '*');

    // Add code formatting to '/connect' line
    markdownText = markdownText.replace(/\/connect ([^\n]+)/g, '`/connect $1`');

    // Replace the [clicking here](URL) placeholder with an actual URL
    markdownText = markdownText.replace(/\[clicking here\]\(URL\)/, '[clicking here](URL)');

    return markdownText.replace(/\_/g, '\\_')
        .replace(/\~/g, '\\~') 
        .replace(/\>/g, '\\>') 
        .replace(/\#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/\-/g, '\\-')
        .replace(/\=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/\!/g, '\\!')
}

export {toMarkdownV2}