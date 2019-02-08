import React, { Component } from "react";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import OneGraphApolloClient from "onegraph-apollo-client";
import OneGraphAuth from "onegraph-auth";
import { config } from "./config";
import SpotifyAuth from "./components/SpotifyAuth";

const APP_ID = config.OneGraph;

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

  _authLoginWithSpotify = async () => {
    await this._oneGraphAuth.login("spotify");
    this.setState({ isLoggedIn: true });
  };

  _authLogoutWithSpotify = async () => {
    await this._oneGraphAuth.logout("spotify");
    this.setState({ isLoggedIn: false });
  };

  componentDidMount() {
    this._oneGraphAuth = new OneGraphAuth({
      appId: APP_ID
    });
    this._oneGraphClient = new OneGraphApolloClient({
      oneGraphAuth: this._oneGraphAuth
    });
    this._oneGraphAuth
      .isLoggedIn("spotify")
      .then(isLoggedIn => this.setState({ isLoggedIn }));
  }

  render() {
    console.log("GET_SPOTIFY :", GET_SPOTIFY.data);
    return (
      <div className="App">
        {this.state.isLoggedIn ? (
          <div className="App-intro">
            <SpotifyAuth clickHandler={this._authLogoutWithSpotify}>
              Log Out
            </SpotifyAuth>
            <Query query={GET_SPOTIFY}>
              {({ loading, error, data }) => {
                if (loading) return <div>Loading...</div>;
                if (error) return <div>{error}</div>;
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
        ) : (
          <SpotifyAuth clickHandler={this._authLoginWithSpotify}>
            Log In
          </SpotifyAuth>
        )}
      </div>
    );
  }
}

export default App;
