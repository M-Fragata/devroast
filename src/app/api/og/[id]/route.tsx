import { ImageResponse } from "@takumi-rs/image-response";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { roasts, snippets } from "@/db/schema";
import type { RoastAnalysis } from "@/lib/gemini";

interface OGImageProps {
	params: Promise<{ id: string }>;
}

function formatVerdict(verdict: string): string {
	switch (verdict) {
		case "exceptional":
			return "exceptional";
		case "needs_serious_help":
			return "needs serious help";
		case "rough_around_edges":
			return "rough around edges";
		case "decent_code":
			return "decent code";
		case "solid_work":
			return "solid work";
		default:
			return verdict.replace(/_/g, " ");
	}
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

		let analysis: RoastAnalysis = {
			score: 5,
			verdict: "solid_work",
			roast: "",
			issues: [],
			diff: [],
		};

		try {
			const parsed = JSON.parse(data.analysisJson || "{}");
			if (parsed.score !== undefined) {
				analysis = parsed as RoastAnalysis;
			}
		} catch {
			console.warn("Failed to parse analysisJson for roast:", roastId);
		}

		const lines = data.code.split("\n").length;
		const scoreDisplay =
			analysis.score % 1 === 0
				? analysis.score.toString()
				: analysis.score.toFixed(1);
		const verdictDisplay = formatVerdict(analysis.verdict);
		const roastText = analysis.roast || data.content || "";

		const response = new ImageResponse(
			<div
				style={{
					width: "1200px",
					height: "630px",
					background: "#0C0C0C",
					border: "1px solid #2A2A2A",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "16px",
					padding: "0",
					fontFamily: "JetBrains Mono, monospace",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: "8px",
					}}
				>
					<span
						style={{
							color: "#22C55E",
							fontSize: "24px",
							fontWeight: "700",
							lineHeight: "1",
						}}
					>
						{">"}
					</span>
					<span
						style={{
							color: "#FAFAFA",
							fontSize: "20px",
							fontWeight: "400",
							lineHeight: "1",
							marginLeft: "8px",
						}}
					>
						devroast
					</span>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "flex-end",
						gap: "4px",
					}}
				>
					<span
						style={{
							color: "#F59E0B",
							fontSize: "160px",
							fontWeight: "700",
							lineHeight: "1",
						}}
					>
						{scoreDisplay}
					</span>
					<span
						style={{
							color: "#4B5563",
							fontSize: "56px",
							fontWeight: "400",
							lineHeight: "1",
							marginBottom: "12px",
						}}
					>
						/10
					</span>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: "8px",
					}}
				>
					<div
						style={{
							width: "12px",
							height: "12px",
							borderRadius: "50%",
							background: "#EF4444",
						}}
					/>
					<span
						style={{
							color: "#EF4444",
							fontSize: "20px",
							fontWeight: "400",
							lineHeight: "1",
						}}
					>
						{verdictDisplay}
					</span>
				</div>

				<div
					style={{
						color: "#4B5563",
						fontSize: "16px",
						fontWeight: "400",
						lineHeight: "1",
					}}
				>
					{"lang: "}
					{data.language}
					{" · "}
					{lines}
					{" lines"}
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						marginTop: "24px",
						paddingLeft: "64px",
						paddingRight: "64px",
						maxWidth: "1072px",
					}}
				>
					<span
						style={{
							color: "#FAFAFA",
							fontSize: "22px",
							fontWeight: "400",
							lineHeight: "1.4",
							fontFamily: "IBM Plex Mono, monospace",
							textAlign: "center",
							wordWrap: "break-word",
							display: "-webkit-box",
							WebkitLineClamp: 5,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{`"${roastText}"`}
					</span>
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);

		response.headers.set("Content-Type", "image/png");
		return response;
	} catch (error) {
		console.error("Error generating OG image:", error);
		return new NextResponse("Error generating image", { status: 500 });
	}
}
