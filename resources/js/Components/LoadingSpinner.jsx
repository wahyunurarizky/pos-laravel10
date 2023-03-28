import BarLoader from "react-spinners/BarLoader";

import React from "react";

export default function LoadingSpinner() {
    return (
        <BarLoader
            // className="h-5 w-10"
            color={"gray"}
            loading={true}
            // size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    );
}
