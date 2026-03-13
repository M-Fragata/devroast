import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
	base: "flex w-full items-center gap-4 px-4 py-2 font-mono text-sm",
	variants: {
		type: {
			removed: "bg-diff-removed text-red-300",
			added: "bg-diff-added text-green-300",
			context: "bg-transparent text-foreground",
		},
	},
	defaultVariants: {
		type: "context",
	},
});

export interface DiffLineProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof diffLineVariants> {
	lineNumbers?: {
		old?: number;
		new?: number;
	};
	prefix?: string;
}

export function DiffLine({
	className,
	type,
	lineNumbers,
	prefix,
	children,
	...props
}: DiffLineProps) {
	return (
		<div className={twMerge(diffLineVariants({ type, className }))} {...props}>
			<span className="w-8 text-right text-xs text-muted-foreground select-none">
				{lineNumbers?.old ?? ""}
			</span>
			<span className="w-8 text-right text-xs text-muted-foreground select-none">
				{lineNumbers?.new ?? ""}
			</span>
			<span className="text-xs text-muted-foreground select-none">
				{prefix}
			</span>
			<span className="flex-1">{children}</span>
		</div>
	);
}
