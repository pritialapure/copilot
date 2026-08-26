// Dependency-free PDF generator for plain-text resume documents.

function escapePdfText(text) {
  return String(text).replace(/[^\x20-\x7e\n\r\t]/g, "?").replace(/[\\()]/g, "\\$&").replace(/[\r\t]/g, " ");
}

function wrapLine(line, maxChars) {
  if (!line) return [""];
  const words = String(line).split(/\s+/); const result = []; let current = "";
  for (const word of words) { if (word.length > maxChars) { if (current) result.push(current); for (let i=0;i<word.length;i+=maxChars) result.push(word.slice(i,i+maxChars)); current=""; } else if (`${current} ${word}`.trim().length > maxChars) { result.push(current); current=word; } else current = `${current} ${word}`.trim(); }
  if (current || !result.length) result.push(current); return result;
}

export function textToPdf(text, options = {}) {
  const maxChars = options.maxChars || 90, perPage = options.linesPerPage || 48;
  const lines = String(text || "").split(/\r?\n/).flatMap((line) => wrapLine(line, maxChars));
  const pages = []; for (let i=0;i<lines.length;i+=perPage) pages.push(lines.slice(i, i+perPage));
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", ""];
  const pageIds = pages.map((_, i) => 4 + i * 2); objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id)=>`${id} 0 R`).join(" ")}] /Count ${pages.length} >>`;
  objects[2] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  pages.forEach((page) => { const commands = ["BT", "/F1 10 Tf", "50 760 Td", "14 TL", ...page.flatMap((line, i) => [`(${escapePdfText(line)}) Tj`, ...(i < page.length - 1 ? ["T*"] : [])]), "ET"].join("\n"); const contentId = objects.length + 2; objects.push(`<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 3 0 R >> >> /MediaBox [0 0 612 792] /Contents ${contentId} 0 R >>`); objects.push(`<< /Length ${Buffer.byteLength(commands, "latin1")} >>\nstream\n${commands}\nendstream`); });
  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"; const offsets = [0]; objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf, "latin1")); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }); const start = Buffer.byteLength(pdf, "latin1"); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset)=>`${String(offset).padStart(10,"0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}
