import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import {
	Navbar,
	NavbarBrand,
	NavbarLink,
	NavbarSpacer,
} from "@/layouts/navbar";
import { Providers } from "@/lib/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "DevRoast",
	description: "Share your code snippets and compete with developers worldwide",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<Navbar>
						<Link href="/" className="flex items-center gap-2 cursor-pointer">
							<span className="text-accent-green font-mono font-bold">
								DevRoast
							</span>
						</Link>
						<NavbarSpacer />
						<NavbarLink href="/leaderboard">Leaderboard</NavbarLink>
					</Navbar>
					{children}
				</Providers>
			</body>
		</html>
	);
}
