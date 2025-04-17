"use client";

import { AudioWaveformIcon } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import fallbackImage from "../../public/logo.png";

interface ImageWithFallbackProps extends ImageProps {
	fallback?: ImageProps["src"];
}

export function ImageWithFallback({
	alt,
	src,
	...props
}: ImageWithFallbackProps) {
	const [error, setError] = useState<React.SyntheticEvent<
		HTMLImageElement,
		Event
	> | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setError(null);
	}, [src]);

	if (error) {
		return (
			<div
				className={cn(
					"flex h-full w-full items-center justify-center bg-muted",
					props.className,
				)}
			>
				<AudioWaveformIcon className="size-10 text-primary" />
			</div>
		);
	}

	return (
		<Image
			alt={alt}
			onError={setError}
			src={error ? fallbackImage : src}
			{...props}
		/>
	);
}
