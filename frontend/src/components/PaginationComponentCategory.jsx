import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import ProductCard from './ProductCard';

const PaginationComponent = ({ data }) => {
  const itemsPerPage = 6; // Number of items to display per page
  const initialPage = 0; // Initial page number
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const totalPageCount = Math.ceil(data.length / itemsPerPage);
      setPageCount(totalPageCount);
    };

    fetchData();
  }, [data]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = data.slice(offset, offset + itemsPerPage);

  return (
    <>
      {/* Render your data here */}
      <div className='category-content'>
        {currentPageData.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>

      {/* Render the pagination component */}
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={4}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    </>
  );
};

export default PaginationComponent;
