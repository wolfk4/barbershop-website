"use client"; // Mark this as a Client Component

import { Button } from "@/components/ui/button";

interface BookNowButtonProps {
    booksyUrl: string;
}

export function BookNowButton({ booksyUrl }: BookNowButtonProps) {
    return (
        <Button
            variant="default"
            className="h-20 w-59 px-8 py-4 text-3xl mb-8 cursor-pointer"
            onClick={() => window.open(booksyUrl, "_blank")}
        >
            Book Now
        </Button>
    );
}