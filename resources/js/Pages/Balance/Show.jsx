import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { currencyFormat } from "@/Helpers/currencyFormat";
import ButtonMain from "@/Components/ButtonMain";

export default function Show({ auth, balance }) {
    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Show balances" />
            <div className="md:p-6">
                <div className="md:rounded:md bg-white p-4">
                    <p>{balance.name}</p>
                    <p>Saldo: {currencyFormat(balance.amount)}</p>
                    <div>{/* <ButtonMain>Edit</ButtonMain> */}</div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
