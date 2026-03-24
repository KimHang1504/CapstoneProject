import { getChallengeDetail } from "@/api/admin/api";
import UpdateChallengeForm from "./components/UpdateChallengeForm";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
    const { id } = await params;

    const res = await getChallengeDetail(id);

    return (
        <UpdateChallengeForm
            challenge={res.data}
        />
    );
}