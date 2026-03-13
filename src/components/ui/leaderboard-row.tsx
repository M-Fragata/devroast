import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const rowVariants = tv({
	base: "flex items-center gap-6 px-5 py-4 border-b border-border-primary",
});

export interface LeaderboardRowProps
	extends React.HTMLAttributes<HTMLDivElement> {
	rank: number;
	score: number;
	code: string;
	language: string;
}

export function LeaderboardRow({
	rank,
	score,
	code,
	language,
	className,
	...props
}: LeaderboardRowProps) {
	return (
		<div className={twMerge(rowVariants(), className)} {...props}>
			<div className="w-10 text-center font-mono text-sm text-muted-foreground">
				{rank}
			</div>
			<div className="w-16 text-center font-mono text-sm text-accent-green">
				{score}
			</div>
			<div className="flex-1 font-mono text-sm text-foreground truncate">
				{code}
			</div>
			<div className="w-24 text-center font-mono text-xs text-text-tertiary">
				{language}
			</div>
		</div>
	);
}
