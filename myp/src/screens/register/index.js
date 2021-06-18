import React from "react";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Form from "grommet/components/Form";
import Header from "grommet/components/Header";
import FormField from "grommet/components/FormField";
import Footer from "grommet/components/Footer";
import Button from "grommet/components/Button";
import Status from "grommet/components/icons/Status";
import RadioButton from "grommet/components/RadioButton";
import Label from "grommet/components/Label";
import Layer from "grommet/components/Layer";
import CheckIcon from "grommet/components/icons/base/Checkmark";
import appStore from "../../stores/app";
import formStore, {
  regStore
} from "../../stores/formValidators/applicationFormValidator";
import { observer } from "mobx-react";
import { values } from "mobx";
import router from "../../stores/router";
import LoadingOverlay from "../../components/LoadingOverlay";

import styled from "styled-components";

@observer
export default class RegisterScreen extends React.Component {
  componentDidMount() {
    // formStore.clear();
  }

  renderForm() {
    const fields = values(formStore.fields);
    const length = fields.length / 2;
    return (
      <React.Fragment>
        <Box flex>
          {fields.map((field, index) =>
            index < length ? (
              field.type === "nested" ? (
                <FormField
                  key={field.key}
                  label={field.label}
                  error={field.error}
                >
                  <Box
                    direction="horizontal"
                    pad={{ horizontal: "medium", vertical: "small" }}
                  >
                    {values(field.fields).map(subfield => (
                      <RadioButton
                        key={subfield.id}
                        {...subfield.bind({
                          // checked: subfield.value === field.value
                        })}
                      />
                    ))}
                  </Box>
                </FormField>
              ) : field.type === "date" ? (
                <FormField
                  key={field.key}
                  label={field.label}
                  error={field.error}
                >
                  <DateInput {...field.bind()} />
                </FormField>
              ) : (
                <FormField
                  key={field.key}
                  label={field.label}
                  error={field.error}
                >
                  <input {...field.bind()} />
                </FormField>
              )
            ) : null
          )}
        </Box>
        <Box flex>
          {fields.map((field, index) =>
            index > length ? (
              field.type === "nested" ? (
                <FormField
                  key={field.key}
                  label={field.label}
                  error={values(field.fields)[0].error}
                >
                  <Box
                    direction="row"
                    pad={{ horizontal: "medium", vertical: "small" }}
                  >
                    {values(field.fields).map(subfield =>
                      subfield.type === "hidden" ? (
                        <input {...subfield.bind()} ref={field.id} />
                      ) : (
                        <RadioButton
                          key={subfield.id}
                          {...subfield.bind()}
                          onChange={() => {
                            values(field.fields)[0].set(subfield.value);
                          }}
                        />
                      )
                    )}
                  </Box>
                </FormField>
              ) : field.type === "date" ? (
                <FormField
                  key={field.key}
                  label={field.label}
                  error={field.error}
                >
                  <DateInput {...field.bind()} />
                </FormField>
              ) : (
                <FormField
                  key={field.key}
                  label={field.label}
                  error={field.error}
                >
                  <input {...field.bind()} />
                </FormField>
              )
            ) : null
          )}
        </Box>
        <LoadingOverlay
          loading={regStore.isLoading}
          message="Please wait while we submit your application."
        />
      </React.Fragment>
    );
  }

  render() {
    const { onSubmit } = formStore;
    const { isMobile } = appStore;

    return (
      <Box
        colorIndex="light-1"
        full
        justify="between"
        align="center"
        pad="none"
      >
        <span />
        <Form style={{ width: "90%" }}>
          <Header>
            <Heading>Application</Heading>
            <Heading tag="h4" size="small" colorIndex="brand">
              Please fill all fields listed below
            </Heading>
          </Header>
          <Box direction="row">{this.renderForm()}</Box>
          <Box
            justify="end"
            direction="row"
            margin={{ vertical: "medium" }}
            pad={{ between: "medium" }}
          >
            {!isMobile ? (
              <Button
                secondary
                icon={<CheckIcon />}
                label="Back"
                onClick={router.goBack}
              />
            ) : null}
            <Button
              primary
              icon={<CheckIcon />}
              fill={isMobile}
              label="Submit"
              onClick={onSubmit}
            />
          </Box>
        </Form>
        {regStore.showSuccess?<Layer>
          <Box pad={{ vertical: "large",between:"medium" }}>
            <Box direction="row" pad={{between:"small"}} responsive={false}>
              <Status value="ok" size="large"/>{" "}
              <Label margin="none">
                Your application have been submitted to MYP Moderators, Please
                be patient, we will respond by email as soon as we can.
              </Label>
            </Box>
            <Box  direction="row" align="center" justify="end">
              <Button
                colorIndex="status-ok"
                align="right"
                icon={<CheckIcon />}
                label="Continue"
                onClick={regStore.fallBack}
              />
            </Box>
          </Box>
        </Layer>:null}
        <Footer pad={{ horizontal: "medium", vertical: "small" }}>
          © 2018 Youth Parlament
        </Footer>
      </Box>
    );
  }
}

const DateInput = styled.input`
  display: block !important;
  width: 100% !important;
  border: none !important;
  border-radius: 0px !important;
  font-size: 16px !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  padding: 6px 24px 11px !important;
  margin-bottom: -5px !important;

  ::-webkit-datetime-edit-text {
    color: red;
    padding: 0 0.3em;
  }
  ::-webkit-inner-spin-button {
    display: none;
  }
  ::-webkit-calendar-picker-indicator {
  }
  ::-webkit-clear-button {
    display: none;
  }
`;
