import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Input } from "./input";

export default function SearchInput({
	className,
	classNameContainer,
	value,
	onClear,
	...props
}: React.ComponentProps<"input"> & {
	classNameContainer?: string;
	onClear?: () => void;
}) {
	return (
		<div className={cn("relative", classNameContainer)}>
			<Input
				className={cn("peer ps-9 pe-9", className)}
				placeholder="Search..."
				type="search"
				value={value}
				{...props}
			/>
			<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
				<SearchIcon size={16} />
			</div>
			{value && String(value).length > 0 && (
				<button
					className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Clear search"
					type="button"
					onClick={onClear}
				>
					<XIcon size={16} aria-hidden="true" />
				</button>
			)}
		</div>
	);
}
