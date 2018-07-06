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
        const users = [
            { username: 'Jerry', age: 21, gender: 'male' },
            { username: 'Tomy', age: 22, gender: 'male123' },
            { username: 'Lily', age: 19, gender: 'female' },
            { username: 'Lucy', age: 20, gender: 'female' }
        ];
        return (
            <div>
                {users.map((user) => {
                    return (
                        <div>
                            <div>姓名：{user.username}</div>
                            <div>年龄：{user.age}</div>
                            <div>性别：{user.gender}</div>
                            <hr />
                        </div>
                    )
                })}
            </div>
        )
    }
}
ReactDOM.render(
    <LikeButton />,
    document.getElementById('root')
);
