import React from 'react';

import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';

import infer from '../utils/infer';

import {getHash} from '../utils/index';

import {dispatch, connect} from 'grax-react';

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.onhashchange = function () {
            dispatch('todos::changeFilter', getHash());
        }        
    }

    componentWillReceiveProps(nextProps) {
        localStorage.setItem('todo-data', JSON.stringify(nextProps.list));
    }

    render() {
        console.log(this.props)
        // 从初始props推断出新的props
        let inferredProps = infer(this.props.list, this.props.filter);

        return (
            <div>
                <Header />
                {this.props.list.length > 0
                && <Main {...inferredProps} {...this.props} />}
                {this.props.list.length > 0
                && <Footer {...inferredProps} />}
            </div>
        )
    }
}

function Loading() {
    return (<h1>loading...</h1>);
}

export default connect('todos', TodoApp, Loading);

