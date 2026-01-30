export function DashboardSkeleton() {
    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Player Card Structure */}
            <div className="border-4 border-black bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* Inner white card with fixed height to mimic content */}
                <div className="border-2 border-black bg-white p-4 h-[140px]" />
            </div>

            {/* Daily Quests Structure */}
            <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* Header space */}
                <div className="h-8 mb-3" />
                <div className="grid gap-3 sm:grid-cols-2">
                    {/* Quest Buttons */}
                    <div className="h-[88px] w-full border-4 border-black bg-gradient-to-br from-primary via-orange-500 to-red-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
                    <div className="h-[88px] w-full border-4 border-black bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
                </div>
            </div>

            {/* Stats Structure */}
            <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="h-6 mb-4" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[120px]" />
                    ))}
                </div>
            </div>

            {/* Quest Log Structure */}
            <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="h-6 mb-4" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 w-full border-2 border-black bg-white" />
                    ))}
                </div>
            </div>
        </div>
    );
}
