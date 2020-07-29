import React, { Component } from 'react';
import { Tab } from "./Tab";

class GenTab extends Component {
    render() {
        return (
            <div>
                <Tab>{this.props.children}</Tab>
            </div>
        )
    }
}
export { GenTab };