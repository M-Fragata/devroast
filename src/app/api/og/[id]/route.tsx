import { ImageResponse } from "@takumi-rs/image-response";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { roasts, snippets } from "@/db/schema";

interface OGImageProps {
	params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: OGImageProps) {
	try {
		const { id } = await params;
		const roastId = parseInt(id);

		const roastData = await db
			.select({
				id: roasts.id,
				content: roasts.content,
				analysisJson: roasts.analysisJson,
				code: snippets.content,
				language: snippets.language,
			})
			.from(roasts)
			.innerJoin(snippets, eq(roasts.snippetId, snippets.id))
			.where(eq(roasts.id, roastId));

		if (!roastData[0]) {
			return new NextResponse("Roast not found", { status: 404 });
		}

		const data = roastData[0];
		const lines = data.code.split("\n").length;

		let score = 5;
		let verdict = "solid work";
		let roastText = data.content || "";

		try {
			if (data.analysisJson) {
				const parsed = JSON.parse(data.analysisJson);
				if (parsed.score !== undefined) {
					score = parsed.score;
				}
				if (parsed.verdict) {
					verdict = parsed.verdict.replace(/_/g, " ");
				}
				if (parsed.roast) {
					roastText = parsed.roast;
				}
			}
		} catch {
			// Use defaults
		}

		const scoreDisplay = score % 1 === 0 ? score.toString() : score.toFixed(1);

		return new ImageResponse(
			<div
				style={{
					width: 1200,
					height: 630,
					background: "#0C0C0C",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: "sans-serif",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span style={{ color: "#22C55E", fontSize: 24, fontWeight: "bold" }}>
						&gt;
					</span>
					<span style={{ color: "#FAFAFA", fontSize: 20 }}>devroast</span>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "flex-end",
						gap: 4,
						marginTop: 16,
					}}
				>
					<span style={{ color: "#F59E0B", fontSize: 160, fontWeight: "bold" }}>
						{scoreDisplay}
					</span>
					<span style={{ color: "#4B5563", fontSize: 56, marginBottom: 12 }}>
						/10
					</span>
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 8,
						marginTop: 16,
					}}
				>
					<div
						style={{
							width: 12,
							height: 12,
							borderRadius: "50%",
							background: "#EF4444",
						}}
					/>
					<span style={{ color: "#EF4444", fontSize: 20 }}>{verdict}</span>
				</div>
				<div style={{ color: "#4B5563", fontSize: 16, marginTop: 16 }}>
					lang: {data.language} · {lines} lines
				</div>
				<div
					style={{
						marginTop: 24,
						paddingLeft: 64,
						paddingRight: 64,
						maxWidth: 1072,
						maxHeight: 180,
						overflow: "hidden",
						color: "#FAFAFA",
						fontSize: 22,
						textAlign: "center",
					}}
				>
					{`"${roastText}"`}
				</div>
			</div>,
			{ width: 1200, height: 630 },
		);
	} catch (error) {
		console.error("Error generating OG image:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
