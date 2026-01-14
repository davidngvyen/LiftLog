import React from "react";

export function PixelClouds() {
    // Generate multiple clouds with different sizes, positions, and speeds
    const clouds = [
        { id: 1, size: "large", top: "10%", delay: 0, duration: 60 },
        { id: 2, size: "small", top: "25%", delay: 5, duration: 45 },
        { id: 3, size: "medium", top: "15%", delay: 10, duration: 70 },
        { id: 4, size: "small", top: "35%", delay: 15, duration: 50 },
        { id: 5, size: "large", top: "8%", delay: 20, duration: 65 },
        { id: 6, size: "medium", top: "40%", delay: 8, duration: 55 },
        { id: 7, size: "small", top: "20%", delay: 25, duration: 48 },
        { id: 8, size: "medium", top: "30%", delay: 12, duration: 58 },
    ];

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
            {clouds.map((cloud) => (
                <div
                    key={cloud.id}
                    className="absolute"
                    style={{
                        top: cloud.top,
                        left: "-200px",
                        animation: `float-cloud ${cloud.duration}s linear ${cloud.delay}s infinite`,
                    }}
                >
                    <PixelCloud size={cloud.size as "small" | "medium" | "large"} />
                </div>
            ))}
            <style>{`
        @keyframes float-cloud {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(100vw + 200px));
          }
        }
      `}</style>
        </div>
    );
}

function PixelCloud({ size }: { size: "small" | "medium" | "large" }) {
    const pixels = {
        small: [
            [0, 0, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 0],
        ],
        medium: [
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        ],
        large: [
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        ],
    };

    const pixelSize = size === "small" ? 4 : size === "medium" ? 5 : 6;
    const pattern = pixels[size];

    return (
        <div className="relative opacity-30">
            {pattern.map((row, y) => (
                <div key={y} className="flex">
                    {row.map((pixel, x) => (
                        <div
                            key={`${x}-${y}`}
                            className={pixel ? "bg-white border border-white/20" : ""}
                            style={{
                                width: `${pixelSize}px`,
                                height: `${pixelSize}px`,
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
