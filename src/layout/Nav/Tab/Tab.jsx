import React, { Component } from 'react';
import styles from '../Tab.module.css';

class Tab extends Component {
    render() {
        return (
            <div className={styles.tab + ' ' + (this.props.active ? styles.active : '')}>
                <span>{this.props.children}</span>
            </div>
        )
    }
}
export { Tab };