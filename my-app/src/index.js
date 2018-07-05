import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Header extends Component {
    render () {
        return (
            <div>
                <Title/>
            </div>
        )
    }
}
class Title extends Component {
    render () {
        return (
            <h1>React title 小书</h1>
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
ReactDOM.render(
    <Wrapper />,
    document.getElementById('root')
)
