import React from "react";
import Box from "grommet/components/Box";
import Headline from "grommet/components/Headline";
import Form from "grommet/components/Form";
import FormField from "grommet/components/FormField";
import Button from "grommet/components/Button";
import Anchor from "grommet/components/Anchor";
import Spinner from "grommet/components/icons/Spinning";
import WarningIcon from "grommet/components/icons/base/Alert";
import CheckIcon from "grommet/components/icons/base/Checkmark";
import HomeIcon from "grommet/components/icons/base/Home";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { checkToken } from "../../api";
import validatorjs from "validatorjs";
import MobxReactForm from "mobx-react-form";
import LoadingOverlay from "../../components/LoadingOverlay";
import { confirmApplication } from "../../api";
import appStore from "../../stores/app";

@observer
export default class ConfirmRegistration extends React.Component {
  @observable
  didCheckToken = false;

  @observable
  isTokenValid = false;

  name = "";

  componentDidMount() {
    this._checkToken();
  }

  _checkToken = () => {
    const token = this.props.match.params.token;
    formStore.token = token;
    checkToken({ token })
      .then(({ data }) => {
        this.isTokenValid = data.valid;
        this.name = data.name;
        this.didCheckToken = true;
      })
      .catch(e => this._checkToken());
  };

  _onSubmit = e => {
    form.onSubmit(e);
  };

  renderBody() {
    if (this.didCheckToken) {
      if (formStore.isSubmitted)
        return (
          <Box margin="large" align="center" justify="center">
            <Box margin="small" pad="small">
              <CheckIcon
                responsive={false}
                size="large"
                colorIndex="success"
                type="control"
              />
            </Box>
            <Headline strong align="center" size="small">
              Your new password have been set
            </Headline>
            <Headline align="center" size="small">
              You will be notified when your account is ready for use
            </Headline>
            <Anchor
              label="Continue"
              icon={<HomeIcon />}
              primary
              method="replace"
              path="/"
            />
          </Box>
        );
      if (this.isTokenValid)
        return (
          <React.Fragment>
            <Box
              justify="center"
              align="center"
              style={{ position: "relative" }}
            >
              <Headline margin="large" align="center" size="small">
                Hello <strong>{this.name}</strong> please enter password in
                order to proceed
              </Headline>
              <Form onSubmit={this._onSubmit}>
                <FormField
                  label={form.$("password").label}
                  error={form.$("password").error}
                >
                  <input {...form.$("password").bind()} type="password" />
                </FormField>
                <FormField
                  label={form.$("passwordConfirm").label}
                  error={form.$("passwordConfirm").error}
                >
                  <input
                    {...form.$("passwordConfirm").bind()}
                    type="password"
                  />
                </FormField>
                <Box align="center" justify="center" pad="large">
                  <Button type="submit" label="Proceed" fill primary />
                </Box>
              </Form>
              <LoadingOverlay
                message="Please wait, submitting your new password..."
                loading={formStore.isLoading}
              />
            </Box>
          </React.Fragment>
        );
      return (
        <Box margin="large" align="center" justify="center">
          <Box margin="small" pad="small">
            <WarningIcon
              responsive={false}
              size="large"
              colorIndex="plain"
              type="control"
            />
          </Box>
          <Headline strong align="center" size="small">
            Token provided doesn't seem to be valid.
          </Headline>
          <Headline align="center" size="small">
            Make sure it wasn't used, or contact one of the mooderators.
          </Headline>
        </Box>
      );
    }

    return (
      <Box pad="large" align="center" justify="center">
        <Headline align="center" size="small">
          Please wait...
        </Headline>
        <Headline align="center" size="small" strong>
          Checking if your token is valid
        </Headline>
        <Spinner size="large" />
      </Box>
    );
  }

  render() {
    return (
      <Box full colorIndex="brand" appCentered align="center" justify="center">
        <Box colorIndex="light-1" align="center" pad={{ horizontal: "large" }}>
          {this.renderBody()}
        </Box>
      </Box>
    );
  }
}

class FormStore {
  @observable
  isSubmitted = false;

  @observable
  isLoading = false;

  @observable
  token = "";
}

const formStore = new FormStore();

const plugins = { dvr: validatorjs };

const fields = [
  {
    name: "password",
    label: "Password",
    placeholder: "Insert Password",
    rules: "required|string|between:5,25"
  },
  {
    name: "passwordConfirm",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    rules: "required|string|same:password"
  }
];

const hooks = {
  onSuccess(form) {
    formStore.isLoading = true;
    confirmApplication({
      token: formStore.token,
      password: form.values().password
    }).then(resp => {
      formStore.isSubmitted = true;
    });
  },
  onError(form) {
    alert("Form has errors!");
    // get all form errors
    console.log("All form errors", form.errors());
  }
};

const form = new MobxReactForm({ fields }, { plugins, hooks });
