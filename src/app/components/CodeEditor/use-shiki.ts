"use client";

import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { atom } from "jotai";
import { createHighlighter } from "shiki";
import type { Highlighter } from "shiki";

// Atom para armazenar o highlighter singleton
export const highlighterAtom = atom<Highlighter | null>(null);

// Hook para inicializar o Shiki
export function useShiki() {
	const [highlighter, setHighlighter] = useAtom(highlighterAtom);
	const highlighterRef = useRef<Highlighter | null>(null);

	useEffect(() => {
		if (highlighterRef.current) return;

		async function initHighlighter() {
			try {
				const newHighlighter = await createHighlighter({
					themes: [
						"one-dark-pro", // Tema popular do VS Code
					],
					langs: [
						"javascript",
						"typescript",
						"python",
						"html",
						"css",
						"json",
						"sql",
						"markdown",
						"bash",
					],
				});
				highlighterRef.current = newHighlighter;
				setHighlighter(newHighlighter);
			} catch (error) {
				console.error("Failed to initialize Shiki highlighter:", error);
			}
		}

		initHighlighter();

		// Cleanup on unmount
		return () => {
			if (highlighterRef.current) {
				highlighterRef.current.dispose();
			}
		};
	}, [setHighlighter]);

	return { highlighter };
}
