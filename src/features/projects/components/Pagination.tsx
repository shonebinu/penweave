export default function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (newPage: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center">
      <div className="join">
        <button
          className="join-item btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          «
        </button>

        <span className="join-item btn btn-disabled">
          Page {page} of {totalPages}
        </span>

        <button
          className="join-item btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
}
