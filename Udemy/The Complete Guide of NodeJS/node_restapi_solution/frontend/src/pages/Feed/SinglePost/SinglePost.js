import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
    state = {
        title: '',
        author: '',
        date: '',
        image: '',
        content: '',
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;

        // REST API
        // fetch('http://localhost:8080/feed/post/' + postId, {
        //     headers: { Authorization: 'Bearer ' + this.props.token },
        // })

        const graphqlQuery = {
            query: `
                query ReadPost($postId: ID!){
                    readPost(id: $postId) {
                        title
                        content
                        imageUrl
                        creator {
                            name
                        }
                        createdAt
                    }
                }
            `,
            variables: {
                postId: postId,
            },
        };

        fetch('http://localhost:8080/graphql', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + this.props.token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphqlQuery),
        })
            .then((res) => {
                // REST API
                // if (res.status !== 200) {
                //     throw new Error('Failed to fetch status');
                // }
                return res.json();
            })
            .then((resData) => {
                if (resData.errors) {
                    throw new Error('Fetching post failed.');
                }

                this.setState({
                    title: resData.data.readPost.title,
                    author: resData.data.readPost.creator.name,
                    image:
                        'http://localhost:8080/' +
                        resData.data.readPost.imageUrl,
                    date: new Date(
                        resData.data.readPost.createdAt
                    ).toLocaleDateString('en-US'),
                    content: resData.data.readPost.content,
                });

                // REST API
                // this.setState({
                //     title: resData.post.title,
                //     author: resData.post.creator.name,
                //     image: 'http://localhost:8080/' + resData.post.imageUrl,
                //     date: new Date(resData.post.createdAt).toLocaleDateString(
                //         'en-US'
                //     ),
                //     content: resData.post.content,
                // });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <section className="single-post">
                <h1>{this.state.title}</h1>
                <h2>
                    Created by {this.state.author} on {this.state.date}
                </h2>
                <div className="single-post__image">
                    <Image contain imageUrl={this.state.image} />
                </div>
                <p>{this.state.content}</p>
            </section>
        );
    }
}

export default SinglePost;
