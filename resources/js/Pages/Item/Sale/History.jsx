import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";

export default function History({ auth }) {
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="History Jual Barang" />
            <div className="p-6 pb-16"></div>
        </AuthenticatedLayout>
    );
}
