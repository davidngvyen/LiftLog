"use client"

import { Button } from "@/components/ui/button"

export type DateRange = '1M' | '3M' | '6M' | '1Y' | 'ALL'

interface DateRangeSelectorProps {
    selected: DateRange
    onSelect: (range: DateRange) => void
}

const RANGES: DateRange[] = ['1M', '3M', '6M', '1Y', 'ALL']

export function DateRangeSelector({ selected, onSelect }: DateRangeSelectorProps) {
    return (
        <div className="flex items-center gap-1 sm:gap-2 bg-muted/50 p-1 rounded-lg border w-fit">
            {RANGES.map((range) => (
                <Button
                    key={range}
                    variant={selected === range ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onSelect(range)}
                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm font-medium transition-all"
                >
                    {range}
                </Button>
            ))}
        </div>
    )
}
