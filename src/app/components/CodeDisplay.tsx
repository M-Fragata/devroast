"use client";

import hljs from "highlight.js";
import parse from "html-react-parser";
import { useEffect, useRef, useState } from "react";
import "./CodeDisplay.css";

interface CodeDisplayProps {
	code: string;
	language: string;
	maxLines?: number;
	className?: string;
}

export function CodeDisplay({
	code,
	language,
	maxLines = 3,
	className = "",
}: CodeDisplayProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isTruncated, setIsTruncated] = useState(false);
	const codeRef = useRef<HTMLDivElement>(null);

	// Highlight code
	const highlightedCode = (() => {
		if (!code) return "";

		try {
			const result = hljs.highlight(code, {
				language: language === "plaintext" ? "plaintext" : language,
			});
			return result.value;
		} catch (error) {
			console.error("Failed to highlight code:", error);
			const div = document.createElement("div");
			div.textContent = code;
			return div.innerHTML;
		}
	})();

	// Check if the code needs to be truncated
	useEffect(() => {
		if (codeRef.current) {
			const lineHeight = 20; // Approximate line height
			const maxHeight = maxLines * lineHeight;
			const actualHeight = codeRef.current.scrollHeight;
			setIsTruncated(actualHeight > maxHeight);
		}
	}, [highlightedCode, maxLines]);

	const lines = code.split("\n");
	const shouldShowExpand = lines.length > maxLines || isTruncated;

	return (
		<div className={`code-display-container ${className}`}>
			<div
				ref={codeRef}
				className={`code-display-content ${isExpanded ? "expanded" : "truncated"}`}
				style={{ maxHeight: isExpanded ? "none" : `${maxLines * 1.5}em` }}
			>
				<pre className="m-0 p-0 bg-transparent whitespace-pre-wrap word-break-break-all">
					<code
						className="hljs"
						style={{
							color: "#e6e6e6",
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							overflowWrap: "break-word",
						}}
					>
						{parse(highlightedCode)}
					</code>
				</pre>
			</div>
			{shouldShowExpand && (
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="text-xs text-accent-green hover:text-accent-green-hover mt-1 cursor-pointer"
				>
					{isExpanded ? "ver menos ↑" : "ver mais ↓"}
				</button>
			)}
		</div>
	);
}
