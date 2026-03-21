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
				<div style={{ fontSize: 48, color: "#F59E0B" }}>devroast</div>
				<div style={{ fontSize: 120, color: "#F59E0B", fontWeight: "bold" }}>
					5
				</div>
				<div style={{ fontSize: 32, color: "#EF4444" }}>solid work</div>
				<div style={{ fontSize: 16, color: "#4B5563", marginTop: 16 }}>
					lang: {data.language} · {lines} lines
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
			},
		);
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
