import BarLoader from "react-spinners/BarLoader";

import React from "react";

export default function LoadingSpinner({ className, color = "gray" }) {
    return (
        <BarLoader
            className={className}
            color={color}
            loading={true}
            // size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    );
}
