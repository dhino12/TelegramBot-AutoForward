// function escapeMarkdownV2(text) {
//   const escapeChars = [
//     "_",
//     "*",
//     "[",
//     "]",
//     "(",
//     ")",
//     "~",
//     "`",
//     ">",
//     "#",
//     "+",
//     "-",
//     "=",
//     "|",
//     "{",
//     "}",
//     ".",
//     "!",
//   ];
//   const escapedText = text.replace(
//     new RegExp(`[${escapeChars.join("\\")}]`, "g"),
//     (char) => `\\${char}`
//   );
//   return escapedText;
// }

// function formatMarkdownV2(text, type) {
//   switch (type) {
//     case "bold":
//       return `*${text}*`;
//     case "italic":
//       return `_${text}_`;
//     case "code":
//       return `\`${text}\``;
//     case "link":
//       const [url, label] = text.split("|");
//       return `[${label}](${url})`;
//     default:
//       return text;
//   }
// }

function convertToMarkdownV2(text) {
  return text
    .replace(/\_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\~/g, '\\~')
    .replace(/\`/g, '\\`')
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

module.exports = { convertToMarkdownV2 }