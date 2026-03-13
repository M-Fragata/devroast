import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const inputVariants = tv({
	base: "flex h-10 w-full rounded-md border border-border-primary bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
	return <input className={twMerge(inputVariants(), className)} {...props} />;
}
