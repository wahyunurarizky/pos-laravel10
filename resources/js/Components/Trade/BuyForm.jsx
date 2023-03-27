import { useState } from "react";
import SearchBox from "./SearchBox";
import Form from "./Form";
import ExistForm from "./ExistForm";

export default function BuyForm({ updateBox, i, d }) {
    const [isForm, setIsForm] = useState(Boolean(d.total > 0));

    console.log(d.item_id);

    return (
        // <div className="my-3 p-1 shadow-lg">
        isForm ? (
            d.isNew ? (
                <Form setIsForm={setIsForm} updateBox={updateBox} i={i} d={d} />
            ) : (
                <ExistForm
                    item_id={d.item_id}
                    updateBox={updateBox}
                    i={i}
                    d={d}
                    setIsForm={setIsForm}
                />
            )
        ) : (
            <SearchBox
                setIsForm={setIsForm}
                updateBox={updateBox}
                i={i}
                d={d}
            />
        )
        // </div>
    );
}
