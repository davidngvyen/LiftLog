export default function WorkoutsLoading() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-h-[44px]">
                {/* Title & Subtitle */}
                <div className="space-y-1">
                    <div className="h-9 w-48 bg-gray-200" />
                    <div className="h-5 w-64 bg-gray-100" />
                </div>

                {/* New Workout Button */}
                <div className="w-full sm:w-auto h-[44px] w-[140px] bg-primary rounded-md opacity-20" />
            </div>

            <div className="border-t pt-6 space-y-6">
                {/* Controls Bar (Filter + Sort) */}
                <div className="flex flex-col gap-3 bg-card p-3 sm:p-4 rounded-xl border h-[100px] sm:h-[70px]" />

                {/* Grid of Workout Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[...Array(6)].map((_, i) => (
                        // Mirroring WorkoutCard.tsx: border-4 border-black bg-gradient-to-r from-emerald-100 to-green-100 p-4
                        <div key={i} className="flex items-center gap-4 border-4 border-black bg-gradient-to-r from-emerald-100 to-green-100 p-4 min-h-[88px]">
                            {/* Icon Section */}
                            <div className="h-14 w-14 shrink-0 border-4 border-black bg-gradient-to-br from-yellow-300 to-yellow-500" />

                            {/* Content Section */}
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="h-5 w-3/4 bg-black/10" />
                                <div className="h-4 w-1/2 bg-black/10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
