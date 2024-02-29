import React, { useState } from 'react';

const PaginationComponent = ({ itemsPerPage, totalItems, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            onPageChange(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            onPageChange(currentPage + 1);
        }
    };

    return (
        <section>
            <div className='d-flex justify-content-center gap-4 align-items-center'>
                <button className={`btn btn-sm ${currentPage === 1 ? 'btn-secondary' : 'btn-dark'}`} onClick={handlePrevClick}>
                    <span className='d-flex align-items-center gap-3'><i className='fe fe-arrow-left' />prev</span>
                </button>
                <span className='border border-dark rounded-circle px-3 py-2'>{currentPage}</span>
                <button className={`btn btn-sm ${currentPage === totalPages ? 'btn-secondary' : 'btn-dark'}`} onClick={handleNextClick}>
                    <span className='d-flex align-items-center gap-3'>next<i className='fe fe-arrow-right' /></span>
                </button>
            </div>
        </section>
    );
};

export default PaginationComponent;
