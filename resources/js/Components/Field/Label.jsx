import React from "react";

export default function Label({ name, labelName }) {
    return (
        <label
            htmlFor={name}
            className="mb-2 block text-sm font-medium uppercase text-gray-900 dark:text-white"
        >
            {labelName}
        </label>
    );
}
