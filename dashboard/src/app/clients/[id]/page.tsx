import ClientDetail from "@/app/clients/[id]/client";

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;

    return <ClientDetail ip={id} />;
}