import React, { Component } from 'react'
import CommentInput from './CommentInput'
import CommentList from './CommentList'
import Clock from './Clock'

class CommentApp extends Component {
    constructor() {
        super();
        this.state = {
            comments: []
        }
    }
    handleSubmitComment (comment) {
        this.state.comments.push(comment);
        this.setState({
            comments: this.state.comments
        })
    }
    render() {
        return (
            <div className='wrapper'>
                <CommentInput onSubmit={this.handleSubmitComment.bind(this)}/>
                <CommentList comments={this.state.comments}/>
                <Clock></Clock>
            </div>
        )
    }
}

export default CommentApp
