"use client";

import hljs from "highlight.js";
import parse from "html-react-parser";
import { useMemo, useState } from "react";

interface CollapsibleCodeBlockProps {
	code: string;
	language?: string;
	maxLines?: number;
	className?: string;
}

export function CollapsibleCodeBlock({
	code,
	language,
	maxLines = 5,
	className = "",
}: CollapsibleCodeBlockProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const highlightedCode = useMemo(() => {
		if (!code) return "";
		try {
			const lang =
				language && language !== "plaintext" ? language : "plaintext";
			const result = hljs.highlight(code, { language: lang });
			return result.value;
		} catch {
			return code;
		}
	}, [code, language]);

	const lines = code.split("\n");

	return (
		<div className={className}>
			<div
				className="overflow-hidden"
				style={{
					maxHeight: isExpanded ? "none" : `${maxLines * 1.625 + 1}rem`,
				}}
			>
				<div className="flex">
					<div className="w-10 border-r border-border-primary shrink-0 py-3 pl-2 pr-2">
						{lines.map((_, i) => (
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
							className="m-0 p-0 bg-transparent"
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
			</div>

			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full py-2 text-xs text-accent-green hover:text-accent-green-hover cursor-pointer border-x border-b border-border-primary bg-bg-surface"
			>
				{isExpanded ? "ver menos ↑" : "ver mais ↓"}
			</button>
		</div>
	);
}
