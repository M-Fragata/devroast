import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { LeaderboardRow } from "@/components/ui/leaderboard-row";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";
import {
	Navbar,
	NavbarBrand,
	NavbarLink,
	NavbarSpacer,
} from "@/layouts/navbar";

export default async function ComponentsPage() {
	const exampleCode = `function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}`;

	return (
		<div className="container mx-auto py-10 space-y-10">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Componentes UI</h1>
				<p className="text-muted-foreground">
					Demonstração de todos os componentes de UI e suas variantes.
				</p>
			</div>

			{/* Seção do Botão */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Button</h2>
				<div className="flex flex-wrap items-center gap-4">
					<Button variant="default">Default</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="link">Link</Button>
					<Button variant="submit">Submit</Button>
				</div>
			</section>

			{/* Seção do Badge */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Badge</h2>
				<div className="flex flex-wrap items-center gap-4">
					<Badge variant="default">Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="critical">Critical</Badge>
					<Badge variant="warning">Warning</Badge>
					<Badge variant="good">Good</Badge>
					<Badge variant="verdict">Verdict</Badge>
				</div>
			</section>

			{/* Seção do Toggle */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Toggle</h2>
				<div className="flex flex-wrap items-center gap-4">
					<Toggle />
					<Toggle checked />
				</div>
			</section>

			{/* Seção do DiffLine */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">DiffLine</h2>
				<div className="w-full max-w-2xl rounded-md border border-border-primary overflow-hidden">
					<DiffLine type="removed" lineNumbers={{ old: 1, new: 1 }} prefix="-">
						const oldCode = &quot;removed&quot;;
					</DiffLine>
					<DiffLine type="added" lineNumbers={{ old: 2, new: 1 }} prefix="+">
						const newCode = &quot;added&quot;;
					</DiffLine>
					<DiffLine type="context" lineNumbers={{ old: 3, new: 2 }} prefix=" ">
						const contextCode = &quot;unchanged&quot;;
					</DiffLine>
				</div>
			</section>

			{/* Seção do CodeBlock */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">CodeBlock</h2>
				<CodeBlock code={exampleCode} language="javascript" />
			</section>

			{/* Seção do Card */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Card</h2>
				<Card variant="analysis" className="max-w-md">
					<CardHeader>
						<div className="flex items-center gap-2">
							<span className="text-accent-green font-mono text-xs">
								{"//"}
							</span>
							<CardTitle>Analysis</CardTitle>
						</div>
					</CardHeader>
					<CardTitle>Using var instead of const/let</CardTitle>
					<CardDescription>
						The var keyword is function-scoped rather than block-scoped, which
						can lead to unexpected behavior and bugs.
					</CardDescription>
				</Card>
			</section>

			{/* Seção da Tabela (Leaderboard) */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Leaderboard Row</h2>
				<div className="w-full max-w-2xl rounded-md border border-border-primary overflow-hidden">
					<LeaderboardRow
						rank={1}
						score={950}
						code="function main() {...}"
						language="javascript"
					/>
					<LeaderboardRow
						rank={2}
						score={820}
						code="const app = new App()"
						language="typescript"
					/>
					<LeaderboardRow
						rank={3}
						score={750}
						code="print('hello')"
						language="python"
					/>
				</div>
			</section>

			{/* Seção da Navbar */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Navbar</h2>
				<Navbar className="max-w-2xl">
					<NavbarBrand>
						<span className="text-accent-green font-mono font-bold">
							DevRoast
						</span>
					</NavbarBrand>
					<NavbarSpacer />
					<NavbarLink href="#">Leaderboard</NavbarLink>
				</Navbar>
			</section>

			{/* Seção do ScoreRing */}
			<section className="space-y-4">
				<h2 className="text-2xl font-semibold">Score Ring</h2>
				<div className="flex items-center gap-8">
					<ScoreRing score={75} />
					<ScoreRing score={40} />
					<ScoreRing score={95} />
				</div>
			</section>
		</div>
	);
}
