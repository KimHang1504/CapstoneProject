import { getSpecialEventDetail } from "@/api/admin/api";
import UpdateEventPage from "./components/UpdateEventPage";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;

    const res = await getSpecialEventDetail(id);

    return (
        <UpdateEventPage
            event={res.data}
        />
    );
}