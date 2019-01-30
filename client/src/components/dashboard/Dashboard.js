import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { getCurrentProfile } from "../../actions/profileActions";

class Dashboard extends Component {
  componentDidMount() {
    // if (!this.props.auth.isAuthenticated) {
    //   this.props.history.push("/dashboard");
    // }
    this.props.getCurrentProfile();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    let DashboardContent;
    if (profile === null || loading) {
      DashboardContent = <h4>Loading...</h4>;
    } else {
      DashboardContent = <h4>Hello!</h4>;
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="dispaly-h4">Dashboard</div>
              {DashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
