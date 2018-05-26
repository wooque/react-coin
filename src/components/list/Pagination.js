import React from 'react';
import './Pagination.css';

const Pagination = (props) => {
  const { totalPages, page, handlePaginationClick, disable } = props;

  return (
    <div className="Pagination">
      <button
        className="Pagination-button"
        disabled={disable || (page <= 1)}
        onClick={() => handlePaginationClick('prev')}
      >
        &larr;
      </button>

      <span className="Pagination-info">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </span>

      <button
        className="Pagination-button"
        disabled={disable || (page === totalPages)}
        onClick={() => handlePaginationClick('next')}
      >
        &rarr;
      </button>
    </div>
  );
}

export default Pagination;
