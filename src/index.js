import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Header from './components/common/Header';
import List from './components/list/List';
import Detail from './components/detail/Detail';
import NotFound from './components/notfound/NotFound';
import './index.css';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      showSearch: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    let show = e.nativeEvent.path[0].className.startsWith("Search");
    this.setState({showSearch: show});
  }

  render() {
    return (
      <BrowserRouter>
        <div className="outer" onClick={(e) => this.handleClick(e)}>
          <Header showSearch={this.state.showSearch}/>

          <Switch>
            <Route exact path="/" component={List} />
            <Route exact path="/page/:num" component={List} />
            <Route exact path="/currency/:id" component={Detail} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
