"use client";

import hljs from "highlight.js";
import parse from "html-react-parser";
import { useMemo, useState } from "react";
import { detectLanguage } from "../CodeEditor/language-detection";
import "highlight.js/styles/atom-one-dark.css";

interface ShameCodeRowProps {
	rank: number;
	score: number;
	code: string;
	language: string;
	lines?: number;
}

export function ShameCodeRow({
	rank,
	score,
	code,
	language,
	lines,
}: ShameCodeRowProps) {
	const getScoreColor = (score: number) => {
		if (score <= 3) return "text-green-accent";
		if (score <= 5) return "text-yellow-accent";
		if (score <= 7) return "text-orange-accent";
		return "text-red-accent";
	};

	const [isExpanded, setIsExpanded] = useState(false);

	const highlightedCode = useMemo(() => {
		if (!code) return "";
		const detectedLanguage =
			language && language !== "plaintext" ? language : detectLanguage(code);
		try {
			const result = hljs.highlight(code, {
				language:
					detectedLanguage === "plaintext" ? "plaintext" : detectedLanguage,
			});
			return result.value;
		} catch {
			return code;
		}
	}, [code, language]);

	const codeLines = code.split("\n");
	const lineCount = lines || codeLines.length;

	return (
		<div className="border border-border-primary bg-bg-surface">
			<div className="h-10 flex items-center justify-between px-4 bg-bg-surface border-b border-border-primary">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-text-tertiary font-mono text-xs">#</span>
						<span className="text-accent-amber font-mono text-xs font-bold">
							{rank}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="text-text-tertiary font-mono text-xs">score</span>
						<span
							className={`${getScoreColor(score)} font-mono text-xs font-bold`}
						>
							{score}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-text-secondary font-mono text-xs">
						{language}
					</span>
					<span className="text-text-tertiary font-mono text-xs">
						{lineCount} lines
					</span>
				</div>
			</div>

			<div
				className="flex overflow-auto"
				style={{ maxHeight: isExpanded ? "none" : "8.125rem" }}
			>
				<div className="w-10 bg-bg-surface border-r border-border-primary shrink-0 py-3 px-2">
					{codeLines.map((_, i) => (
						<div
							key={i}
							className="h-[1.625rem] text-text-tertiary font-mono text-xs text-right leading-[1.625rem]"
						>
							{i + 1}
						</div>
					))}
				</div>

				<div className="flex-1 min-w-0 p-3">
					<pre
						className="m-0 p-0 bg-transparent overflow-x-auto"
						style={{
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							overflowWrap: "break-word",
						}}
					>
						<code
							className="hljs text-xs leading-[1.625rem]"
							style={{
								whiteSpace: "pre-wrap",
								wordBreak: "break-word",
								overflowWrap: "break-word",
							}}
						>
							{parse(highlightedCode || code)}
						</code>
					</pre>
				</div>
			</div>

			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full py-2 text-xs text-accent-green hover:text-accent-green-hover cursor-pointer border-t border-border-primary bg-bg-surface"
			>
				{isExpanded ? "ver menos ↑" : "ver mais ↓"}
			</button>
		</div>
	);
}
