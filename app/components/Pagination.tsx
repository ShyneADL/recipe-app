import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        // Show limited pagination for many pages
        if (
          totalPages > 5 &&
          page !== 1 &&
          page !== totalPages &&
          Math.abs(page - currentPage) > 1
        ) {
          if (page === 2 || page === totalPages - 1) {
            return <span key={page}>...</span>;
          }
          return null;
        }
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`pagination-btn ${
              currentPage === page ? "active text-primary-red" : ""
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
