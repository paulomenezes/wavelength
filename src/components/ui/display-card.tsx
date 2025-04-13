import type * as React from "react";

import { cn } from "~/lib/utils";
import { Card, CardContent } from "./card";

export function DisplayCard({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<Card
			data-slot="card"
			className={cn(
				"mb-2 gap-2 overflow-hidden bg-muted p-0.5 transition-all duration-200",
				className,
			)}
			{...props}
		/>
	);
}

export function DisplayCardHeader({
	className,
	...props
}: React.ComponentProps<"div">) {
	return <div data-slot="card-header" className={cn(className)} {...props} />;
}

export function DisplayCardContent({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<CardContent
			data-slot="card-content"
			className={cn(
				"select-none rounded-[12px] bg-white px-4 py-3 shadow-md transition-all",
				className,
			)}
			{...props}
		/>
	);
}

export function DisplayCardFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center gap-2", className)}
			{...props}
		/>
	);
}
