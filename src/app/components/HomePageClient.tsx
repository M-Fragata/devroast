"use client";
import { useRouter } from "next/navigation";
import { RaySoCodeEditor } from "@/app/components/CodeEditor/RaySoCodeEditor";
import { trpc } from "@/lib/trpc-client";

export default function HomePageClient() {
	const router = useRouter();

	const createRoast = trpc.roast.create.useMutation({
		onSuccess: (data) => {
			router.push(`/result/${data.roastId}`);
		},
		onError: (error) => {
			alert(`Failed to create roast: ${error.message}`);
		},
	});

	const handleSubmit = (code: string, language: string, roastMode: boolean) => {
		createRoast.mutate({
			code,
			language,
			mood: roastMode ? "roast" : "serious",
		});
	};

	return (
		<RaySoCodeEditor
			onSubmit={handleSubmit}
			isLoading={createRoast.isPending}
		/>
	);
}
