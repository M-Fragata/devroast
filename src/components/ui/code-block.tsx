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

	return (
		<div
			className={twMerge(
				"rounded-md border border-border-primary bg-bg-input overflow-hidden",
				className,
			)}
		>
			<div className="flex items-center gap-2 px-4 py-2 border-b border-border-primary">
				<span className="text-xs text-muted-foreground">{language}</span>
			</div>
			<div
				className="p-4 overflow-x-auto text-sm"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
