import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const navbarVariants = tv({
	base: "flex items-center justify-between h-14 px-6 border-b border-border-primary bg-bg-page",
});

export function Navbar({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <nav className={twMerge(navbarVariants(), className)} {...props} />;
}

export function NavbarBrand({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={twMerge("flex items-center gap-2", className)} {...props} />
	);
}

export function NavbarSpacer({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={twMerge("flex-1", className)} {...props} />;
}

export function NavbarLink({
	className,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<a
			className={twMerge(
				"text-sm text-text-secondary hover:text-foreground transition-colors",
				className,
			)}
			{...props}
		/>
	);
}
