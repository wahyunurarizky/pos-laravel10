import { useState } from "react";
import SearchBox from "./SearchBox";
import Form from "./Form";

export default function BuyForm() {
    const [isSearch, setIsSearch] = useState(false);

    return (
        // <div className="my-3 p-1 shadow-lg">
        isSearch ? <SearchBox setIsSearch={setIsSearch} /> : <Form />
        // </div>
    );
}
