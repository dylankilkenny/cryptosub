import React from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import debounce from 'debounce';
const styles = {
  width: '100px',
  height: '100px',
  position: 'absolute',
  top: '-10000px',
  overflow: 'scroll',
  msOverflowStyle: 'scrollbar'
};
/**
 * @ignore - internal component.
 * The component is originates from https://github.com/STORIS/react-scrollbar-size.
 * It has been moved into the core in order to minimize the bundle size.
 */

class ScrollbarSize extends React.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.setMeasurements = () => {
      if (!this.node) {
        return;
      }

      this.scrollbarHeight = this.node.offsetHeight - this.node.clientHeight;
      this.scrollbarWidth = this.node.offsetWidth - this.node.clientWidth;
    }, this.handleResize = debounce(() => {
      const {
        onChange
      } = this.props;
      const prevHeight = this.scrollbarHeight;
      const prevWidth = this.scrollbarWidth;
      this.setMeasurements();

      if (prevHeight !== this.scrollbarHeight || prevWidth !== this.scrollbarWidth) {
        onChange({
          scrollbarHeight: this.scrollbarHeight,
          scrollbarWidth: this.scrollbarWidth
        });
      }
    }, 166), _temp;
  }

  componentDidMount() {
    this.setMeasurements();
    this.props.onLoad({
      scrollbarHeight: this.scrollbarHeight,
      scrollbarWidth: this.scrollbarWidth
    });
  }

  componentWillUnmount() {
    this.handleResize.clear();
  }

  // Corresponds to 10 frames at 60 Hz.
  render() {
    const {
      onChange
    } = this.props;
    return React.createElement("div", null, onChange ? React.createElement(EventListener, {
      target: "window",
      onResize: this.handleResize
    }) : null, React.createElement("div", {
      style: styles,
      ref: node => {
        this.node = node;
      }
    }));
  }

}

ScrollbarSize.propTypes = process.env.NODE_ENV !== "production" ? {
  onChange: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired
} : {};
export default ScrollbarSize;