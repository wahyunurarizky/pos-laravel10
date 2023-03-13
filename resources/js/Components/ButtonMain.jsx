import clsx from "clsx";

export default function ButtonMain({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={clsx(
                "inline-flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-lg font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-amber-500 focus:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-amber-900 dark:bg-amber-200 dark:text-gray-800 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300",
                className,
                disabled && "opacity-25"
            )}
        >
            {children}
        </button>
    );
}
