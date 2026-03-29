"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

declare global {
	interface Window {
		YT?: {
			Player: new (element: HTMLElement, config: Record<string, unknown>) => YouTubePlayer;
			PlayerState: {
				PLAYING: number;
			};
		};
		onYouTubeIframeAPIReady?: () => void;
	}
}

type YouTubePlayer = {
	destroy: () => void;
	getCurrentTime: () => number;
	getDuration: () => number;
};

type ProgressResponse = {
	success: boolean;
	data?: {
		progress?: {
			watchedSeconds?: number;
			totalSeconds?: number;
			watchPercentage?: number;
			isCompleted?: boolean;
		};
	};
};

function loadYoutubeApi() {
	return new Promise<void>((resolve) => {
		if (window.YT?.Player) {
			resolve();
			return;
		}

		const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
		if (existing) {
			const previous = window.onYouTubeIframeAPIReady;
			window.onYouTubeIframeAPIReady = () => {
				previous?.();
				resolve();
			};
			return;
		}

		const script = document.createElement("script");
		script.src = "https://www.youtube.com/iframe_api";
		script.async = true;

		window.onYouTubeIframeAPIReady = () => resolve();

		document.body.appendChild(script);
	});
}

export function useVideoProgress({
	courseSlug,
	lessonId,
	youtubeVideoId,
	initialWatchedSeconds = 0,
	initialTotalSeconds = 1,
}: {
	courseSlug: string;
	lessonId: string;
	youtubeVideoId: string;
	initialWatchedSeconds?: number;
	initialTotalSeconds?: number;
}) {
	const mountRef = useRef<HTMLDivElement | null>(null);
	const playerRef = useRef<YouTubePlayer | null>(null);
	const readyRef = useRef(false);
	const watchedRef = useRef(initialWatchedSeconds);
	const totalRef = useRef(Math.max(1, initialTotalSeconds));

	const [isReady, setIsReady] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [watchedSeconds, setWatchedSeconds] = useState(initialWatchedSeconds);
	const [totalSeconds, setTotalSeconds] = useState(Math.max(1, initialTotalSeconds));
	const [isCompleted, setIsCompleted] = useState(false);

	const watchPercentage = useMemo(
		() => Math.min(100, (watchedSeconds / Math.max(1, totalSeconds)) * 100),
		[watchedSeconds, totalSeconds]
	);

	useEffect(() => {
		readyRef.current = isReady;
	}, [isReady]);

	useEffect(() => {
		watchedRef.current = watchedSeconds;
	}, [watchedSeconds]);

	useEffect(() => {
		totalRef.current = totalSeconds;
	}, [totalSeconds]);

	const saveProgress = useCallback(
		async (nextWatchedSeconds: number, nextTotalSeconds: number) => {
			try {
				const response = await fetch(`/api/courses/${courseSlug}/lessons/${lessonId}/progress`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ watchedSeconds: nextWatchedSeconds }),
				});

				if (!response.ok) {
					return;
				}

				const payload = (await response.json()) as ProgressResponse;
				const remote = payload.data?.progress;

				if (!remote) {
					return;
				}

				const remoteWatched = remote.watchedSeconds ?? nextWatchedSeconds;
				const remoteTotal = Math.max(1, remote.totalSeconds ?? nextTotalSeconds);
				const remoteCompleted = Boolean(remote.isCompleted);

				setWatchedSeconds((prev) => Math.max(prev, remoteWatched));
				setTotalSeconds(remoteTotal);
				setIsCompleted(remoteCompleted);
			} catch {
				// Ignore transient network errors and retry in next interval.
			}
		},
		[courseSlug, lessonId]
	);

	useEffect(() => {
		let intervalId: ReturnType<typeof setInterval> | null = null;
		let cancelled = false;

		async function boot() {
			await loadYoutubeApi();
			if (cancelled || !window.YT || !mountRef.current) {
				return;
			}

			playerRef.current = new window.YT.Player(mountRef.current, {
				videoId: youtubeVideoId,
				playerVars: {
					rel: 0,
					modestbranding: 1,
				},
				events: {
					onReady: () => {
						if (!playerRef.current) {
							return;
						}

						readyRef.current = true;
						setIsReady(true);
						const duration = Math.max(1, Math.floor(playerRef.current.getDuration() || initialTotalSeconds));
						setTotalSeconds(duration);
					},
					onStateChange: (event: { data: number }) => {
						const isNowPlaying = event.data === window.YT?.PlayerState.PLAYING;
						setIsPlaying(isNowPlaying);
					},
				},
			});

			intervalId = setInterval(() => {
				if (!playerRef.current || !readyRef.current) {
					return;
				}

				const currentTime = Math.floor(playerRef.current.getCurrentTime() || 0);
				const duration = Math.max(1, Math.floor(playerRef.current.getDuration() || totalRef.current || 1));
				const mergedWatched = Math.max(currentTime, watchedRef.current);

				setTotalSeconds(duration);
				setWatchedSeconds((prev) => Math.max(prev, mergedWatched));
				void saveProgress(mergedWatched, duration);
			}, 5000);
		}

		void boot();

		return () => {
			cancelled = true;
			if (intervalId) {
				clearInterval(intervalId);
			}
			if (playerRef.current) {
				playerRef.current.destroy();
				playerRef.current = null;
			}
		};
	}, [initialTotalSeconds, saveProgress, youtubeVideoId]);

	useEffect(() => {
		if (watchPercentage >= 90) {
			setIsCompleted(true);
		}
	}, [watchPercentage]);

	return {
		mountRef,
		isReady,
		isPlaying,
		watchedSeconds,
		totalSeconds,
		watchPercentage,
		isCompleted,
	};
}
