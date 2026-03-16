import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

interface CodeBlockProps {
	code: string;
	language: string;
	className?: string;
}

export async function CodeBlock({ code, language, className }: CodeBlockProps) {
	const html = await codeToHtml(code, {
		lang: language,
		theme: "vesper",
	});

	// Count lines for line numbers
	const lines = code.split("\n");
	const lineCount = lines.length;

	return (
		<div
			className={twMerge(
				"border border-border-primary bg-bg-input overflow-hidden",
				className,
			)}
		>
			{/* Code Area with Line Numbers - No Header */}
			<div className="flex bg-bg-input h-[180px] overflow-hidden">
				{/* Line Numbers Column */}
				<div className="w-12 bg-bg-surface border-r border-border-primary flex flex-col py-3 px-2 overflow-y-auto">
					{Array.from({ length: lineCount }, (_, i) => (
						<span
							key={i}
							className="text-text-tertiary font-mono text-xs leading-[1.625rem] text-right"
						>
							{i + 1}
						</span>
					))}
				</div>

				{/* Code Content */}
				<div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
					<pre
						className="m-0 p-0 bg-bg-input whitespace-pre-wrap word-break-break-all"
						style={{
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							overflowWrap: "break-word",
						}}
					>
						<code
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
							dangerouslySetInnerHTML={{ __html: html }}
							className="text-xs leading-[1.625rem]"
							style={{
								color: "#abb2bf",
								whiteSpace: "pre-wrap",
								wordBreak: "break-word",
								overflowWrap: "break-word",
							}}
						/>
					</pre>
				</div>
			</div>
		</div>
	);
}
