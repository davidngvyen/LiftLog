export default function AILoading() {
    return (
        <div className="space-y-6 pb-20 lg:pb-6">
            {/* Header */}
            <div className="border-4 border-black bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="border-2 border-black bg-white p-4 h-[80px]" />
            </div>

            {/* Info Card */}
            <div className="border-4 border-black p-6 bg-gradient-to-r from-cyan-200 to-blue-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-[100px]" />

            {/* Form */}
            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden h-[400px] bg-white" />
        </div>
    )
}
