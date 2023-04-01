import { useState, useCallback, useEffect, useRef } from "react";
import _debounce from "lodash/debounce";
import axios from "axios";
import ButtonMain from "../ButtonMain";
import LoadingSpinner from "../LoadingSpinner";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

function DataItem({ data, ...props }) {
    console.log(data);
    return (
        <div
            {...props}
            className="my-1 flex cursor-pointer justify-between border-b-2 p-3 text-sm"
        >
            <div>{data.name}</div>
            <div>
                {data.bottom_unit_qty} {data.bottom_unit.name}
            </div>
        </div>
    );
}

export default function SearchBox({
    makeNewForm,
    makeExistForm,
    deleteButtonClick,
}) {
    const searchInputElement = useRef(null);

    const [searchValue, setSearchValue] = useState("");
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        if (searchInputElement.current) {
            searchInputElement.current.focus();
        }
        searchItems(searchValue);
    }, []);

    const searchItems = useCallback(
        _debounce((value) => {
            setLoading(true);
            axios
                .post(route("api.items.index", { q: value }))
                .then((response) => {
                    setItems(response.data);
                    setLoading(false);
                })
                .catch((_error) => {
                    setItems([]);
                    setLoading(false);
                });
        }, 500),
        []
    );

    const onChangeSearchValue = ({ target: { value } }) => {
        setSearchValue(value);
        if (value.length >= 0) {
            searchItems(value);
        }
    };

    return (
        <div className="">
            <form>
                <label
                    htmlFor="default-search"
                    className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Search
                </label>
                <div className="flex">
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            ref={searchInputElement}
                            autoFocus
                            type="search"
                            id="default-search"
                            className="block w-full rounded-md border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            autoComplete="off"
                            placeholder="Cari Barang"
                            required
                            value={searchValue}
                            onChange={onChangeSearchValue}
                        />
                    </div>
                    <button className="flex-none" onClick={deleteButtonClick}>
                        <TrashIcon className="h-7 w-7 pl-2 " />
                    </button>
                </div>
            </form>
            <div className="">
                {isLoading ? (
                    <div className="flex w-full justify-center p-5">
                        <LoadingSpinner />
                    </div>
                ) : items.length > 0 ? (
                    <div>
                        {items.map((data) => (
                            <DataItem
                                data={data}
                                key={data.id}
                                onClick={() => {
                                    makeExistForm(data.id);
                                }}
                            />
                        ))}
                        <ButtonMain onClick={makeNewForm} className="w-full">
                            Tambah Baru +
                        </ButtonMain>
                    </div>
                ) : (
                    <div>
                        <div className="my-1 border-b-2 p-3 text-center text-sm">
                            Data Tidak Ditemukan ...
                        </div>
                        <ButtonMain onClick={makeNewForm} className="w-full">
                            Tambah Baru +
                        </ButtonMain>
                    </div>
                )}
            </div>
        </div>
    );
}
