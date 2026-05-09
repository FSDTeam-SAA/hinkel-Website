import { Extension, type CommandProps } from "@tiptap/core";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Image } from "@tiptap/extension-image";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (fontSize: string) => ReturnType;
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType;
    };
    spacing: {
      setLineHeight: (lineHeight: string) => ReturnType;
      setParagraphSpacing: (marginBottom: string) => ReturnType;
    };
  }
}

export const Spacing = Extension.create({
  name: "spacing",

  addGlobalAttributes() {
    const getSpacingStyles = (attributes: {
      lineHeight?: string | null;
      marginBottom?: string | null;
    }) => {
      const styles = [
        attributes.lineHeight ? `line-height: ${attributes.lineHeight}` : null,
        attributes.marginBottom
          ? `margin-bottom: ${attributes.marginBottom}`
          : null,
      ].filter(Boolean);

      return styles.length > 0 ? { style: styles.join("; ") } : {};
    };

    return [
      {
        types: ["paragraph", "heading", "listItem"],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => {
              const styleAttr = element.getAttribute("style");
              if (!styleAttr) return null;
              const match = styleAttr.match(/line-height:\s*([^;]+)/);
              return match ? match[1].trim() : null;
            },
            renderHTML: (attributes) => {
              return getSpacingStyles(attributes);
            },
          },
          marginBottom: {
            default: null,
            parseHTML: (element) => {
              const styleAttr = element.getAttribute("style");
              if (!styleAttr) return null;
              const match = styleAttr.match(/margin-bottom:\s*([^;]+)/);
              return match ? match[1].trim() : null;
            },
            renderHTML: (attributes) => {
              return getSpacingStyles(attributes);
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ chain }) => {
          return chain()
            .updateAttributes("paragraph", { lineHeight })
            .updateAttributes("heading", { lineHeight })
            .updateAttributes("listItem", { lineHeight })
            .run();
        },
      setParagraphSpacing:
        (marginBottom: string) =>
        ({ chain }) => {
          return chain()
            .updateAttributes("paragraph", { marginBottom })
            .updateAttributes("heading", { marginBottom })
            .updateAttributes("listItem", { marginBottom })
            .run();
        },
    };
  },
});

// Custom Image Extension with width support
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
            style: `width: ${attributes.width}; height: auto;`,
          };
        },
        parseHTML: (element) =>
          element.getAttribute("width") || element.style.width,
      },
    };
  },
});

// Custom FontSize Extension
export const FontSize = Extension.create({
  // ... (existing FontSize code)
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: CommandProps) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: CommandProps) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

export const FONT_FAMILIES = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Sans", value: "sans-serif" },
  { label: "Mono", value: "monospace" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
];

export const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "30px",
  "36px",
  "48px",
  "60px",
  "72px",
];

export const LINE_HEIGHTS = ["1.0", "1.15", "1.2", "1.5", "2.0"];

export const PARAGRAPH_SPACINGS = [
  "0px",
  "8px",
  "16px",
  "24px",
  "32px",
  "48px",
];

export const COMMON_EXTENSIONS = [
  TextStyle,
  FontFamily,
  FontSize,
  Spacing,
  CustomImage.configure({
    inline: true,
    allowBase64: false,
    HTMLAttributes: {
      class: "rounded-lg max-w-full h-auto my-4",
    },
  }),
];
