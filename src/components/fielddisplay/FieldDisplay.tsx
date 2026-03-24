type Props = {
    value?: string | number | null
    label: string
    onEdit: () => void
    children?: React.ReactNode
}

export default function FieldDisplay({ value, label, onEdit, children }: Props) {
    const isEmpty =
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)

    if (!isEmpty) {
        return <>{children ?? <span>{value}</span>}</>
    }

    return (
        <div className="text-sm text-gray-400 flex items-center gap-2">
            <span>Chưa có {label}</span>
            <button
                onClick={onEdit}
                className="text-violet-500 hover:underline"
            >
                Cập nhật ngay
            </button>
        </div>
    )
}