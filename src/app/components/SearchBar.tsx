"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export default function SearchBar({
    onSearch,
    isLoading = false,
    placeholder = "Buscar videojuegos...",
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const debouncedSearch = useCallback(
        (value: string) => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            debounceTimer.current = setTimeout(() => {
                if (value.trim().length >= 2) {
                    onSearch(value.trim());
                }
            }, 400);
        },
        [onSearch]
    );

    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length >= 2) {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            onSearch(query.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            {/* Search Icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                {isLoading ? (
                    <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                )}
            </div>

            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="search-input pl-12"
                autoComplete="off"
                spellCheck={false}
            />

            {/* Clear button */}
            {query && (
                <button
                    type="button"
                    onClick={() => {
                        setQuery("");
                        if (debounceTimer.current) {
                            clearTimeout(debounceTimer.current);
                        }
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </form>
    );
}
