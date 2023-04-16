import React from "react";
import { toast } from "react-toastify";

export default function ListItemPurchase({ d, i, box, setBox }) {
    if (d.edit) return;

    const currencyFormat = (num) => {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    return (
        <div
            onClick={() => {
                if (!box.find((d) => !d.isSaved)) {
                    setBox(
                        box.map((data, index) => {
                            const edit = index === i;
                            return {
                                ...data,
                                edit,
                            };
                        })
                    );
                } else {
                    toast.error("ada pembelian yg belum disimpan");
                }
            }}
            className="mb-2 flex w-full cursor-pointer items-center rounded-md bg-white p-2 shadow-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-100 active:bg-gray-100"
        >
            <div className="w-full">
                <div className="relative font-bold">
                    {d.isNew ? d.name : d.apiData?.name}
                    {d.isNew && (
                        <div className="absolute top-0 right-0 font-light text-yellow-600">
                            new
                        </div>
                    )}
                </div>
                <div className="flex cursor-pointer items-end text-sm">
                    <div className="basis-1/6 pr-2">
                        {d.per_unit_qty}{" "}
                        {d.isNew
                            ? d.unit_name
                            : d.units.find((data) => data.unit_id == d.unit_id)
                                  ?.unit_name}
                    </div>
                    <div className="flex-grow basis-1/3 pl-2 text-right">
                        @Rp {currencyFormat(d.price_per_unit) || "-"}
                    </div>
                    <div className="flex-grow basis-1/3 pl-2 text-right">
                        Rp {currencyFormat(d.total)}
                    </div>
                </div>
            </div>
        </div>
    );
}
