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
			{/* Window Header - Ray-So Style */}
			<div className="h-8 flex items-center justify-between px-3 bg-[#111111] border-b border-[#2A2A2A]">
				<div className="flex items-center gap-2">
					<div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
					<div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
					<div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
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

			{/* Code Area with Line Numbers */}
			<div className="flex bg-[#282c34] border-x border-[#2A2A2A] h-[180px] overflow-hidden">
				{/* Line Numbers Column */}
				<div className="w-10 bg-[#21252b] border-r border-[#2A2A2A] flex flex-col py-3 px-2 overflow-y-auto">
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
				<div className="flex-1 overflow-y-auto overflow-x-hidden p-3 -mt-[13px]">
					<pre
						className="m-0 p-0 bg-[#282c34] whitespace-pre-wrap word-break-break-all"
						style={{
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							overflowWrap: "break-word",
						}}
					>
						<code
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
							dangerouslySetInnerHTML={{ __html: html }}
							className="hljs text-xs leading-[1.625rem]"
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
