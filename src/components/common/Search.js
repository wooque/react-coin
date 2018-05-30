import React from 'react';
import { withRouter } from 'react-router-dom';
import { Debouncer, handleResponse } from '../../helpers.js';
import Loading from '../common/Loading';
import { API_URL } from '../../config';
import './Search.css';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: null,
      searchQuery: '',
      loading: false,
      showSearch: props.showSearch,
    }
    this.debouncer = new Debouncer(300);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.finish = this.finish.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({showSearch: newProps.showSearch});
  }

  finish(results) {
    this.setState({
      searchResults: results,
      loading: false,
    });
  }

  handleChange(e) {
    const searchQuery = e.target.value;
    this.setState({ searchQuery });
    this.debouncer.execute(() => {
      if (!this.state.searchQuery) {
        return;
      }
      this.setState({ loading: true });
      return fetch(`${API_URL}/autocomplete?searchQuery=${this.state.searchQuery}`);
    }).then(handleResponse)
    .then(this.finish);
  }

  handleRedirect(event, currencyId) {
    if (event.ctrlKey) {
      return;
    }
    event.preventDefault();
    this.debouncer.cancelExecution();
    this.finish([]);
    this.setState({searchQuery: ''});

    this.props.history.push(`/currency/${currencyId}`);
  }

  renderSearchResults() {
    const { searchResults, searchQuery, loading, showSearch } = this.state;

    if (!searchQuery || !showSearch || searchResults == null) {
      return '';
    }
    
    if (searchResults.length > 0) {
      return (
        <div className="Search-result-container">
          {searchResults.map(result =>
            <a href={"/currency/" + result.id}
             key={result.id}
             onClick={(e) => this.handleRedirect(e, result.id)}
             className='Search-noDecor'>
              <div className="Search-result">
                {result.name} ({result.symbol})
              </div>
            </a>
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
