import React from 'react'
import { Pagination } from 'semantic-ui-react'

const TablePagination = ({total_pages, handlePageClick}) => (
    <Pagination 
        defaultActivePage={1} 
        totalPages={total_pages} 
        onPageChange={(data, event) => handlePageClick(event)}
        />
)

export default TablePagination