import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Content extends React.Component {
    renderBookList(data) {
        let bookList = data.map((book) => {
            let readText;
            if (book.read) {
                readText = " pages, read"
            } else { readText = " pages, not read yet" }
            
            return (
                <li key={book.id}>{book.title + " by " + book.author
                + ", " + book.pages + readText}
                    <button id={book.id + 'read'} onClick={this.props.toggleRead()}>Read/Unread</button>
                    <button id={book.id + 'delete'} onClick={this.props.deleteBook()}>Delete</button>
                </li>
            )
        });
        return bookList;
    }
    render() {
        return (
            <ul className="book-list">
                {this.renderBookList(this.props.bookList)}
            </ul>
        )
    }
}

class BookForm extends React.Component {
    renderTextInput(inputID) {
        let inputType = (inputID === "pages") ? "number" : "text";

        return (
            <div className="input-container">
                <label htmlFor={inputID}>
                    {inputID[0].toUpperCase() + inputID.slice(1)}
                </label>
                <input 
                    type={inputType} 
                    id={inputID}
                    onChange={this.updateInput.bind(this)}
                />
                <span id={inputID + "-warning"} className="warning">{inputID[0].toUpperCase() + inputID.slice(1)} must be specified</span> 
            </div>
        );
    }

    updateInput(e) {
        const key = e.target.id;
        this.props.book[key] = e.target.value;
        if (key === "read") {
            this.props.book[key] = (this.props.book[key] === "true") ? true : false
        }
    }
    
    render() {
        return (
            <form className="book-form">
                {this.renderTextInput('title')}
                {this.renderTextInput('author')}
                {this.renderTextInput('pages')}
                <p>Is it read?</p>
                <input 
                    type="radio" 
                    id="read"
                    onClick={this.updateInput.bind(this)}
                    value="true" 
                    name="read" 
                    defaultChecked
                />
                <label htmlFor="true">Yes</label>
                <input
                    type="radio"
                    id="read"
                    onClick={this.updateInput.bind(this)}
                    value="false"
                    name="read"
                />
                <label htmlFor="false">No</label>
                <button type='button' onClick={this.props.onChange()} >Save</button>
                <button type='button' onClick={this.props.onClear()} >Cancel</button>
            </form>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            book: {
                id: 0,
                title: "",
                author: "",
                pages: "",
                read: true
            },
            index: 0
        };
        this.baseBook = {
                id: 0,
                title: "",
                author: "",
                pages: "",
                read: true
        }
    }
    showform() {
        const form = document.querySelector('.book-form');
        form.classList.toggle("show-form")
    }

    toggleRead(e) {
        let theBook = this.state.books.find(book => String(book.id + 'read') === e.target.id);
        let newArray = this.state.books.slice()
        theBook.read = !theBook.read;
        newArray.splice(newArray.indexOf(theBook), 1, theBook)
        this.setState({
            books: newArray
        })
    }

    deleteBook(e) {
        let theBook = this.state.books.find(book => String(book.id + 'delete') === e.target.id);        
        let newArray = this.state.books.slice()
        newArray.splice(newArray.indexOf(theBook), 1)
        this.setState({
            books: newArray
        })
    }

    clearForm() {
        const form = document.querySelector('.book-form');
        form.classList.toggle("show-form")
        form.reset();
        this.setState({
            book: this.baseBook
        });
    }

    validateForm() {
        //make sure nothing is null
        let book = Object.assign({}, this.state.book);
        const keys = Object.keys(this.state.book);
        let err;

        //check for missing input
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            if (book[key] === "" || book[key] === undefined) {
                let id = key + "-warning"
                let warning = document.getElementById(id);
                warning.setAttribute("class", "show-warning")
                err = true;
            }
        }
        if (err) { return }
        this.handleSubmit(book);
        this.clearForm();
    }

    handleSubmit(data) {
        let newArray = this.state.books.slice();
        newArray.push(data);
        console.log(newArray);
        let newIndex = this.state.index + 1;
        this.setState({
            index: newIndex
        })
        this.baseBook.id = newIndex;
        this.setState({
            books: newArray
        });
    }

    render() {
        return (
            <div>
                <h1>Library</h1>
                <Content 
                    bookList={this.state.books}
                    toggleRead={() => this.toggleRead.bind(this)}
                    deleteBook={() => this.deleteBook.bind(this)}
                />
                <button onClick={this.showform.bind(this)}>New Book</button>
                <BookForm 
                    onChange={() => this.validateForm.bind(this)}
                    onClear={() => this.clearForm.bind(this)}
                    book={this.state.book}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);