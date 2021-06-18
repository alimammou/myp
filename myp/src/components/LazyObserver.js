import React from "react";
import { observer } from "mobx-react";

// @observer
export default class Observer extends React.Component {
  constructor() {
    super();
    this.state = { isVisible: false };
    this.io = null;
    this.container = null;
  }
  componentDidMount() {
    this.io = new IntersectionObserver(([entry]) => {
      if (this.props.once && entry.isIntersecting) {
        this.setState({ isVisible: true });
        this.io.disconnect();
      } else this.setState({ isVisible: entry.isIntersecting });
    }, {});
    this.io.observe(this.container);
  }
  componentWillUnmount() {
    if (this.io) {
      this.io.disconnect();
    }
  }

  render() {
    return (
      <div
        {...this.props}
        ref={div => {
          this.container = div;
        }}
      >
        {Array.isArray(this.props.children)
          ? this.props.children.map(child => child(this.state.isVisible))
          : this.props.children(this.state.isVisible)}
      </div>
    );
  }
}
