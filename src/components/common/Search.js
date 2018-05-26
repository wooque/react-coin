import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ajax } from '../../helpers.js';
import Loading from '../common/Loading';
import { API_URL } from '../../config';
import './Search.css';

class Search extends React.Component {
  constructor() {
    super();

    this.state = {
      searchResults: [],
      searchQuery: '',
      loading: false,
      req: null,
      execution: null,
      focus: false,
    }

    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleBlur(e) {
    if (this.state.execution) {
      clearTimeout(this.state.execution);
    }
    if (this.state.req) {
      this.state.req.abort();
    }
    this.setState({
      loading: false,
      req: null,
      execution: null,
      focus: false,
    });
  }

  handleFocus(e) {
    this.setState({focus: true});
  }

  handleChange(e) {
    const searchQuery = e.target.value;

    this.setState({ searchQuery });

    if (!searchQuery) {
      this.setState({loading: false});
    }

    if (this.state.execution) {
      return
    }

    if (this.state.req) {
      this.state.req.abort();
      this.setState({loading: false});
    }

    this.setState({ loading: true });

    let that = this;
    let execution = setTimeout(() => {
      if (that.state.execution) {
        clearTimeout(that.state.execution);
      }
      that.setState({execution: null});
      let searchQuery = that.state.searchQuery;
      if (!searchQuery) {
        that.setState({
          loading: false,
          req: null,
        });
        return;
      }
      let {promise, req} = ajax(`${API_URL}/autocomplete?searchQuery=${searchQuery}`);
      that.setState({req});
      promise.then((result) => {
        that.setState({
            searchResults: result,
            loading: false,
            req: null,
          });
        });
    }, 300);
    this.setState({execution})
  }

  handleRedirect(currencyId) {
    this.setState({
      searchQuery: '',
      searchResults: [],
    });

    this.props.history.push(`/currency/${currencyId}`);
  }

  renderSearchResults() {
    const { searchResults, searchQuery, loading, focus } = this.state;

    if (!searchQuery || !focus) {
      return '';
    }
    
    if (searchResults.length > 0) {
      return (
        <div className="Search-result-container">
          {searchResults.map(result =>
            <div
              key={result.id}
              className="Search-result"
              onMouseDown={() => this.handleRedirect(result.id)}
            >
              {result.name} ({result.symbol})
            </div>
          )}
        </div>
      )
    }

    if (!loading) {
      return (
        <div className="Search-result-container">
          <div className="Search-no-result">
            No results found.
          </div>
        </div>
      )
    }
  }

  render() {
    const { searchQuery, loading } = this.state;

    return (
      <div className='Search'>
        <div>
          <span className="Search-icon" />
          <input 
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            type="text"
            className="Search-input"
            placeholder="Currency name"
            value={searchQuery}
          />

          {loading &&
            <div className="Search-loading">
              <Loading
                width="12px"
                height="12px"
              />
            </div>}
        </div>

        {this.renderSearchResults()}
      </div>
    );
  }
}

Search.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(Search);
