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

	const lines = code.split("\n");
	const lineCount = lines.length;

	return (
		<div
			className={twMerge(
				"border border-border-primary bg-bg-input overflow-hidden",
				className,
			)}
		>
			<div
				className="flex bg-bg-input overflow-auto"
				style={{ maxHeight: "52rem" }}
			>
				<div className="w-12 bg-bg-surface border-r border-border-primary shrink-0 py-3 px-2">
					{Array.from({ length: lineCount }, (_, i) => (
						<div
							key={i}
							className="h-[1.625rem] text-text-tertiary font-mono text-xs text-right leading-[1.625rem]"
						>
							{i + 1}
						</div>
					))}
				</div>

				<div className="flex-1 min-w-0 p-4">
					<pre
						className="m-0 p-0 bg-bg-input overflow-x-auto"
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
