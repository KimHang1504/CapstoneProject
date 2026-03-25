import { EvidenceSnapshot, Report } from "@/api/admin/type";
import PostSnapshot from "./PostSnapshot";
import ReviewSnapshot from "./ReviewSnapshot";
import VenueSnapshot from "./VenueSnapshot";
import CommentSnapshot from "./CommentSnapshot";
import UserSnapshot from "./UserSnapshot";

export default function EvidenceSnapshotView({
  snapshot,
}: {
  snapshot: EvidenceSnapshot;
}) {
  if (!snapshot?.data) {
    return (
      <div className="text-gray-400 text-sm italic">
        Không có dữ liệu snapshot
      </div>
    );
  }

  switch (snapshot.targetType) {
    case "POST":
      return <PostSnapshot snapshot={snapshot} />;

    case "REVIEW":
      return <ReviewSnapshot snapshot={snapshot} />;

    case "VENUE":
      return <VenueSnapshot snapshot={snapshot} />;

    case "COMMENT":
      return <CommentSnapshot snapshot={snapshot} />;

    case "USER":
      return <UserSnapshot snapshot={snapshot} />;

    default:
      return (
        <div className="text-gray-400 text-sm italic">
          Không hỗ trợ loại {(snapshot as EvidenceSnapshot).targetType}
        </div>
      );
  }
}