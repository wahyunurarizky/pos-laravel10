import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";

export default function DataEntryField({ defaultValue = "231.00" }) {
    const [inputValue, setInputValue] = useState(defaultValue);

    const handleChange = (newValue) => {
        console.log("onValueChange fired");
        if (newValue === undefined) {
            setInputValue("0");
        } else {
            setInputValue(newValue);
        }
    };

    return (
        <>
            <label htmlFor={"input-currency-field"}>Label 1 </label>
            <CurrencyInput
                allowDecimals
                decimalSeparator="."
                id="input-currency-field"
                name="input-currency-field-name"
                prefix="Rp "
                value={inputValue}
                onValueChange={handleChange}
                step={1}
            />
            <hr />
            <div>RESULT to be SAVED: {inputValue}</div>
        </>
    );
}
