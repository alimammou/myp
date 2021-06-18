import { observable, action } from "mobx";
import MobxReactForm from "mobx-react-form";
import validatorjs from "validatorjs";
import { postUser } from "../../api";
import appStore from "../app";
import router from "../router";

class RegStore {
  @observable
  isLoading = false;

  @observable
  showSuccess = false;

  @action
  fallBack=()=>{
    router.goBack()
    this.showSuccess= false;
  }
}

export const regStore = new RegStore();

const rules = {
  telephone: {
    function: value => value.match(/^\d{2}\d{3}\d{3}$/),
    message: "The :attribute is not in the format XXXXXXXX."
  },
  usjEmail: {
    function: value =>
      value.match(/^[a-zA-Z0-9._%+-]+@+[a-zA-Z0-9._%+-]+.edu.lb$/),
    message: "This is not a valid USJ email."
  },
  radioGroup: {
    function: value => value.toString().length > 0,
    message: "You need to choose one of the given options."
  }
};

// ||
//       value.match(/^[a-zA-Z0-9._%+-]+@+usj.edu.lb$/) ||
//       value.match(/^[a-zA-Z0-9._%+-]+@+usj+[a-zA-Z0-9._%+-]+.edu.lb$/),

const plugins = {
  dvr: {
    package: validatorjs,
    extend: $validator => {
      Object.keys(rules).forEach(key =>
        $validator.register(key, rules[key].function, rules[key].message)
      );
    }
  }
};

const fields = {
  name: {
    name: "name",
    label: "Name",
    type: "text",
    rules: ["required", "string", "regex:/^[a-z ,.'-]+$/i", "min:7"]
  },
  email: {
    name: "email",
    label: "USJ Email",
    type: "email",
    rules: ["required", "email", "min:5","usjEmail"]
  },
  emailConfirm: {
    name: "confEmail",
    label: "Confirm USJ Email",
    type: "email",
    rules: ["required", "same:email"]
  },
  password:{
    name: "password",
    label: "Password",
    placeholder: "Insert Password",
    type:"password",
    rules: "required|string|between:5,25"
  },
  confPassword:{
    name: "passwordConfirm",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    type:"password",
    rules: "required|string|same:password"
  },
  birthday: {
    name: "birthDate",
    label: "Birth Date",
    type: "date",
    rules: ["required", "date"]
  },
  phone: {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    rules: ["required", "telephone"]
  },
  city: {
    name: "city",
    label: "City",
    type: "text",
    rules: ["required", "string", "regex:/^[a-zA-Z0-9 ,._%+-]+$/i", "min:3"]
  },
  faculty: {
    name: "faculty",
    label: "Faculty",
    type: "text",
    rules: ["required", "string", "regex:/^[a-zA-Z0-9 ,._%+-]+$/i", "min:3"]
  },
  campus: {
    name: "campus",
    label: "Campus",
    type: "text",
    rules: ["required", "string", "regex:/^[a-zA-Z0-9 ,._%+-]+$/i", "min:3"]
  },
  major: {
    name: "major",
    label: "Major",
    type: "text",
    rules: ["required", "string", "regex:/^[a-zA-Z0-9 ,._%+-]+$/i", "min:2"]
  },
  accomodationNeeded: {
    type: "nested",
    label: "Do you need accommodation in Beirut?",
    toValue: 1,
    fields: {
      result: {
        name: "accomodationNeeded",
        type: "hidden",
        rules: ["radioGroup"]
      },
      yesButton: {
        name: "accomodationNeeded",
        label: "Yes",
        value: true,
        type: "radio"
      },
      noButton: {
        name: "accomodationNeeded",
        label: "No",
        value: false,
        type: "radio"
      }
    }
  },
  didParticipate: {
    type: "nested",
    label: "Did you participate in MYP before?",
    fields: {
      result: {
        name: "didParticipate",
        type: "hidden",
        rules: ["required", "radioGroup"]
      },
      yesButton: {
        name: "didParticipate",
        label: "Yes",
        value: true,
        type: "radio"
      },
      noButton: {
        name: "didParticipate",
        label: "No",
        value: false,
        type: "radio"
      }
    }
  },
  similarParticipation: {
    type: "nested",
    label: "Did you participate in similar programs before?",
    toValue: 1,
    fields: {
      result: {
        name: "similarParticipation",
        type: "hidden",
        rules: ["required", "radioGroup"]
      },
      yesButton: {
        name: "similarParticipation",
        label: "Yes",
        value: true,
        type: "radio"
      },
      noButton: {
        name: "similarParticipation",
        label: "No",
        value: false,
        type: "radio"
      }
    }
  },
  similarParticipationNames: {
    name: "similarParticipationNames",
    label: "Please name the similar programs if attended",
    type: "text",
    rules: ["required_if:similarParticipation.fields.results,true", "string"]
  },
  hearingWay: {
    name: "hearingWay",
    label: "How did you hear about the MYP",
    type: "text",
    rules: ["required", "string", "regex:/^[a-zA-Z0-9 ,._%+-]+$/i", "min:3"]
  },
  opinion: {
    name: "opinion",
    label:
      "Give us your opinion about the role of the Lebanese Parliament in one (!) sentence",
    type: "text",
    rules: ["required", "string", "regex:/^[a-zA-Z0-9 ,._%+-]+$/i", "min:10"]
  }
};

const hooks = {
  onSuccess(form) {
    regStore.isLoading = true;
    const values = form.values();
    const data = {
      userProfile: {
        ...values,
        accomodationNeeded: values.accomodationNeeded.result,
        didParticipate: values.didParticipate.result,
        similarParticipation: values.similarParticipation.result,
        similarParticipationNames: values.similarParticipationNames.split(", ")
      },
      name: values.name,
      email: values.email,
      usjEmail: values.email,
      password: values.password,
      role: "ROLE_PARTICIPANT"
    };

    postUser({ data })
      .then(resp => {
        // appStore.notify({
        //   status: "ok",
        //   message:
        //     "Your application has been sent to moderators, you will be informed when it get reviewed.",
        //   onClose: router.goBack()
        // });
        regStore.isLoading = false;
        regStore.showSuccess = true;
        
      })
      .catch(e => {
        appStore.notify({
          status: "critical",
          message: `Error: An application was already submitted using ${
            data.email
          } or ${data.usjEmail}`
        });
        regStore.isLoading = false;
      });
  },
  onError(form) {
    appStore.notify({
      status: "critical",
      message: "Fix the errors in your application in order to proceed."
    });
  }
};

const options = {
  validateOnChange: true
};

const form = (window.form = new MobxReactForm(
  { fields },
  { plugins, hooks, options }
));

export default form;
