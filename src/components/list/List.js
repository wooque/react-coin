import React from 'react';
import { withRouter } from 'react-router-dom';
import { API_URL } from '../../config';
import { handleResponse } from '../../helpers.js';
import Pagination from './Pagination';
import Loading from '../common/Loading';
import Table from './Table';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: parseInt(props.match.params.num, 10) || 1,
      totalPages: 0,
      perPage: 10,
      currencies: [],
      loading: true,
      error: '',
    };

    this.handlePaginationClick = this.handlePaginationClick.bind(this);
  }

  componentWillMount() {
    this.fetchCurrencies();
  }

  fetchCurrencies() {
    const { page, perPage } = this.state;

    let timeout = setTimeout(() => this.setState({ loading: true}), 200);

    fetch(`${API_URL}/cryptocurrencies/?page=${page}&perPage=${perPage}`)
      .then(handleResponse)
      .then((data) => {
        const { totalPages, currencies } = data;

        clearTimeout(timeout);
        this.setState({
          currencies,
          totalPages,
          error: '',
          loading: false,
        });
      })
      .catch((error) => {
        clearTimeout(timeout);
        this.setState({
          error: error.errorMessage || error.message,
          loading: false,
        });
      });
  }

  handlePaginationClick(direction) {
    let nextPage = this.state.page;
    nextPage = direction === 'next' ? nextPage + 1 : nextPage - 1;
    this.props.history.push(`/page/${nextPage}`);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      let nextPage = parseInt(nextProps.match.params.num, 10) || 1;
      this.setState({ page: nextPage }, () => {
        this.fetchCurrencies();
      });
    }
  }

  render() {
    const { currencies, loading, error, page, totalPages } = this.state;

    if (error) {
      return <div className="error">{error}</div>
    }

    return (
      <div>
        {loading && <div className="loading-container" style={{height: "675px"}}><Loading wait={false}/></div>}
        {!loading && <Table currencies={currencies} />}

        <Pagination
          page={page}
          totalPages={totalPages}
          handlePaginationClick={this.handlePaginationClick}
          disable={loading}
        />
      </div>
    );
  }
}

export default withRouter(List);
