import RegisterScreen from "../screens/register";
import LoginScreen from "../screens/login";
import DashboardScreen from "../screens/dashboard";
import ConfirmationScreen from "../screens/confirmRegistration";

export const plainRoutes = [
  {
    name: "register",
    path: "/apply",
    exact: true,
    component: RegisterScreen
  },
  {
    name: "dashboard",
    path: "/dashboard",
    exact: false,
    component: DashboardScreen
  },
  {
    name: "login",
    path: "/login",
    exact: true,
    component: LoginScreen
  },
  {
    name: "registration",
    path: "/confirm_registration/:token",
    exact: true,
    component: ConfirmationScreen
  }
];

export const dashboardRoutes = [{}];
