import { CategoryContent } from "@/features/category-page/types";

export const normalizePrompt = (prompt?: string | null) =>
  prompt
    ?.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n") ?? "";

export const getCategoryPromptForType = (
  categories: CategoryContent[],
  selectedType?: string | null,
) => {
  const normalizedType = selectedType?.trim().toLowerCase();

  if (!normalizedType) {
    return "";
  }

  const matchedCategory = categories.find(
    (category) => category.type?.trim().toLowerCase() === normalizedType,
  );

  return normalizePrompt(matchedCategory?.prompt);
};
