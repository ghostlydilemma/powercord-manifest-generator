import React, { Component } from 'react';
import { Tab } from "./Tab";

class ThemeTab extends Component {
    render() {
        return (
            <div onClick={this.props.onClick}>
                <Tab active={this.props.active}>{this.props.children}</Tab>
            </div>
        )
    }
}
export { ThemeTab };