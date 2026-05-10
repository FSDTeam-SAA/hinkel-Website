type RichTextNode = {
  type?: string;
  text?: string;
  content?: RichTextNode[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isRichTextJsonString = (value: string) => {
  try {
    const parsed = JSON.parse(value);
    return isRecord(parsed) && parsed.type === "doc";
  } catch {
    return false;
  }
};

export const toRichTextContent = (value?: string | null) => {
  if (!value) {
    return "";
  }

  if (isRichTextJsonString(value)) {
    return value;
  }

  return JSON.stringify({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: value }],
      },
    ],
  });
};

const collectText = (node: RichTextNode): string => {
  if (node.type === "hardBreak") {
    return "\n";
  }

  const ownText = node.text ?? "";
  const childText = node.content?.map(collectText).join("") ?? "";
  const text = `${ownText}${childText}`;

  if (node.type === "paragraph" || node.type === "heading") {
    return `${text}\n`;
  }

  if (node.type === "listItem") {
    return `${text}\n`;
  }

  return text;
};

export const getPlainTextFromRichText = (value?: string | null) => {
  if (!value) {
    return "";
  }

  if (!isRichTextJsonString(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value) as RichTextNode;
    return collectText(parsed)
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch {
    return value;
  }
};
