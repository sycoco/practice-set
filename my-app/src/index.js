import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Header extends Component {
    render () {
        return (
            <div>
                <Title/>
                <LikeButton wordings={{likedText: '已赞1', unlikedText: '赞2'}}
                            onClick={() => console.log('Click on like button!')}/>
            </div>
        )
    }
}
class Title extends Component {
    handleClickOnTitle (word,e) {
        console.log(this,word);
    }
    render () {
        return (
            <h1 onClick={this.handleClickOnTitle.bind(this,'hello')}>React title 小书</h1>
        )
    }
}
class Main extends Component {
    render () {
        return (
            <p>this is main</p>
        )
    }
}
class Footer extends Component {
    render () {
        return (
            <p>this is Footer</p>
        )
    }
}
class Wrapper extends Component {
    render(){
        return(
            <div>
                <Header/>
                <Main/>
                <Footer/>
            </div>
        )
    }
}
class LikeButton extends Component {
    constructor () {
        super();
        this.state = { isLiked: false , isSelected: false}
    }

    handleClickOnLikeButton () {
        this.setState({
            isLiked: !this.state.isLiked,
            isSelected: !this.state.isSelected
        });
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render () {
        const likedText = this.props.likedText || '取消';
        const unlikedText = this.props.unlikedText || '点赞';
        const wordings = this.props.wordings || {
            likedText: '取消',
            unlikedText: '点赞'
        }
        return (
            <button onClick={this.handleClickOnLikeButton.bind(this)}>
                {this.state.isLiked ? wordings.likedText: wordings.unlikedText} 👍
                {this.state.isSelected ? '选中' : '未选中'}
            </button>
        )
    }
}
ReactDOM.render(
    <Header />,
    document.getElementById('root')
);
