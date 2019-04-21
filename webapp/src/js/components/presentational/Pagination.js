import React from 'react';
// import { Pagination } from 'semantic-ui-react'
import Pagination from 'react-bootstrap/Pagination';
const TablePagination = ({ total_pages, handlePageClick }) => (
  <Pagination>
    <Pagination.First />
    <Pagination.Prev />
    <Pagination.Item>{1}</Pagination.Item>
    <Pagination.Ellipsis />

    <Pagination.Item>{10}</Pagination.Item>
    <Pagination.Item>{11}</Pagination.Item>
    <Pagination.Item active>{12}</Pagination.Item>
    <Pagination.Item>{13}</Pagination.Item>
    <Pagination.Item disabled>{14}</Pagination.Item>

    <Pagination.Ellipsis />
    <Pagination.Item>{20}</Pagination.Item>
    <Pagination.Next />
    <Pagination.Last />
  </Pagination>
);

export default TablePagination;
{
  /* <Pagination 
        defaultActivePage={1} 
        totalPages={total_pages} 
        onPageChange={(data, event) => handlePageClick(event)}
        />
        <Pagination> */
}
