import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faMoneyBillTrendUp } from "@fortawesome/free-solid-svg-icons";

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout auth={auth} className>
            <Head title="Utang Piutang" />
            <div className="grid grid-flow-row-dense grid-cols-2">
                <Link href={route("debters.index")} className="m-3">
                    <div className="rounded-lg bg-white p-4 text-center shadow-md">
                        <FontAwesomeIcon
                            icon={faMoneyBillTrendUp}
                            size="2x"
                            className="rounded-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-200 to-green-500 p-4"
                        />
                        <h2 className="font-bold">Hutang</h2>
                    </div>
                </Link>
                <Link href={route("bonders.index")} className="m-3">
                    <div className="rounded-lg bg-white p-4 text-center shadow-md">
                        <FontAwesomeIcon
                            icon={faBook}
                            size="2x"
                            className="rounded-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-green-200 to-green-500 p-4"
                        />
                        <h2 className="font-bold">Piutang</h2>
                    </div>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
