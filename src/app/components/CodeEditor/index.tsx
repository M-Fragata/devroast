"use client";

import { useState, useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { highlighterAtom } from "./use-shiki";
import { detectLanguage, type Language } from "./language-detection";
import { codeToHtmlInline } from "./code-to-html-inline";

// Character limit constant for code snippets
const MAX_CODE_LENGTH = 2000;

interface CodeEditorProps {
	initialCode?: string;
	initialLanguage?: Language;
	onChange?: (code: string, language: Language) => void;
}

export function CodeEditor({
	initialCode = "",
	initialLanguage,
	onChange,
}: CodeEditorProps) {
	const [highlighter] = useAtom(highlighterAtom);
	const [code, setCode] = useState(initialCode);
	const [language, setLanguage] = useState<Language>(initialLanguage || "plaintext");
	const [highlightedCode, setHighlightedCode] = useState("");
	const [isDetected, setIsDetected] = useState(!initialLanguage);
	const [roastMode, setRoastMode] = useState(true);
	const [charCount, setCharCount] = useState(initialCode.length);
	
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const previewRef = useRef<HTMLDivElement>(null);
	const syncScrollRef = useRef(false);

	// Detect language automatically when code changes
	useEffect(() => {
		if (!initialLanguage && code.trim()) {
			const detected = detectLanguage(code);
			setLanguage(detected);
			setIsDetected(true);
		} else if (initialLanguage) {
			setLanguage(initialLanguage);
			setIsDetected(false);
		}
	}, [code, initialLanguage]);

	// Highlight code using Shiki
	useEffect(() => {
		if (!code) {
			setHighlightedCode("");
			return;
		}

		if (!highlighter) {
			// Show plain text while highlighter is loading
			setHighlightedCode(`<pre style="background-color: #282c34; color: #abb2bf; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 1rem;"><code>${escapeHtml(code)}</code></pre>`);
			return;
		}

		// Capture highlighter in a local variable to avoid TS errors in async closure
		const currentHighlighter = highlighter;

		async function highlight() {
			try {
				const html = await codeToHtmlInline(code, language, "one-dark-pro", currentHighlighter);
				setHighlightedCode(html);
			} catch (error) {
				console.error("Failed to highlight code:", error);
				setHighlightedCode(`<pre style="background-color: #282c34; color: #abb2bf; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; margin: 0; padding: 1rem;"><code>${escapeHtml(code)}</code></pre>`);
			}
		}

		const debounceTimer = setTimeout(highlight, 150);
		return () => clearTimeout(debounceTimer);
	}, [code, language, highlighter]);

	// Sync scroll between textarea and preview
	const handleScroll = () => {
		if (textareaRef.current && previewRef.current && !syncScrollRef.current) {
			syncScrollRef.current = true;
			previewRef.current.scrollTop = textareaRef.current.scrollTop;
			syncScrollRef.current = false;
		}
	};

	// Handle tab key for indentation
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab") {
			e.preventDefault();
			const textarea = e.currentTarget;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const newCode = code.substring(0, start) + "  " + code.substring(end);
			setCode(newCode);
			
			// Move cursor after inserted tab
			setTimeout(() => {
				if (textareaRef.current) {
					textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
				}
			}, 0);
		}
	};

	// Handle code change
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newCode = e.target.value;
		// Enforce character limit
		if (newCode.length <= MAX_CODE_LENGTH) {
			setCode(newCode);
			setCharCount(newCode.length);
			if (onChange) {
				onChange(newCode, language);
			}
		}
	};

	// Handle manual language change
	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLanguage = e.target.value as Language;
		setLanguage(newLanguage);
		setIsDetected(false);
		if (onChange) {
			onChange(code, newLanguage);
		}
	};

	// Toggle roast mode
	const toggleRoastMode = () => {
		setRoastMode(!roastMode);
	};

	return (
		<div className="w-full max-w-[780px]">
			{/* Window Header */}
			<div className="h-10 flex items-center justify-between px-4 bg-[#111111] border-b border-[#2A2A2A]">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-[#EF4444]" />
					<div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
					<div className="w-3 h-3 rounded-full bg-[#10B981]" />
				</div>
				<div className="flex items-center gap-2">
					<select
						value={language}
						onChange={handleLanguageChange}
						className="bg-[#1A1A1A] text-[#FAFAFA] text-xs border border-[#2A2A2A] rounded px-2 py-1 outline-none focus:border-[#10B981] cursor-pointer"
						aria-label="Select programming language"
					>
						<option value="plaintext">Plain Text</option>
						<option value="javascript">JavaScript</option>
						<option value="typescript">TypeScript</option>
						<option value="python">Python</option>
						<option value="html">HTML</option>
						<option value="css">CSS</option>
						<option value="json">JSON</option>
						<option value="sql">SQL</option>
						<option value="markdown">Markdown</option>
						<option value="bash">Bash</option>
					</select>
					{isDetected && (
						<span className="text-[#6B7280] text-xs">
							detected: {language}
						</span>
					)}
				</div>
			</div>

			{/* Code Area */}
			<div className="relative bg-[#111111] border border-[#2A2A2A] border-t-0 h-[360px] overflow-hidden">
				{/* Highlighted Code Preview */}
				<div
					ref={previewRef}
					className="absolute inset-0 p-4 overflow-auto pointer-events-none text-sm leading-relaxed"
					dangerouslySetInnerHTML={{ __html: highlightedCode }}
				/>
				
				{/* Transparent Textarea for Input */}
				<textarea
					ref={textareaRef}
					value={code}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onScroll={handleScroll}
					placeholder="// Paste your code here..."
					className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-[#FAFAFA] font-mono text-sm resize-none outline-none border-none leading-relaxed placeholder:text-[#6B7280] overflow-x-hidden whitespace-pre-wrap word-break-break-all"
					spellCheck={false}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
				/>
			</div>

			{/* Actions Bar */}
			<div className="h-10 flex items-center justify-between px-4 bg-[#111111] border border-[#2A2A2A] border-t-0">
				<div className="flex items-center gap-4">
					<button 
						onClick={toggleRoastMode}
						className="flex items-center gap-2 cursor-pointer"
					>
						<div className={`w-10 h-[22px] rounded-full flex items-center justify-between px-1 transition-colors ${roastMode ? 'bg-[#10B981]' : 'bg-[#4B5563]'}`}>
							<div className={`w-4 h-4 bg-[#0A0A0A] rounded-full transition-transform ${roastMode ? 'translate-x-5' : 'translate-x-0'}`} />
						</div>
						<span className={`text-xs ${roastMode ? 'text-[#10B981]' : 'text-[#6B7280]'}`}>roast mode</span>
					</button>
					<span className="text-[#4B5563] text-xs">
						// maximum sarcasm enabled
					</span>
				</div>
				<div className="flex items-center gap-4">
					<span className={`text-xs ${charCount > MAX_CODE_LENGTH ? 'text-red-400' : 'text-[#6B7280]'}`}>
						{charCount}/{MAX_CODE_LENGTH}
					</span>
					<button 
						disabled={charCount > MAX_CODE_LENGTH}
						className="bg-[#10B981] text-[#0A0A0A] text-xs font-medium px-4 py-2 rounded cursor-pointer hover:bg-[#0D9668] transition-colors disabled:bg-[#4B5563] disabled:cursor-not-allowed disabled:text-[#6B7280]"
					>
						$ roast_my_code
					</button>
				</div>
			</div>
		</div>
	);
}

function escapeHtml(text: string): string {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}
