import { useState, useCallback, useEffect, useRef } from "react";
import _debounce from "lodash/debounce";
import axios from "axios";
import ButtonMain from "../ButtonMain";

function DataItem({ data, ...props }) {
    return (
        <div className="my-2 cursor-pointer rounded-md bg-mycolor-dark p-4 text-gray-100">
            {data.name}
        </div>
    );
}

export default function SearchBox({ setIsSearch }) {
    const searchInputElement = useRef(null);

    const [searchValue, setSearchValue] = useState("");
    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        console.log("useeffects");
        if (searchInputElement.current) {
            searchInputElement.current.focus();
        }
        searchItems(searchValue);
    }, []);

    const searchItems = useCallback(
        _debounce((value) => {
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
        setLoading(true);
        setItems([]);
        setSearchValue(value);
        if (value.length >= 0) {
            searchItems(value);
        }
    };

    return (
        <>
            <form>
                <label
                    htmlFor="default-search"
                    className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Search
                </label>
                <div className="relative">
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
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Cari Barang"
                        required
                        value={searchValue}
                        onChange={onChangeSearchValue}
                    />
                </div>
            </form>
            <div className="rounded-md p-4 shadow-md">
                {isLoading ? (
                    <div>Loading...</div>
                ) : items.length > 0 ? (
                    <div>
                        {items.map((d) => (
                            <DataItem data={d} key={d.id} />
                        ))}
                        <ButtonMain
                            onClick={() => {
                                setIsSearch(false);
                            }}
                            className="w-full"
                        >
                            Tambah Baru +
                        </ButtonMain>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-center">Data Kosong</h2>
                        <ButtonMain
                            onClick={() => {
                                setIsSearch(false);
                            }}
                            className="w-full"
                        >
                            Tambah Baru +
                        </ButtonMain>
                    </div>
                )}
            </div>
        </>
    );
}
