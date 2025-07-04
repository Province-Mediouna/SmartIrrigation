import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: React.ReactNode
  showHome?: boolean
}

const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ items, className, separator = <ChevronRight className="h-4 w-4" />, showHome = true }, ref) => {
    const allItems = showHome 
      ? [{ label: "Accueil", href: "/", icon: <Home className="h-4 w-4" /> }, ...items]
      : items

    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-1">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            const isFirst = index === 0

            return (
              <li key={index} className="flex items-center">
                {!isFirst && (
                  <span className="mx-2 text-muted-foreground/50" aria-hidden="true">
                    {separator}
                  </span>
                )}
                
                {item.href && !isLast ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-muted-foreground hover:text-foreground transition-colors"
                    asChild
                  >
                    <a href={item.href} className="flex items-center gap-1">
                      {item.icon && item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Button>
                ) : (
                  <span 
                    className={cn(
                      "flex items-center gap-1 px-1",
                      isLast ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.icon && item.icon}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }
