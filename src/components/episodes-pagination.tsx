import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
} from "~/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { usePagination } from "~/hooks/use-pagination";
import { usePodcastSearch } from "~/hooks/use-podcast-search";

type PaginationProps = {
	totalPages: number;
	paginationItemsToDisplay?: number;
};

export function EpisodesPagination({
	totalPages,
	paginationItemsToDisplay = 8,
}: PaginationProps) {
	const [{ currentPage, perPage }, setPodcastSearch] = usePodcastSearch();
	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage,
		totalPages,
		paginationItemsToDisplay,
	});

	return (
		<div className="flex items-center justify-between gap-3">
			{/* Page number information */}
			<p
				className="flex-1 whitespace-nowrap text-muted-foreground text-sm"
				aria-live="polite"
			>
				Page <span className="text-foreground">{currentPage}</span> of{" "}
				<span className="text-foreground">{totalPages}</span>
			</p>

			{/* Pagination */}
			<div className="grow">
				<Pagination>
					<PaginationContent>
						{/* Previous page button */}
						<PaginationItem>
							<PaginationLink
								className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
								onClick={() => {
									setPodcastSearch({ currentPage: currentPage - 1 });
									window.scrollTo({
										top: 0,
										behavior: "smooth",
									});
								}}
								aria-label="Go to previous page"
								aria-disabled={currentPage === 1 ? true : undefined}
								role={currentPage === 1 ? "link" : undefined}
							>
								<ChevronLeftIcon size={16} aria-hidden="true" />
							</PaginationLink>
						</PaginationItem>

						{/* Left ellipsis (...) */}
						{showLeftEllipsis && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}

						{/* Page number links */}
						{pages.map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									onClick={() => {
										setPodcastSearch({ currentPage: page });
										window.scrollTo({
											top: 0,
											behavior: "smooth",
										});
									}}
									isActive={page === currentPage}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}

						{/* Right ellipsis (...) */}
						{showRightEllipsis && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}

						{/* Next page button */}
						<PaginationItem>
							<PaginationLink
								className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
								onClick={() => {
									setPodcastSearch({ currentPage: currentPage + 1 });
									window.scrollTo({
										top: 0,
										behavior: "smooth",
									});
								}}
								aria-label="Go to next page"
								aria-disabled={currentPage === totalPages ? true : undefined}
								role={currentPage === totalPages ? "link" : undefined}
							>
								<ChevronRightIcon size={16} aria-hidden="true" />
							</PaginationLink>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			{/* Results per page */}
			<div className="flex flex-1 justify-end">
				<Select
					defaultValue={perPage.toString()}
					onValueChange={(value) => {
						setPodcastSearch({
							currentPage: 1,
							perPage: Number.parseInt(value),
						});
						window.scrollTo({
							top: 0,
							behavior: "smooth",
						});
					}}
					aria-label="Results per page"
				>
					<SelectTrigger
						id="results-per-page"
						className="w-fit whitespace-nowrap"
					>
						<SelectValue placeholder="Select number of results" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="25">25 / page</SelectItem>
						<SelectItem value="50">50 / page</SelectItem>
						<SelectItem value="100">100 / page</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
