import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import style from './Tab.module.css'

class TabHolder extends Component {
    static propTypes = {
        children: PropTypes.instanceOf(Array).isRequired
    }

    constructor(props) {
        super(props)

        this.state = {
            activeTab: this.props.children[0].props.label
        }
    }

    onClickTabItem = (tab) => {
        this.setState({ activeTab: tab })
    }

    render() {
        const {
          onClickTabItem,
          props: {
            children,
          },
          state: {
            activeTab,
          }
        } = this

        return (
            <div className={style.tabHolder}>
              {children.map((child) => {
                const { label } = child.props
              })}
            </div>
        ) 
    }
}