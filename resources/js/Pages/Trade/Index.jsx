import ButtonMain from "@/Components/ButtonMain";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth }) {
    return (
        <AuthenticatedLayout auth={auth} className>
            <div className="p-6">
                <div>
                    <Head title="Jual Beli" />
                    <Link href={route("home")}>
                        <PrimaryButton className="m-2">Back</PrimaryButton>
                    </Link>
                </div>
                <div className="my-4 h-screen rounded-md bg-white p-4">
                    <ButtonMain className="mb-3 w-full">Jual</ButtonMain>
                    <ButtonMain className="mb-3 w-full">Beli</ButtonMain>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
