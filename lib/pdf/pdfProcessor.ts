export interface PDFProcessResult {
  text: string;
  pages: number;
  limited: boolean;
}

export async function processPDF(buffer: Buffer): Promise<PDFProcessResult> {
  try {
    // pdf-parse v1 API: pdfParse(buffer) → { text, numpages }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfModule = await import("pdf-parse") as any;
    const pdfParse: (buf: Buffer) => Promise<{ text: string; numpages: number }> =
      pdfModule.default ?? pdfModule;
    const data = await pdfParse(buffer);
    const text = data.text || "";
    const limited = text.length < 500 || text.trim().split(/\s+/).length < 100;
    return {
      text: text.substring(0, 100000),
      pages: data.numpages || 0,
      limited,
    };
  } catch (err) {
    console.error("[pdfProcessor] error:", err);
    return { text: "", pages: 0, limited: true };
  }
}

export function extractTitleFromText(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 20 && l.length < 300);

  for (const line of lines.slice(0, 20)) {
    if (
      !line.match(/^(abstract|resumen|methods|introduction|background|doi|issn|vol\.|page|correspondence)/i) &&
      line.length > 30
    ) {
      return line;
    }
  }
  return "Artículo sin título detectado";
}
