// actions creators by user
import fetch from 'isomorphic-fetch';

export const selectSubreddit = (subreddit) => ({
    type: 'SELECT_SUBREDDIT',
    subreddit
});

export const invalidateSubreddit = (subreddit) => ({
    type: 'INVALIDATE_SUBREDDIT',
    subreddit
});

// actions creators by network
export const requestPosts = (subreddit) => ({
    type: 'REQUEST_POSTS',
    subreddit
});

export const receivePosts = (subreddit, json) => ({
    type: 'RECEIVE_POSTS',
    subreddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now(),
});

export const fetchPosts = (subreddit) => {
    return (dispatch) => {
        dispatch(requestPosts(subreddit));
        return fetch(`https://www.reddit.com/r/${subreddit}.json`)
            .then(response => response.json())
            .then(json => dispatch(receivePosts(subreddit, json)));
    }
}

export const shouldFetchPosts = (state, subreddit) => {
    const posts = state.postsBySubreddit[subreddit];
    if (!posts) {
        return true;
    } else if (posts.isFetching) {
        return false;
    } else {
        return posts.didInvalidate;
    }
}

export const fetchPostsIfNeeded = (subreddit) => {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            return dispatch(fetchPosts(subreddit));
        } else {
            return Promise.resolve();
        }
    }
}