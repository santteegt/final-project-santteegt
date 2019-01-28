import React, { Component, PropTypes } from 'react'
import { connect } from "react-redux";

import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';

import ReactMarkdown from 'react-markdown/with-html'
// import { Editor, EditorState } from 'draft-js';
// import 'draft-js/dist/Draft.css'
import RichTextEditor from 'react-rte';

import { getIPFS, encodeData, getBytes32FromMultiash, getMultihashFromBytes32 } from '../../util/ipfs'

const mapStateToProps = state => {
  return { networkId: state.user.data.networkId };
};
// + `<img src="https://cdn-images-1.medium.com/max/1600/1*u90cJ3k-ZXvLlgWg1apBEg.png" alt="Ethereum Image">, \n`
// + `![alt text][logo]`
// + `![alt text](https://cdn-images-1.medium.com/max/1600/1*u90cJ3k-ZXvLlgWg1apBEg.png Ethereum Image)`
// + `[logo]: https://cdn-images-1.medium.com/max/1600/1*u90cJ3k-ZXvLlgWg1apBEg.png Ethereum Image`
var markdownExample = `### Post 1

This block of Markdown contains <a href="https://en.wikipedia.org/wiki/HTML">HTML</a>

*This is a blog post of interest*

![alt text](https://cdn-images-1.medium.com/max/1600/1*u90cJ3k-ZXvLlgWg1apBEg.png)`
    //
    //
    // ## Topic of Interest
    // This block of Markdown contains <a href="https://en.wikipedia.org/wiki/HTML">HTML</a>
    // Will require the <code>html-parser</code> AST plugin to be loaded, in addition to setting the
    // <code class="prop">escapeHtml</code> property to false.
    // `

class Publisher extends Component {

    // static propTypes = {
    //     onChange: PropTypes.func
    // };

    state = {
        tab: 0,
        newPostHeadImgURI: "https://blog.sketchfab.com/wp-content/themes/blog-sketchfab/img/thumb-placeholder.png",
        newPost: RichTextEditor.createValueFromString(markdownExample, 'markdown'),
        markdown: markdownExample,
        processing: null
    };

    handleChange = (event, tab) => {
        this.setState({ tab });
    };

    onChange = (newPost) => {
        this.setState({newPost});
        // if (this.props.onChange) {
        //   // Send the changes up to the parent component as an HTML string.
        //   // This is here to demonstrate using `.toString()` but in a real app it
        //   // would be better to avoid generating a string on each change.
        //   this.props.onChange(
        //     value.toString('html')
        //   );
        // }
    };

    preview = (event) => {
        this.setState({markdown: this.state.newPost.toString('markdown')})
    };

    post = (event) => {
        // console.log(this.state.newPost.toString('markdown'))

        let data = {timestamp: Date(), post: this.state.newPost.toString('markdown')}
        const ipfs = getIPFS()
        let content = encodeData(ipfs, JSON.stringify(data))
        this.setState({processing: 'PROCESSING... PLEASE WAIT'})
        ipfs.add(content, (err, res) => {
            this.setState({processing: undefined})
            alert(`Post stored on IPFS: Visit https://ipfs.infura.io/ipfs/${res[0].hash}`)
            const mh = getBytes32FromMultiash(res[0].hash)
            // console.log(mh)
            alert(`This should be stored in the contract {digest:${mh.digest}, hashFunction:${mh.hashFunction}, size:${mh.size}`)
            this.setState({tab: 0, newPost: RichTextEditor.createValueFromString(markdownExample, 'markdown')})
        })
    }

  constructor(props, { authData }) {
    super(props)
    authData = this.props
    // this.onChange = (editorState) => this.setState({editorState})
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //     this.setState({newPost: RichTextEditor.createValueFromString(this.state.markdown, 'markdown')})
  // };

  render() {
    const { tab, markdown, newPost, processing } = this.state;
    return(
        <div className="main-container">
            <h1>Publisher</h1>
            <Tabs value={tab} onChange={this.handleChange}>
                <Tab label="Posts" />
                <Tab label="New Post" />
                <Tab label="Subscribers" />
            </Tabs>
            {tab === 1 ? (
                <div>
                    <h2>Posts</h2>
                    <h3>You do not have any article posted yet </h3>
                </div>
            ):null}
            {tab === 0 ? (
                <div>
                    <div>
                        <Typography gutterBottom variant="headline" component="h2">
                            Write a new post {processing}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={(event) => this.preview(event)}>
                        Preview
                        </Button>
                        <Button variant="contained" color="secondary" onClick={(event) => this.post(event)}>
                        Post
                        </Button>

                    </div>
                    <div>
                        <TextField
                          id="standard-name"
                          label="Head Image URL"
                          value={this.state.newPostHeadImgURI}
                          margin="normal"
                        />
                    </div>
                    <div>
                        <Grid container spacing={24} style={{padding: 24}}>
                            <Grid item xs={12} sm={6} lg={6} xl={6}>
                                <RichTextEditor
                                    value={newPost}
                                    onChange={this.onChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={6} xl={6}>
                                <ReactMarkdown
                                  source={markdown}
                                  escapeHtml={false}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            ):null}
            {tab === 2 ? (
                <h2>Subscribers</h2>
            ):null}
        </div>
    )
  }
}

const publisher = connect(mapStateToProps)(Publisher);
export default publisher;
