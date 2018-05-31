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
      selected: -1,
    }
    this.debouncer = new Debouncer(300);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.finish = this.finish.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({showSearch: newProps.showSearch});
  }

  finish(results) {
    if (results) {
      results = results.slice(0, 5);
    }
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

  handleKeyDown(e) {
    let keyCode = e.nativeEvent.keyCode;
    
    // ENTER
    if (keyCode === 13) {
      let currency = this.state.searchResults[this.state.selected].id;
      return this.handleRedirect(e, currency);
    }

    // != UP and DOWN
    if (keyCode !== 38 && keyCode !== 40) {
      return;
    }
    e.preventDefault();

    let newSelected = this.state.selected;
    if (keyCode === 38 && newSelected > 0) {
      newSelected--;
    } else if (keyCode === 40 && newSelected < this.state.searchResults.length - 1) {
      newSelected++;
    }
    this.setState({selected: newSelected});
  }

  handleRedirect(event, currencyId) {
    if (event.ctrlKey) {
      return;
    }
    event.preventDefault();
    this.debouncer.cancelExecution();
    this.finish(null);
    this.setState({
      searchQuery: '',
      selected: -1,
    });

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
          {searchResults.map((result, index) =>
            <a href={"/currency/" + result.id}
             key={result.id}
             onClick={(e) => this.handleRedirect(e, result.id)}
             className='Search-noDecor'>
              <div className={"Search-result "  + (this.state.selected === index? 'Search-selected': '')}>
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
            onKeyDown={this.handleKeyDown}
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
