import { MinusIcon } from "@heroicons/react/20/solid";
import React from "react";

export default function Minimize({ minimizeBox }) {
    return (
        <button
            onClick={minimizeBox}
            className="mb-1 w-full rounded-sm pb-2 text-right hover:bg-gray-200"
        >
            <MinusIcon className="inline h-6 w-6 text-black" />
        </button>
    );
}
