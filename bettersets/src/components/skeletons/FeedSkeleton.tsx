export function FeedSkeleton() {
    return (
        <div className="container max-w-2xl py-6 mx-auto">
            <div className="mb-6 flex items-center justify-between h-8" />

            {/* Create Post Area */}
            <div className="mb-6 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 p-4 h-[120px]" />

            {/* Feed List Items */}
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="overflow-hidden border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                        {/* Header Block */}
                        <div className="border-b-2 border-black bg-gray-50 p-3 h-[64px]" />

                        {/* Body Block */}
                        <div className="p-4 h-[300px]" />

                        {/* Footer Block */}
                        <div className="border-t-2 border-black bg-primary/10 p-2 h-[40px]" />
                    </div>
                ))}
            </div>
        </div>
    );
}
