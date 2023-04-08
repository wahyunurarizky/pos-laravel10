import { useState } from "react";
import SearchBox from "./SearchBox";
import ExistForm from "./ExistForm";
import NewForm from "./NewForm";
import { useBuy } from "@/Pages/Trade/Buy";
import { toast } from "react-toastify";
import { Transition } from "@headlessui/react";

export default function BuyOption({ updateBox, d, deleteBox, minimizeBox }) {
    if (!d.edit) return;
    const [isForm, setIsForm] = useState(Boolean(d.total > 0));
    const { box } = useBuy();

    const editButtonClick = (e) => {
        e.stopPropagation();
        updateBox({ edit: true });
        setIsForm(false);
    };
    const deleteButtonClick = (e) => {
        e.stopPropagation();
        deleteBox();
    };

    const makeNewForm = () => {
        updateBox({
            edit: true,
            isNew: true,
        });
        setIsForm(true);
    };

    const makeExistForm = (item_id) => {
        if (box.some((el) => el.item_id === item_id)) {
            toast.error("item sudah ada di list pembelian");
            return;
        }

        updateBox({
            item_id,
            edit: true,
            isNew: false,
        });
        setIsForm(true);
    };

    return isForm ? (
        d.isNew ? (
            <NewForm
                setIsForm={setIsForm}
                updateBox={updateBox}
                d={d}
                editButtonClick={editButtonClick}
                deleteButtonClick={deleteButtonClick}
                minimizeBox={minimizeBox}
            />
        ) : (
            <ExistForm
                item_id={d.item_id}
                updateBox={updateBox}
                d={d}
                minimizeBox={minimizeBox}
                editButtonClick={editButtonClick}
                deleteButtonClick={deleteButtonClick}
                setIsForm={setIsForm}
            />
        )
    ) : (
        <SearchBox
            makeNewForm={makeNewForm}
            makeExistForm={makeExistForm}
            deleteButtonClick={deleteButtonClick}
        />
    );
}
