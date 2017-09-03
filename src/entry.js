'use strict';

const React = require("react");
const ReactDOM = require("react-dom");
const {PlaidLink} = require("./PlaidLink");
const PropTypes = require("prop-types");

class LinkButton extends React.Component {

    openLink() {
        this.context.plaidLinkOpen();
    }

    render() {
        return <button onClick={this.openLink.bind(this)}>Show Link</button>
    }
}

LinkButton.contextTypes = {
    plaidLinkOpen: PropTypes.func.isRequired,
};

class App extends React.Component {

    handleOnSuccess(token, metadata) {
        console.log("link: success got token: " + token, metadata);
    }

    handleOnExit() {
        console.log('link: user exited');
    }

    handleOnLoad() {
        console.log('link: loaded');
    }

    render() {
        return (
            <div>
                <h2>Sample App</h2>
                <PlaidLink
                    autoOpen={false}
                    clientName="Plaid Client"
                    env="sandbox"
                    product={["auth"]}
                    publicKey="test_key"
                    selectAccount={true}
                    onSuccess={this.handleOnSuccess}
                    onExit={this.handleOnExit}
                    onLoad={this.handleOnLoad}
                    loadingRender={()=><div>Loading Link... <img src="http://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif"/></div>}
                    >
                    {/* This example renders a child LinkButton that calls the plaidLinkOpen context function. Often you probably just want autoOpen=true */}
                    <LinkButton/>
                </PlaidLink>
            </div>
        );

    }
}

ReactDOM.render(<App />, document.getElementById('root'));
