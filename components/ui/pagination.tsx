"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
  siblingsCount?: number
}

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  siblingsCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // If there's only one page, don't render pagination
  if (totalPages <= 1) {
    return null
  }

  // Function to generate page numbers
  const generatePages = () => {
    // Always show first and last page
    const firstPage = 1
    const lastPage = totalPages

    // Calculate range of pages to show
    let startPage = Math.max(firstPage, currentPage - siblingsCount)
    let endPage = Math.min(lastPage, currentPage + siblingsCount)

    // Adjust if we're near the start or end
    if (currentPage <= siblingsCount + 1) {
      endPage = Math.min(firstPage + siblingsCount * 2, lastPage)
    }

    if (currentPage >= lastPage - siblingsCount) {
      startPage = Math.max(lastPage - siblingsCount * 2, firstPage)
    }

    // Generate array of pages
    const pages = []

    // Add first page and ellipsis if needed
    if (startPage > firstPage) {
      pages.push(firstPage)
      if (startPage > firstPage + 1) {
        pages.push("ellipsis-start")
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis and last page if needed
    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pages.push("ellipsis-end")
      }
      pages.push(lastPage)
    }

    return pages
  }

  const pages = generatePages()

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {pages.map((page, index) => {
        if (page === "ellipsis-start" || page === "ellipsis-end") {
          return (
            <Button key={`ellipsis-${index}`} variant="outline" size="icon" disabled>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More pages</span>
            </Button>
          )
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
