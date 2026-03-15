import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
	base: "rounded-md border border-border-primary p-5 bg-background",
	variants: {
		variant: {
			default: "",
			analysis: "bg-bg-input",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
	return (
		<div className={twMerge(cardVariants({ variant, className }))} {...props} />
	);
}

export function CardHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={twMerge("flex items-center gap-2 mb-3", className)}
			{...props}
		/>
	);
}

export function CardTitle({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={twMerge("text-sm font-medium text-foreground", className)}
			{...props}
		/>
	);
}

export function CardDescription({
	className,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className={twMerge(
				"text-xs text-text-secondary leading-relaxed",
				className,
			)}
			{...props}
		/>
	);
}
