export default function ProfileLoading() {
    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Character Customization Header */}
            <div className="border-4 border-black bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="border-2 border-black bg-white p-6 h-[200px]" />
            </div>

            {/* Stats Grid */}
            <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="h-6 mb-4" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-[100px]" />
                    ))}
                </div>
            </div>
        </div>
    );
}
