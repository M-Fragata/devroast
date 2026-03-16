import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/components/ui/card";
import { CodeBlock } from "@/app/components/ui/code-block";
import { ScoreRing } from "@/app/components/ui/score-ring";
import { Navbar, NavbarBrand, NavbarLink, NavbarSpacer } from "@/layouts/navbar";
import { RaySoCodeEditor } from "@/app/components/CodeEditor/RaySoCodeEditor";

export default function HomePage() {
	return (
		<div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-mono">

			{/* Main Content */}
			<main className="flex flex-col items-center py-6 md:py-10 px-4 md:px-10 space-y-6 md:space-y-10">
				{/* Hero Section */}
				<div className="flex flex-col items-center gap-2 md:gap-3 text-center max-w-2xl w-full">
					<div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
						<span className="text-[#10B981] text-2xl md:text-4xl font-bold">$</span>
						<h1 className="text-[#FAFAFA] text-xl md:text-4xl font-bold">
							paste your code. get roasted.
						</h1>
					</div>
					<p className="text-[#6B7280] text-sm md:text-base font-normal">
						// drop your code below and we'll rate it — brutally honest or full roast mode
					</p>
				</div>

				{/* Code Editor Window - RESPONSIVE */}
				<RaySoCodeEditor />

				{/* Footer Stats */}
				<div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[#4B5563] text-xs md:text-sm">
					<span>2,847 codes roasted</span>
					<span className="hidden sm:inline">·</span>
					<span>avg score: 4.2/10</span>
				</div>

				{/* Spacer */}
				<div className="h-8 md:h-[60px]" />

				{/* Leaderboard Preview Section - RESPONSIVE */}
				<div className="w-full max-w-[960px] space-y-4 px-0 md:px-0">
					{/* Title Row */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 md:px-0">
						<div className="flex items-center gap-2">
							<span className="text-[#10B981] font-bold">//</span>
							<span className="text-[#FAFAFA] font-bold">shame_leaderboard</span>
						</div>
						<div className="flex items-center gap-1 px-3 py-1 border border-[#2A2A2A]">
							<span className="text-[#6B7280] text-xs">$ view_all {'>'}</span>
						</div>
					</div>
					<p className="text-[#4B5563] text-xs md:text-sm px-4 md:px-0">
						// the worst code on the internet, ranked by shame
					</p>

					{/* Table - Scrollable on mobile */}
					<div className="border border-[#2A2A2A] overflow-x-auto">
						{/* Table Header */}
						<div className="h-10 flex items-center px-4 md:px-5 bg-[#0F0F0F] border-b border-[#2A2A2A] min-w-[500px]">
							<div className="w-10 md:w-[50px] text-[#4B5563] text-xs font-medium">#</div>
							<div className="w-12 md:w-[70px] text-[#4B5563] text-xs font-medium">score</div>
							<div className="flex-1 text-[#4B5563] text-xs font-medium">code</div>
							<div className="w-16 md:w-[100px] text-[#4B5563] text-xs font-medium">lang</div>
						</div>

						{/* Row 1 */}
						<div className="flex items-center px-4 md:px-5 py-3 md:py-4 border-b border-[#2A2A2A] min-w-[500px]">
							<div className="w-10 md:w-[50px] text-[#F59E0B] text-xs">1</div>
							<div className="w-12 md:w-[70px] text-[#EF4444] text-xs font-bold">1.2</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="text-[#FAFAFA] text-xs">eval(prompt("enter code"))</span>
								<span className="text-[#FAFAFA] text-xs">document.write(response)</span>
								<span className="text-[#8B8B8B] text-xs">// trust the user lol</span>
							</div>
							<div className="w-16 md:w-[100px] text-[#6B7280] text-xs">javascript</div>
						</div>

						{/* Row 2 */}
						<div className="flex items-center px-4 md:px-5 py-3 md:py-4 border-b border-[#2A2A2A] min-w-[500px]">
							<div className="w-10 md:w-[50px] text-[#6B7280] text-xs">2</div>
							<div className="w-12 md:w-[70px] text-[#EF4444] text-xs font-bold">1.8</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="text-[#FAFAFA] text-xs">if (x == true) {'{'} return true; {'}'}</span>
								<span className="text-[#FAFAFA] text-xs">else if (x == false) {'{'} return false; {'}'}</span>
								<span className="text-[#FAFAFA] text-xs">else {'{'} return !false; {'}'}</span>
							</div>
							<div className="w-16 md:w-[100px] text-[#6B7280] text-xs">typescript</div>
						</div>

						{/* Row 3 */}
						<div className="flex items-center px-4 md:px-5 py-3 md:py-4 min-w-[500px]">
							<div className="w-10 md:w-[50px] text-[#6B7280] text-xs">3</div>
							<div className="w-12 md:w-[70px] text-[#EF4444] text-xs font-bold">2.1</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="text-[#FAFAFA] text-xs">SELECT * FROM users WHERE 1=1</span>
								<span className="text-[#8B8B8B] text-xs">-- TODO: add authentication</span>
							</div>
							<div className="w-16 md:w-[100px] text-[#6B7280] text-xs">sql</div>
						</div>
					</div>

					{/* Fade Hint */}
					<div className="text-center py-3 md:py-4 text-[#4B5563] text-xs md:text-sm px-4">
						showing top 3 of 2,847 · view full leaderboard {'>'}
					</div>
				</div>
			</main>
		</div>
	);
}
