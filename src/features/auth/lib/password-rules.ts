export const PASSWORD_RULE_TEXT =
  "Must be at least 8 characters and include 1 capital and 1 special character.";

export const PASSWORD_RULE_SUMMARY =
  "Use 8+ characters, 1 uppercase letter, and 1 special character.";

const PASSWORD_RULE_PATTERN = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export const isStrongPassword = (value: string) =>
  PASSWORD_RULE_PATTERN.test(value);

export const getPasswordRuleChecks = (value: string) => [
  {
    label: "At least 8 characters",
    met: value.length >= 8,
  },
  {
    label: "1 uppercase letter",
    met: /[A-Z]/.test(value),
  },
  {
    label: "1 special character",
    met: /[^A-Za-z0-9]/.test(value),
  },
];
