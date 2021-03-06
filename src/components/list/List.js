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
      loading: false,
      showLoading: false,
      error: '',
    };

    this.loaderTimeout = null;
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
  }

  componentWillMount() {
    this.fetchCurrencies();
  }

  fetchCurrencies() {
    const { page, perPage } = this.state;

    this.setState({loading: true});
    this.loaderTimeout = setTimeout(
      () => this.setState({ showLoading: true}), 
      100,
    );
    
    return fetch(`${API_URL}/cryptocurrencies/?page=${page}&perPage=${perPage}`)
    .then(handleResponse)
    .then((data) => {
      const { totalPages, currencies } = data;

      clearTimeout(this.loaderTimeout);
      document.title = `React Coin (${page}/${totalPages})`;
      this.setState({
        currencies,
        totalPages,
        error: '',
        loading: false,
        showLoading: false,
      });
    })
    .catch((error) => {
      clearTimeout(this.loaderTimeout);
      document.title = 'Error';
      this.setState({
        error: error.errorMessage || error.message,
        loading: false,
        showLoading: false,
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
    const { currencies, loading, showLoading, error, page, totalPages } = this.state;

    if (error) {
      return <div className="error">{error}</div>
    }

    if (!currencies.length) {
      return ''
    }

    return (
      <div>
        {showLoading && <div className="loading-container" style={{height: "660px"}}><Loading/></div>}
        {!showLoading && <Table currencies={currencies} />}

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
