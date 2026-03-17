"use client";

import hljs from "highlight.js";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { tv } from "tailwind-variants";
import { detectLanguage } from "../CodeEditor/language-detection";

// Import highlight.js theme (Atom One Dark)
import "highlight.js/styles/atom-one-dark.css";

const entryVariants = tv({
	base: "border border-border-primary bg-bg-surface",
});

export interface LeaderboardRowProps {
	rank: number;
	score: number;
	code: string;
	language: string;
	lines?: number;
}

export function LeaderboardRow({
	rank,
	score,
	code,
	language,
	lines,
}: LeaderboardRowProps) {
	// Determine score color based on 0-10 scale
	const getScoreColor = (score: number) => {
		if (score <= 3) return "text-green-accent";
		if (score <= 5) return "text-yellow-accent";
		if (score <= 7) return "text-orange-accent";
		return "text-red-accent";
	};

	// Highlight code using highlight.js
	const [highlightedCode, setHighlightedCode] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (!code) {
			setHighlightedCode("");
			return;
		}

		// Detect language if not specified
		const detectedLanguage =
			language && language !== "plaintext" ? language : detectLanguage(code);

		// Use a function to set the highlighted code to avoid calling setState directly
		const updateHighlightedCode = () => {
			try {
				const result = hljs.highlight(code, {
					language:
						detectedLanguage === "plaintext" ? "plaintext" : detectedLanguage,
				});
				return result.value;
			} catch (error) {
				console.error("Failed to highlight code:", error);
				// Fallback: just escape the code
				const div = document.createElement("div");
				div.textContent = code;
				return div.innerHTML;
			}
		};

		// This is necessary to update the highlighted code when code/language changes
		setHighlightedCode(updateHighlightedCode());
	}, [code, language]);

	// Parse code to get lines for enumeration
	const codeLines = code.split("\n");
	const lineCount = lines || codeLines.length;

	return (
		<div className={entryVariants()}>
			{/* Header Bar */}
			<div className="h-10 flex items-center justify-between px-4 bg-[#111111] border-b border-[#2A2A2A]">
				<div className="flex items-center gap-4">
					{/* Rank and Score side by side on the left */}
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
					{/* Language and lines */}
					<span className="text-text-secondary font-mono text-xs">
						{language}
					</span>
					<span className="text-text-tertiary font-mono text-xs">
						{lineCount} lines
					</span>
				</div>
			</div>

			{/* Code Area with line numbers */}
			<div
				className={`flex bg-[#282c34] border-x border-[#2A2A2A] ${isExpanded ? "h-auto" : "h-[60px]"} overflow-hidden`}
			>
				{/* Line Numbers Column */}
				<div className="w-10 bg-[#21252b] border-r border-[#2A2A2A] flex flex-col py-3 px-2">
					{Array.from({ length: lineCount }, (_, i) => (
						<span
							key={i}
							className="text-[#4B5563] font-mono text-xs leading-[1.625rem] text-right"
						>
							{i + 1}
						</span>
					))}
				</div>

				{/* Code Content */}
				<div className="flex-1 overflow-hidden p-3 -mt-[13px]">
					<pre
						className="m-0 p-0 bg-[#282c34] whitespace-pre-wrap word-break-break-all"
						style={{
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							overflowWrap: "break-word",
						}}
					>
						<code
							className="hljs text-xs leading-[1.625rem]"
							style={{
								color: "#abb2bf",
								whiteSpace: "pre-wrap",
								wordBreak: "break-word",
								overflowWrap: "break-word",
							}}
						>
							{parse(highlightedCode)}
						</code>
					</pre>
				</div>
			</div>

			{/* Expand/Collapse Button */}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full py-2 text-xs text-accent-green hover:text-accent-green-hover cursor-pointer border-t border-[#2A2A2A] bg-[#111111]"
			>
				{isExpanded ? "ver menos ↑" : "ver mais ↓"}
			</button>
		</div>
	);
}
