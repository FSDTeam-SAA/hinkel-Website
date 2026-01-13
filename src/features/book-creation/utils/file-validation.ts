import { FILE_VALIDATION } from "../book";

/**
 * Validates if file is allowed for upload
 */
export const isValidFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > FILE_VALIDATION.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${FILE_VALIDATION.MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  if (
    !FILE_VALIDATION.ALLOWED_TYPES.includes(
      file.type as (typeof FILE_VALIDATION.ALLOWED_TYPES)[number],
    )
  ) {
    return {
      valid: false,
      error: "File type must be JPEG, PNG, or WebP",
    };
  }

  return { valid: true };
};

/**
 * Converts file to base64 data URL
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
