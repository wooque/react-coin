import React from 'react';
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
    this.finish = this.finish.bind(this);
    this.clearExecution = this.clearExecution.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleBlur(e) {
    this.setState({focus: false, loading: false});
  }

  handleFocus(e) {
    this.setState({focus: true});
  }

  finish(results) {
    this.setState({
      searchResults: results,
      loading: false,
      req: null,
    });
  }

  clearExecution() {
    if (this.state.execution) {
      clearTimeout(this.state.execution);
    }
    this.setState({execution: null});
  }

  handleChange(e) {
    const searchQuery = e.target.value;
    this.setState({ searchQuery });

    if (this.state.execution) {
      return false;
    }

    if (this.state.req) {
      this.state.req.abort();
      this.finish([]);
    }
    this.setState({ loading: true });

    let execution = setTimeout(() => {
      this.clearExecution();
      let searchQuery = this.state.searchQuery;
      if (!searchQuery) {
        this.finish([]);
        return;
      }
      let {promise, req} = ajax(`${API_URL}/autocomplete?searchQuery=${searchQuery}`);
      this.setState({req});
      promise.then(this.finish);
    }, 300);
    this.setState({execution})
  }

  handleRedirect(currencyId) {
    this.clearExecution();
    if (this.state.req) {
      this.state.req.abort();
    }
    this.finish([]);
    this.setState({searchQuery: ''});

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

export default withRouter(Search);
