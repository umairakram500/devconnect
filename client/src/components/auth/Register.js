import React, { Component } from "react";
import propTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import InputFieldGroup from "../comment/InputFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form onSubmit={this.onSubmit.bind(this)}>
                <InputFieldGroup
                  name="name"
                  onChange={this.onChange}
                  value={this.state.name}
                  placeholder="Name"
                  error={errors.name}
                />

                <InputFieldGroup
                  name="email"
                  onChange={this.onChange}
                  value={this.state.email}
                  placeholder="Email Address"
                  error={errors.email}
                  info="This site uses Gravatar so if you want a profile image, use
                  a Gravatar email"
                />

                <InputFieldGroup
                  name="password"
                  onChange={this.onChange}
                  value={this.state.password}
                  placeholder="Password"
                  error={errors.password}
                />
                <InputFieldGroup
                  name="password2"
                  onChange={this.onChange}
                  value={this.state.password2}
                  placeholder="Confirm Password"
                  error={errors.password2}
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: propTypes.func.isRequired,
  auth: propTypes.object.isRequired,
  errors: propTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
