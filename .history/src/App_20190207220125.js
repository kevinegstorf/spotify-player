import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import OneGraphApolloClient from "onegraph-apollo-client";
import OneGraphAuth from "onegraph-auth";
import React, { Component } from "react";

const APP_ID = "4b1a8654-2b1f-46ef-bb5e-a3424c2a7003";

const GET_SPOTIFY = gql`
  query {
    spotify {
      me {
        id
        email
        images {
          height
          url
        }
        playlists {
          id
          name
          images {
            url
          }
        }
        product
        followers {
          total
        }
      }
    }
  }
`;

class App extends Component {
  state = {
    isLoggedIn: false
  };

  constructor(props) {
    super(props);
    this._oneGraphAuth = new OneGraphAuth({
      appId: APP_ID
    });
    this._oneGraphClient = new OneGraphApolloClient({
      oneGraphAuth: this._oneGraphAuth
    });
  }

  _authWithSpotify = async () => {
    await this._oneGraphAuth.login("spotify");
    // const isLoggedIn = await this._oneGraphAuth.isLoggedIn("spotify");
    this.setState({ isLoggedIn: true });
  };

  _authLogoutWithSpotify = async () => {
    await this._oneGraphAuth.logout("spotify");
    this.setState({ isLoggedIn: false });
  };

  componentDidMount() {
    this._oneGraphAuth
      .isLoggedIn("spotify")
      .then(isLoggedIn => this.setState({ isLoggedIn }));
  }

  render() {
    console.log("GET_SPOTIFY :", GET_SPOTIFY.data);
    return (
      {isLoggedIn ? <h1>hello</h1> : <h1>Hello</h1>}
      <div className="App">
        <div className="App-intro">
          <button onClick={this._authLogoutWithSpotify}>Log out</button>
          <Query query={GET_SPOTIFY}>
            {({ loading, error, data }) => {
              if (loading) return <div>Loading...</div>;
              if (error)
                return (
                  <button
                    style={{ fontSize: 18 }}
                    onClick={this._authWithSpotify}
                  >
                    Login with Spotify
                  </button>
                );
              return (
                <div>
                  <h1>
                    username: {data.spotify.me.id}
                    <br />
                    <span>Followers: {data.spotify.me.followers.total}</span>
                  </h1>
                  <img
                    alt={data.spotify.me.id}
                    src={data.spotify.me.images[0].url}
                  />
                  <div>
                    {data.spotify.me.playlists.map(list => {
                      console.log(list.images[0].url);
                      return (
                        <div key={list.id}>
                          <div>{list.name}</div>
                          <img alt={list.name} src={list.images[0].url} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default App;
