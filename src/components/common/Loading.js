import React from 'react';
import './Loading.css';

class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeout: null,
      wait: props.wait,
    };
  }

  componentDidMount() {
    let timeout = setTimeout(
      () => this.setState({wait: false}),
      300,
    );
    this.setState({timeout});
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeout);
  }

  render() {
    if (this.state.wait) {
      return '';
    }
    const { width, height } = this.props;

    return (
      <div
        className="Loading"
        style={{ width, height }}
      />
    );
  }
}

Loading.defaultProps = {
  width: '28px',
  height: '28px',
  wait: true,
};

export default Loading;
