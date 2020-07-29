import React, { Component } from 'react';
import styles from './Header.module.css';

class Header extends Component {
    render() {
        console.log(this, this.props.short)
        return (
            <nav className={styles.nav + (this.props.short ? ' ' + styles.short : '')}>
                {this.props.children}
            </nav >
        )
    }
}
export { Header };