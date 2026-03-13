import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const scoreRingVariants = tv({
	base: "relative flex items-center justify-center",
});

export interface ScoreRingProps extends React.HTMLAttributes<HTMLDivElement> {
	score: number; // 0 to 100
	size?: number;
}

export function ScoreRing({
	score,
	size = 180,
	className,
	...props
}: ScoreRingProps) {
	const radius = 70;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (score / 100) * circumference;

	return (
		<div
			className={twMerge(scoreRingVariants(), className)}
			style={{ width: size, height: size }}
			{...props}
		>
			<svg
				width={size}
				height={size}
				className="transform -rotate-90"
				role="img"
				aria-label={`Score: ${score}`}
			>
				{/* Background circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="currentColor"
					strokeWidth="4"
					fill="transparent"
					className="text-border-primary"
				/>
				{/* Gradient arc */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="url(#gradient)"
					strokeWidth="4"
					fill="transparent"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
				/>
				<defs>
					<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="var(--color-accent-green)" />
						<stop offset="35%" stopColor="var(--color-accent-amber)" />
						<stop offset="36%" stopColor="transparent" />
					</linearGradient>
				</defs>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-2xl font-bold text-foreground">{score}</span>
				<span className="text-xs text-text-tertiary">score</span>
			</div>
		</div>
	);
}
