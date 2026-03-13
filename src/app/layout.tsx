import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
	Navbar,
	NavbarBrand,
	NavbarLink,
	NavbarSpacer,
} from "@/layouts/navbar";

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
				<Navbar>
					<NavbarBrand>
						<span className="text-accent-green font-mono font-bold">
							DevRoast
						</span>
					</NavbarBrand>
					<NavbarSpacer />
					<NavbarLink href="#leaderboard">Leaderboard</NavbarLink>
				</Navbar>
				{children}
			</body>
		</html>
	);
}
