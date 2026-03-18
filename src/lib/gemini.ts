import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey.trim() === "") {
	throw new Error("GEMINI_API_KEY environment variable is not set or is empty");
}

const genAI = new GoogleGenerativeAI(apiKey);

const roastAnalysisSchema = z.object({
	score: z.number().min(0).max(10),
	verdict: z.enum([
		"exceptional",
		"needs_serious_help",
		"rough_around_edges",
		"decent_code",
		"solid_work",
	]),
	roast: z.string(),
	issues: z.array(
		z.object({
			title: z.string(),
			description: z.string(),
			status: z.enum(["critical", "warning", "good"]),
		}),
	),
	diff: z.array(
		z.object({
			type: z.enum(["add", "remove", "context"]),
			content: z.string(),
		}),
	),
});

export type RoastAnalysis = z.infer<typeof roastAnalysisSchema>;

export async function generateRoast(
	code: string,
	language: string,
	mood: "serious" | "roast",
): Promise<RoastAnalysis> {
	const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

	const systemPrompt =
		mood === "roast"
			? `You are a sarcastic code reviewer called "DevRoast". 
         Roast the code brutally but accurately.
         Always respond with valid JSON.`
			: `You are a professional code reviewer.
         Provide constructive feedback.
         Always respond with valid JSON.`;

	const userPrompt = `
${systemPrompt}

Analyze this ${language} code and return ONLY valid JSON (no markdown, no explanation):

{
  "score": 0-10,
  "verdict": "exceptional" | "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work",
  "roast": "your commentary",
  "issues": [
    {"title": "issue name", "description": "details", "status": "critical" | "warning" | "good"}
  ],
  "diff": [
    {"type": "add" | "remove" | "context", "content": "code line"}
  ]
}

Code:
${code}
`;

	try {
		const result = await model.generateContent(userPrompt);
		const response = result.response.text();

		const jsonMatch = response.match(/\{[\s\S]*?\}/);
		if (!jsonMatch) {
			throw new Error("Invalid response from Gemini: no JSON found");
		}

		const parsed = JSON.parse(jsonMatch[0]) as unknown;
		const validated = roastAnalysisSchema.parse(parsed);

		return validated;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(
				`Invalid response structure from Gemini: ${error.issues.map((e: z.ZodIssue) => e.message).join(", ")}`,
			);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Unknown error occurred while generating roast");
	}
}
