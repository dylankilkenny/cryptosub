import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

class TablePagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active_page: 1,
      number_pages: Math.round(this.props.totalItemsCount / 20)
    };
  }

  componentDidCatch(error, info) {
    console.log(error);
    console.log(info);
  }

  handleNavigation(pageNumber) {
    this.setState(
      { active_page: pageNumber },
      this.props.handlePageClick(pageNumber)
    );
  }

  handleNextPage() {
    let active_page = this.state.active_page;
    if (active_page != this.state.number_pages) {
      this.setState(
        {
          active_page: this.state.active_page + 1
        },
        this.props.handlePageClick(this.state.active_page + 1)
      );
    }
  }

  handlePrevPage() {
    let active_page = this.state.active_page;
    if (active_page != 1) {
      this.setState(
        {
          active_page: this.state.active_page - 1
        },
        this.props.handlePageClick(this.state.active_page - 1)
      );
    }
  }

  render() {
    let items = [];
    let activePage = this.state.active_page;
    let numberPages = this.state.number_pages;
    for (let i = 1; i <= numberPages; i++) {
      if (activePage > 2 && i == 1) {
        items.push(<Pagination.Ellipsis key={'l' + i} />);
      }
      if (
        activePage == i ||
        activePage == i + 1 ||
        activePage == i - 1 ||
        activePage == i - 2
      ) {
        items.push(
          <Pagination.Item
            onClick={() => this.handleNavigation(i)}
            key={i}
            active={activePage == i ? true : false}
          >
            {i}
          </Pagination.Item>
        );
      }
      if (activePage < 9 && i == numberPages) {
        items.push(<Pagination.Ellipsis key={'r' + i} />);
      }
    }
    return (
      <Pagination>
        <Pagination.Prev onClick={() => this.handlePrevPage()} />
        {items}
        <Pagination.Next onClick={() => this.handleNextPage()} />
      </Pagination>
    );
  }
}

export default TablePagination;
