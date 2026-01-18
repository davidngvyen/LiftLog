"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseDiagramProps {
    imageUrl: string;
    altText: string;
}

export function ExerciseDiagram({ imageUrl, altText }: ExerciseDiagramProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className="relative group cursor-pointer overflow-hidden rounded-xl border border-border bg-muted/50 aspect-video w-full max-w-md mx-auto shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-5xl max-h-[90vh] aspect-video bg-background rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ring-1 ring-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                        <Image
                            src={imageUrl}
                            alt={altText}
                            fill
                            className="object-contain"
                            priority
                            quality={100}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
