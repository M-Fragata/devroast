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

export default async function ComponentsPage() {
	const exampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`;

	return (
		<div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] font-mono">
			{/* Main Content */}
			<main className="flex flex-col items-center py-10 px-10 space-y-10">
				{/* Hero Section */}
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex items-center gap-3">
						<span className="text-[#10B981] text-4xl font-bold">$</span>
						<h1 className="text-[#FAFAFA] text-4xl font-bold">
							paste your code. get roasted.
						</h1>
					</div>
					<p className="text-[#6B7280] text-base font-normal">
						// drop your code below and we'll rate it — brutally honest or full roast mode
					</p>
				</div>

				{/* Code Editor Window */}
				<div className="w-[780px]">
					{/* Window Header */}
					<div className="h-[40px] flex items-center px-4 bg-[#111111] border-b border-[#2A2A2A]">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-[#EF4444]" />
							<div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
							<div className="w-3 h-3 rounded-full bg-[#10B981]" />
						</div>
					</div>

					{/* Code Content */}
					<div className="flex bg-[#111111] border border-[#2A2A2A] border-t-0 h-[360px] overflow-hidden">
						{/* Line Numbers */}
						<div className="w-[48px] flex flex-col gap-2 py-4 px-3 bg-[#0F0F0F] border-r border-[#2A2A2A]">
							{[...Array(16)].map((_, i) => (
								<span key={i} className="text-[#4B5563] text-xs text-right">
									{i + 1}
								</span>
							))}
						</div>

						{/* Code */}
						<div className="flex-1 py-4 px-4 overflow-auto">
							<pre className="text-xs leading-relaxed">
								<span className="text-[#A0A0A0]">function </span>
								<span className="text-[#FFC799]">calculateTotal</span>
								<span className="text-[#A0A0A0]">(</span>
								<span className="text-white">items</span>
								<span className="text-[#A0A0A0]">) {'{'}</span>
								{'\n'}
								<span className="text-[#A0A0A0]">  var </span>
								<span className="text-white">total</span>
								<span className="text-[#A0A0A0]"> = </span>
								<span className="text-[#FFC799]">0</span>
								<span className="text-[#A0A0A0]">;</span>
								{'\n'}
								<span className="text-[#A0A0A0]">  for (var i = </span>
								<span className="text-[#FFC799]">0</span>
								<span className="text-[#A0A0A0]">; i {'<'} items.length; i++) {'{'}</span>
								{'\n'}
								<span className="text-[#A0A0A0]">    total = total + items[</span>
								<span className="text-white">i</span>
								<span className="text-[#A0A0A0]">].price;</span>
								{'\n'}
								<span className="text-[#A0A0A0]">  {'}'}</span>
								{'\n'}
								<span className="text-[#A0A0A0]">  if (total {'>'} </span>
								<span className="text-[#FFC799]">100</span>
								<span className="text-[#A0A0A0]">) {'{'}</span>
								{'\n'}
								<span className="text-[#A0A0A0]">    console</span>
								<span className="text-[#FFC799]">.log</span>
								<span className="text-[#A0A0A0]">(</span>
								<span className="text-[#99FFE4]">"discount applied"</span>
								<span className="text-[#A0A0A0]">);</span>
								{'\n'}
								<span className="text-[#A0A0A0]">    total = total * </span>
								<span className="text-[#FFC799]">0.9</span>
								<span className="text-[#A0A0A0]">;</span>
								{'\n'}
								<span className="text-[#A0A0A0]">  {'}'}</span>
								{'\n'}
								<span className="text-[#8B8B8B]">  // TODO: handle tax calculation</span>
								{'\n'}
								<span className="text-[#8B8B8B]">  // TODO: handle currency conversion</span>
								{'\n'}
								{'\n'}
								<span className="text-[#A0A0A0]">  return total;</span>
								{'\n'}
								<span className="text-[#A0A0A0]">{'}'}</span>
							</pre>
						</div>
					</div>

					{/* Actions Bar */}
					<div className="h-[40px] flex items-center justify-between px-4 bg-[#111111] border border-[#2A2A2A] border-t-0">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<div className="w-10 h-[22px] bg-[#10B981] rounded-full flex items-center justify-end pr-1">
									<div className="w-4 h-4 bg-[#0A0A0A] rounded-full" />
								</div>
								<span className="text-[#10B981] text-sm">roast mode</span>
							</div>
							<span className="text-[#4B5563] text-xs">
								// maximum sarcasm enabled
							</span>
						</div>
						<button className="bg-[#10B981] text-[#0A0A0A] text-sm font-medium px-6 py-2 rounded">
							$ roast_my_code
						</button>
					</div>
				</div>

				{/* Footer Stats */}
				<div className="flex items-center gap-6 text-[#4B5563] text-sm">
					<span>2,847 codes roasted</span>
					<span>·</span>
					<span>avg score: 4.2/10</span>
				</div>

				{/* Spacer */}
				<div className="h-[60px]" />

				{/* Leaderboard Preview Section */}
				<div className="w-[960px] space-y-4">
					{/* Title Row */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-[#10B981] font-bold">//</span>
							<span className="text-[#FAFAFA] font-bold">shame_leaderboard</span>
						</div>
						<div className="flex items-center gap-1 px-3 py-1 border border-[#2A2A2A]">
							<span className="text-[#6B7280] text-xs">$ view_all {'>'}</span>
						</div>
					</div>
					<p className="text-[#4B5563] text-sm">
						// the worst code on the internet, ranked by shame
					</p>

					{/* Table */}
					<div className="border border-[#2A2A2A]">
						{/* Table Header */}
						<div className="h-[40px] flex items-center px-5 bg-[#0F0F0F] border-b border-[#2A2A2A]">
							<div className="w-[50px] text-[#4B5563] text-xs font-medium">#</div>
							<div className="w-[70px] text-[#4B5563] text-xs font-medium">score</div>
							<div className="flex-1 text-[#4B5563] text-xs font-medium">code</div>
							<div className="w-[100px] text-[#4B5563] text-xs font-medium">lang</div>
						</div>

						{/* Row 1 */}
						<div className="flex items-center px-5 py-4 border-b border-[#2A2A2A]">
							<div className="w-[50px] text-[#F59E0B] text-xs">1</div>
							<div className="w-[70px] text-[#EF4444] text-xs font-bold">1.2</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="text-[#FAFAFA] text-xs">eval(prompt("enter code"))</span>
								<span className="text-[#FAFAFA] text-xs">document.write(response)</span>
								<span className="text-[#8B8B8B] text-xs">// trust the user lol</span>
							</div>
							<div className="w-[100px] text-[#6B7280] text-xs">javascript</div>
						</div>

						{/* Row 2 */}
						<div className="flex items-center px-5 py-4 border-b border-[#2A2A2A]">
							<div className="w-[50px] text-[#6B7280] text-xs">2</div>
							<div className="w-[70px] text-[#EF4444] text-xs font-bold">1.8</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="text-[#FAFAFA] text-xs">if (x == true) {'{'} return true; {'}'}</span>
								<span className="text-[#FAFAFA] text-xs">else if (x == false) {'{'} return false; {'}'}</span>
								<span className="text-[#FAFAFA] text-xs">else {'{'} return !false; {'}'}</span>
							</div>
							<div className="w-[100px] text-[#6B7280] text-xs">typescript</div>
						</div>

						{/* Row 3 */}
						<div className="flex items-center px-5 py-4">
							<div className="w-[50px] text-[#6B7280] text-xs">3</div>
							<div className="w-[70px] text-[#EF4444] text-xs font-bold">2.1</div>
							<div className="flex-1 flex flex-col gap-1">
								<span className="text-[#FAFAFA] text-xs">SELECT * FROM users WHERE 1=1</span>
								<span className="text-[#8B8B8B] text-xs">-- TODO: add authentication</span>
							</div>
							<div className="w-[100px] text-[#6B7280] text-xs">sql</div>
						</div>
					</div>

					{/* Fade Hint */}
					<div className="text-center py-4 text-[#4B5563] text-xs">
						showing top 3 of 2,847 · view full leaderboard {'>'}
					</div>
				</div>
			</main>
		</div>
	);
}
