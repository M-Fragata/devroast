import type { Root } from "hast";
import { toHtml } from "hast-util-to-html";
import type { Highlighter } from "shiki";

export async function codeToHtmlInline(
	code: string,
	language: string,
	theme: string,
	highlighter: Highlighter,
): Promise<string> {
	// Convert code to HAST (HyperScript Abstract Syntax Tree)
	const hast = await highlighter.codeToHast(code, {
		lang: language,
		theme: theme,
	});

	// Process the HAST tree to add inline styles
	const styledHast = addInlineStyles(hast);

	// Convert HAST to HTML
	const html = toHtml(styledHast);

	return html;
}

function addInlineStyles(hast: Root): Root {
	// One Dark Pro theme colors
	const themeColors = {
		background: "#282c34",
		foreground: "#abb2bf",
		colors: {
			comment: "#5c6370",
			punctuation: "#abb2bf",
			property: "#e06c75",
			string: "#98c379",
			number: "#d19a66",
			keyword: "#c678dd",
			function: "#61afef",
			"class-name": "#e5c07b",
			operator: "#56b6c2",
			tag: "#e06c75",
			"attr-name": "#d19a66",
			"attr-value": "#98c379",
			regex: "#98c379",
			variable: "#e06c75",
			constant: "#d19a66",
			parameter: "#e06c75",
			entity: "#61afef",
			heading: "#61afef",
			important: "#e06c75",
		},
	};

	// Process the HAST tree recursively
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function processNode(node: any): any {
		if (node.type === "element") {
			// If this is the pre tag, add background and base color
			if (node.tagName === "pre") {
				if (!node.properties.style) {
					node.properties.style = "";
				}
				node.properties.style += `background-color: ${themeColors.background} !important; color: ${themeColors.foreground} !important; margin: 0; padding: 1rem; font-family: monospace; white-space: pre-wrap; word-wrap: break-word;`;
			}

			// Check if this element has a class that matches a token type
			if (node.properties && node.properties.className) {
				const classes = node.properties.className;
				let color: string | undefined;

				// Find the first class that matches a token type
				if (Array.isArray(classes)) {
					for (const cls of classes) {
						if (typeof cls === "string" && cls in themeColors.colors) {
							color =
								themeColors.colors[cls as keyof typeof themeColors.colors];
							break;
						}
					}
				}

				if (color) {
					// Add inline style for color
					if (!node.properties.style) {
						node.properties.style = "";
					}
					node.properties.style += `color: ${color} !important;`;
				}
			}

			// Process children
			if (node.children) {
				node.children = node.children.map(processNode);
			}
		} else if (node.type === "text") {
			// Text nodes don't need processing
			return node;
		}

		return node;
	}

	// Process the root node
	if (hast.children) {
		hast.children = hast.children.map(processNode);
	}

	return hast;
}
