import React, {useEffect, useState} from 'react';
import {Pagination as PaginationComponent} from 'react-bootstrap';

const Pagination = ({data, emptyMessage, render, itemPerPage = 10}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageController, setPageController] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const pages = [];
    for (let i = 1; i <= Math.ceil(data.length / itemPerPage); i++) {
      pages.push(i);
    }
    setPageController(pages);
  }, [data, itemPerPage, currentPage]);

  useEffect(() => {
    let start = currentPage * itemPerPage - itemPerPage;
    const newData = data.slice(start, start + itemPerPage);
    setItems(newData);
  }, [currentPage, itemPerPage, data]);

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, [currentPage]);

  return (
    <div>
      <div>
        {data.length <= 0 ? <span>{emptyMessage}</span> : items.map((props) => render(props))}
      </div>
      <div>
        <PaginationComponent>
          {pageController.map((num) => (
            <PaginationComponent.Item
              key={num}
              active={num === currentPage}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </PaginationComponent.Item>
          ))}
        </PaginationComponent>
      </div>
    </div>
  );
};

export default Pagination;
