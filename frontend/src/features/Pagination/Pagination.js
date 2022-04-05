import React, {useEffect, useState} from 'react';
import {Pagination as PaginationComponent} from 'react-bootstrap';

const Pagination = ({data, render, itemPerPage = 10}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageController, setPageController] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setPageController([]);
    for (let i = 1; i <= Math.ceil(data.length / itemPerPage); i++) {
      setPageController((prev) => {
        prev.push(i);
        return prev;
      });
    }
  }, [data, itemPerPage, currentPage]);

  useEffect(() => {
    let start = currentPage * itemPerPage - itemPerPage;
    const newData = data.slice(start, start + itemPerPage);
    setItems(newData);
  }, [currentPage, itemPerPage, data]);

  return (
    <div>
      <div>{data.length <= 0 ? <span>No data</span> : items.map((props) => render(props))}</div>
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
