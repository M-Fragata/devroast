"use client";

import { Button } from "@/app/components/ui/button";

interface ShareButtonProps {
	id: string;
}

export function ShareButton({ id }: ShareButtonProps) {
	const ogImageUrl = `http://localhost:3000/api/og/${id}`;

	const handleShare = async () => {
		try {
			await navigator.clipboard.writeText(ogImageUrl);
		} catch {
			console.error("Failed to copy URL");
		}
	};

	return (
		<Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<circle cx="18" cy="5" r="3" />
				<circle cx="6" cy="12" r="3" />
				<circle cx="18" cy="19" r="3" />
				<line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
				<line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
			</svg>
			Share
		</Button>
	);
}
