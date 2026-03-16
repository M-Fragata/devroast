export type Language =
	| "javascript"
	| "typescript"
	| "python"
	| "html"
	| "css"
	| "json"
	| "sql"
	| "markdown"
	| "bash"
	| "plaintext";

export function detectLanguage(code: string): Language {
	const trimmedCode = code.trim();

	if (!trimmedCode) return "plaintext";

	// 1. JSON Detection (strictest)
	if (
		(trimmedCode.startsWith("{") && trimmedCode.endsWith("}")) ||
		(trimmedCode.startsWith("[") && trimmedCode.endsWith("]"))
	) {
		try {
			JSON.parse(trimmedCode);
			return "json";
		} catch {
			// Not valid JSON, continue
		}
	}

	// 2. HTML Detection
	if (
		trimmedCode.toLowerCase().includes("<!DOCTYPE html") ||
		trimmedCode.toLowerCase().includes("<html") ||
		trimmedCode.includes("<?xml") ||
		/<[a-z][\s\S]*>/i.test(trimmedCode)
	) {
		return "html";
	}

	// 3. SQL Detection (check early to avoid JS false positives)
	if (
		/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|FROM|WHERE|JOIN|GROUP BY|ORDER BY|WITH)/i.test(
			trimmedCode
		)
	) {
		return "sql";
	}

	// 4. Python Detection
	// Look for Python-specific keywords and indentation patterns
	if (
		/^\s*(def|class|import|from|if|elif|else|for|while|try|except|with|async|await)\s/m.test(
			trimmedCode
		) ||
		/:\s*$/.test(trimmedCode.split('\n')[0]) || // Lines ending with colon
		trimmedCode.includes("print(")
	) {
		// Double check it's not TypeScript (which uses colons for types)
		if (!trimmedCode.includes(": ") && !trimmedCode.includes("function ")) {
			return "python";
		}
	}

	// 5. TypeScript / JavaScript Detection
	// Check for imports/exports (ES Modules)
	const hasImports = /(^|\n)(import|from)\s+['"].*['"]/.test(trimmedCode);
	const hasExports = /(^|\n)export\s+(const|let|var|function|class|default)/.test(trimmedCode);
	
	// Detect TypeScript specific features (type annotations, interfaces, etc.)
	const hasTypeAnnotations = /:\s*(string|number|boolean|any|void|React\.)|interface\s+\w+|type\s+\w+/.test(trimmedCode);
	const hasTypeScriptSyntax = /\b(const|let|var)\s+\w+:\s+\w+/.test(trimmedCode);

	// If it has import/export, it's definitely a module (JS or TS)
	if (hasImports || hasExports) {
		// Prioritize TypeScript if it has TS-specific syntax
		if (hasTypeAnnotations || hasTypeScriptSyntax || trimmedCode.includes("interface ") || trimmedCode.includes("type ")) {
			return "typescript";
		}
		// Default to TypeScript for modern ES modules (safer bet for highlighting)
		return "typescript";
	}

	// 6. Fallback generic checks
	if (trimmedCode.includes("function ") || trimmedCode.includes("const ") || trimmedCode.includes("let ")) {
		return "javascript";
	}

	// 7. CSS Detection
	if (
		/^[a-z.#\s\[\]=\-:]+{[\s\S]*}/m.test(trimmedCode) &&
		!trimmedCode.includes("function")
	) {
		return "css";
	}

	// 8. Markdown Detection
	if (
		(trimmedCode.startsWith("#") && trimmedCode.includes("\n")) ||
		/^\s*[-*]\s+/m.test(trimmedCode) ||
		trimmedCode.includes("**")
	) {
		return "markdown";
	}

	// 9. Bash Detection
	if (trimmedCode.startsWith("#!") || trimmedCode.startsWith("$ ")) {
		return "bash";
	}

	return "plaintext";
}
