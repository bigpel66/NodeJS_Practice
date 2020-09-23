import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

class BlogShow extends Component {
    componentDidMount() {
        this.props.fetchBlog(this.props.match.params._id);
    }

    /* Added To Show Image */
    renderImage() {
        if (this.props.blog.imageUrl) {
            return (
                <img
                    alt="alt"
                    src={
                        'https://s3-ap-northeast-2.amazonaws.com/bigpel66-blogster/' +
                        this.props.blog.imageUrl
                    }
                />
            );
        }
    }

    render() {
        if (!this.props.blog) {
            return '';
        }

        const { title, content } = this.props.blog;

        return (
            <div>
                <h3>{title}</h3>
                <p>{content}</p>
                {/* Added To Handle Image */}
                {this.renderImage()}
            </div>
        );
    }
}

function mapStateToProps({ blogs }, ownProps) {
    return { blog: blogs[ownProps.match.params._id] };
}

export default connect(mapStateToProps, { fetchBlog })(BlogShow);
