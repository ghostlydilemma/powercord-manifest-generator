import React, { Component } from 'react';
import { Header } from "./Header";
import { GenTab } from "../Tab/GenTab";
import style from './Header.module.css';

class GeneratorHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: 'plugin'
        };
    }

    render() {
        return (
            <Header>
                <span className={style.logo}>Powercord Manifest Generator</span>
                <div className={style.tabHolder}>
                    <GenTab active={this.state.toggled === 'plugin'} gen="plugin">Plugin</GenTab>
                    <GenTab active={this.state.toggled === 'theme'} gen="theme">Theme</GenTab>
                    <GenTab active={this.state.toggled === 'info'} gen="info">Info</GenTab>
                </div>
            </Header>
        )
    }

    switchTheme(theme) {
        this.setState({
            toggled: theme
        })
        if (theme === 'light') {
            document.body.classList.add('light')
            document.body.classList.remove('revamped')
        } else if (theme === 'revamped') {
            document.body.classList.remove('light')
            document.body.classList.add('revamped')
        } else {
            document.body.classList.remove('light')
            document.body.classList.remove('revamped')
        }
    }
}
export { GeneratorHeader };