import React from "react";
import Split from "grommet/components/Split";
import Article from "grommet/components/Article";
import Section from "grommet/components/Section";
import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";
import Anchor from "grommet/components/Anchor";
import Layer from "grommet/components/Layer";
import Headline from "grommet/components/Headline";
import FormField from "grommet/components/FormField";
import Form from "grommet/components/Form";
import Button from "grommet/components/Button";
import Footer from "grommet/components/Footer";
import Image from "grommet/components/Image";
import LoginIcon from "grommet/components/icons/base/Login";
import userStore from "../../stores/user";
import LoadingOverlay from "../../components/LoadingOverlay";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { resetPassword } from "../../api";
import appStore from "../../stores/app";

@observer
export default class LoginScreen extends React.Component {
  @observable
  layerOpen = false;

  @observable
  passwordReseting = false;

  _toggleLayer = () => {
    this.layerOpen = !this.layerOpen;
  };

  _resetPassword = () => {
    this.passwordReseting = true;
    resetPassword({ email: this._email }).then(({ data }) => {
      if (data.success) {
        appStore.notify({
          status: "ok",
          message: "Check your email to continue the password reset process"
        });
        this._toggleLayer();
        this.passwordReseting = false;
      } else {
        appStore.notify({
          status: "critical",
          message:
            "Your application isn't accepted or the email provided doesn't exist."
        });
        this.passwordReseting = false;
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();
    userStore.login({ username: this._username, password: this._password });
  };

  renderForm() {
    return (
      <Form pad="medium" onSubmit={this.onSubmit}>
        <FormField label="USJ Email" error={userStore.loginError}>
          <input
            type="email"
            required
            onChange={e => (this._username = e.target.value)}
          />
        </FormField>
        <FormField label="Password" error={userStore.loginError}>
          <input
            type="password"
            required
            onChange={e => (this._password = e.target.value)}
          />
        </FormField>
        <Box pad={{ vertical: "medium" }} align="center">
          <Anchor label="forgot my password" onClick={this._toggleLayer} />
        </Box>

        <Box pad={{ horizontal: "medium" }} margin={{ top: "small" }}>
          <Button icon={<LoginIcon />} label="Login" primary type="submit" />
        </Box>
        <LoadingOverlay loading={userStore.isLogging} />
      </Form>
    );
  }

  renderLayer() {
    if (this.layerOpen)
      return (
        <Layer align="right" closer={true} onClose={this._toggleLayer}>
          <Sidebar size="medium">
            <Box pad={{ vertical: "medium" }}>
              <Headline>Forgot Password?</Headline>
              <Headline size="small">
                Please enter your email, and you'll recieve a link to reset your
                password
              </Headline>
            </Box>
            <Box pad={{ vertical: "large" }} flex>
              <FormField label="USJ Email" error={userStore.loginError}>
                <input
                  type="email"
                  required
                  onChange={e => (this._email = e.target.value)}
                />
              </FormField>
              <Box pad={{ horizontal: "medium" }} margin={{ top: "small" }}>
                <Button
                  fill
                  label="Send Reset Link"
                  primary
                  onClick={this._resetPassword}
                />
              </Box>
            </Box>

            <LoadingOverlay loading={this.passwordReseting} />
          </Sidebar>
        </Layer>
      );

    return null;
  }

  render() {
    return (
      <Split flex="left">
        <Article separator="right" colorIndex="accent-2">
          <Section full>
            <Box />
          </Section>
        </Article>
        <Sidebar full size="large" align="center" justify="between">
          <span />
          <Image src={require("../../assets/images/logo.png")} />
          {this.renderForm()}
          <span />
          <span />
          <Footer
            size="small"
            direction="row"
            align="center"
            pad={{ horizontal: "medium", vertical: "small" }}
          >
            <span className="secondary">@ 2018 XonBoard</span>
          </Footer>
          {this.renderLayer()}
        </Sidebar>
      </Split>
    );
  }
}
