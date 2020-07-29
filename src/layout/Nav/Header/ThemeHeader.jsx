import React, { Component } from 'react';
import { Header } from "./Header";
import { ThemeTab } from "../Tab/ThemeTab";
import { Tab } from "../Tab/Tab";
import style from './Header.module.css';

class ThemeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: 'dark',
            dark: true,
            light: false,
            revamped: false
        };
    }


    render() {
        return (
            <Header short={true}>
                <div className={style.tabHolder}>
                    {/* <Tab active={this.state.dark}>Dark Theme</Tab>
                    <Tab active={this.state.light}>Light Theme</Tab>
                    <Tab active={this.state.revamped}>Discord Revamped</Tab> */}
                    <ThemeTab active={this.state.toggled === 'dark'} onClick={() => this.switchTheme('dark')}>Dark Theme</ThemeTab>
                    <ThemeTab active={this.state.toggled === 'light'} onClick={() => this.switchTheme('light')}>Light Theme</ThemeTab>
                    <ThemeTab active={this.state.toggled === 'revamped'} onClick={() => this.switchTheme('revamped')}>Discord Redesign</ThemeTab>
                </div>
            </Header>
        )
    }

    switchTheme(theme) {
        const classlist = document.body.classList;
        this.setState({
            toggled: theme
        })
        if(!classlist.contains(theme)) {
            classlist.forEach(domClass => {
                classlist.remove(domClass)
            })

            classlist.add(theme)
        }
    }
}
export { ThemeHeader };