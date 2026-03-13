"use client";

import { Switch } from "@base-ui/react/switch";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const toggleVariants = tv({
	base: "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
	variants: {
		variant: {
			default: "bg-input",
			checked: "bg-accent-green",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const toggleThumbVariants = tv({
	base: "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
	variants: {
		variant: {
			default: "translate-x-0",
			checked: "translate-x-5",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface ToggleProps
	extends React.ComponentProps<typeof Switch.Root>,
		VariantProps<typeof toggleVariants> {
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
}

export function Toggle({
	className,
	checked,
	onCheckedChange,
	...props
}: ToggleProps) {
	const variantClasses = toggleVariants({
		class: (className as string) ?? "",
	}) as string;
	const toggleClass = twMerge(variantClasses);
	return (
		<Switch.Root
			checked={checked}
			onCheckedChange={onCheckedChange}
			className={toggleClass}
			{...props}
		>
			<Switch.Thumb className={twMerge(toggleThumbVariants())} />
		</Switch.Root>
	);
}
