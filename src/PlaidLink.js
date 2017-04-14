'use strict';

const React = require('react');
const scriptLoader = require('react-async-script-loader').default;
const PropTypes = require('prop-types');

class PlaidLink extends React.Component {
  
  constructor() {
    super();
    this.state = {
      linkHandler: null,
      loaded: false,
      error: false,
      opened: false
    };

    this.handleLinkOnLoad = this.handleLinkOnLoad.bind(this);
    this.handleLinkOnExit = this.handleLinkOnExit.bind(this);

    this.openLink = this.openLink.bind(this);
  }

  handleLinkOnLoad() {
    this.setState({loaded: true}); 
    
    if (this.props.onLoad) {
      this.props.onLoad();
    }

    if (this.props.autoOpen) {
      this.setState({opened: true});
      this.state.linkHandler.open(this.props.institution || null);
    }
  }

  handleLinkOnExit() {
    this.setState({
      opened: false
    });
    if (this.props.onExit) {
      this.props.onExit()
    }
  }

  componentWillReceiveProps({isScriptLoaded, isScriptLoadSucceed}) {

    if (isScriptLoaded && !this.props.isScriptLoaded) {
      if (isScriptLoadSucceed) {
        const linkHandler = Plaid.create({
          apiVersion: 'v2',
          clientName: this.props.clientName,
          env: this.props.env,
          key: this.props.publicKey,
          onExit: this.handleLinkOnExit,
          onLoad: this.handleLinkOnLoad,
          onSuccess: this.props.onSuccess,
          product: this.props.product,
          selectAccount: this.props.selectAccount,
          token: this.props.token,
          webhook: this.props.webhook
        });

        this.setState({linkHandler});


      } else {
        console.error('There was an issue loading the link-initialize.js script');
        this.setState({
          linkHandler: null,
          loaded: false,
          error: true
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.state.linkHandler) {
      this.state.linkHandler.exit();
    }
  }

  openLink() {
    this.setState({opened: true});
    this.state.linkHandler.open(this.props.institution || null);
  }

  getChildContext() {
    return {
      plaidLinkOpen: this.openLink
    }
  }

  render() {

    if (!this.state.loaded) {
      
      if (this.state.error) {
        return this.props.errorRender ? this.props.errorRender() : null;
      }
      
      return this.props.loadingRender ? this.props.loadingRender() : null;
    }

    return <div>{this.props.children}</div>;
  }
};

PlaidLink.propTypes = {
  // Displayed once a user has successfully linked their account
  clientName: PropTypes.string.isRequired,

  // The Plaid API environment on which to create user accounts.
  // For development and testing, use tartan. For production, use production
  env: PropTypes.oneOf(['sandbox', 'development', 'production']).isRequired,

  // Open link to a specific institution, for a more custom solution
  institution: PropTypes.string,

  // The public_key associated with your account; available from
  // the Plaid dashboard (https://dashboard.plaid.com)
  publicKey: PropTypes.string.isRequired,

  // The Plaid product you wish to use, either auth or connect.
  product: PropTypes.arrayOf(PropTypes.oneOf(['auth', 'transaction', 'identity', 'income'])).isRequired,

  // Specify an existing user's public token to launch Link in update mode.
  // This will cause Link to open directly to the authentication step for
  // that user's institution.
  token: PropTypes.string,

  // Set to true to launch Link with the 'Select Account' pane enabled.
  // Allows users to select an individual account once they've authenticated
  selectAccount: PropTypes.bool,

  // Specify a webhook to associate with a user.
  webhook: PropTypes.string,

  // A function that is called when a user has successfully onboarded their
  // account. The function should expect two arguments, the public_key and a
  // metadata object
  onSuccess: PropTypes.func.isRequired,

  // A function that is called when a user has specifically exited Link flow
  onExit: PropTypes.func,

  // A function that is called when the Link module has finished loading.
  // Calls to plaidLinkHandler.open() prior to the onLoad callback will be
  // delayed until the module is fully loaded.
  onLoad: PropTypes.func,

  // Text to display in the button
  loadingRender: PropTypes.func,

  // Render on error
  errorRender: PropTypes.func,

  // Auto open link once loaded (default true)
  autoOpen: PropTypes.bool
};

PlaidLink.childContextTypes = {
  plaidLinkOpen: PropTypes.func.isRequired
};

PlaidLink.defaultProps = {
  autoOpen: true,
  institution: null,
  selectAccount: false
};

module.exports = scriptLoader(
  'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
)(PlaidLink);
