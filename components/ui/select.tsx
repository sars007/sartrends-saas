import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = React.forwardRef<
  React.ElementRef<"select">,
  React.ComponentPropsWithoutRef<"select">
>(({ className, children, ...props }, ref) => (
  <select
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [>option:selected]:bg-accent [>option]:text-accent-foreground",
      className
    )}
    ref={ref}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof Select>,
  React.ComponentPropsWithoutRef<typeof Select>
>(({ className, children, ...props }, ref) => (
  <Select
    ref={ref}
    className={cn("flex items-center justify-between", className)}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </Select>
))
SelectTrigger.displayName = Select.displayName

const SelectValue = React.forwardRef<
  React.ElementRef<typeof Select>,
  React.ComponentPropsWithoutRef<typeof Select>
>(({ className, children, ...props }, ref) => (
  <Select ref={ref} className={cn("flex items-center", className)} {...props}>
    {children}
  </Select>
))
SelectValue.displayName = Select.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, children, position = "popper", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
SelectContent.displayName = "SelectContent"

export { Select, SelectTrigger, SelectValue, SelectContent }

