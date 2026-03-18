import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface RoastAnalysis {
	score: number;
	verdict: string;
	roast: string;
	issues: Array<{
		title: string;
		description: string;
		status: string;
	}>;
	diff: Array<{
		type: "add" | "remove" | "context";
		content: string;
	}>;
}

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

	const result = await model.generateContent(userPrompt);
	const response = result.response.text();

	const jsonMatch = response.match(/\{[\s\S]*\}/);
	if (!jsonMatch) {
		throw new Error("Invalid response from Gemini");
	}

	return JSON.parse(jsonMatch[0]) as RoastAnalysis;
}
