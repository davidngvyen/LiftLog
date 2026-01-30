export default function ProgressLoading() {
    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Header Row: Title & Exercise Picker */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    {/* Title */}
                    <div className="h-8 w-48" />
                    {/* Subtitle */}
                    <div className="h-4 w-64" />
                </div>
                {/* Exercise Picker Button Shape */}
                <div className="w-full sm:w-auto min-w-[200px] h-10 border-2 border-black rounded-md bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            </div>

            {/* Date Range Selector Row */}
            <div className="flex justify-end">
                <div className="h-10 w-[300px] rounded-md bg-muted/20" />
            </div>

            {/* Personal Records Card Container */}
            {/* Mirrors src/components/progress/PersonalRecordsCard.tsx layout */}
            <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                {/* CardHeader */}
                <div className="p-6 pb-2">
                    <div className="h-7 w-48" />
                </div>
                {/* CardContent */}
                <div className="p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-[100px] rounded-xl border-2 border-black bg-accent/10" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Progress Chart */}
            <div className="border-4 border-black bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                {/* Header */}
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <div className="h-6 w-48" />
                    <div className="h-6 w-32" />
                </div>
                {/* Content Chart Area */}
                <div className="p-6">
                    <div className="h-[350px] w-full" />
                </div>
            </div>

            {/* Volume Chart */}
            <div className="border-4 border-black bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                {/* Header */}
                <div className="p-6">
                    <div className="h-6 w-48" />
                </div>
                {/* Content Chart Area */}
                <div className="p-6">
                    <div className="h-[350px] w-full" />
                </div>
            </div>
        </div>
    );
}
