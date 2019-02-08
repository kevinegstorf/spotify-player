import React from 'react';

const SpotifyAuth = ({clickHandler, children}) => {
    return (
        <button onClick={clickHandler}clickHandler>{children}</button>
    );
};

export default SpotifyAuth;