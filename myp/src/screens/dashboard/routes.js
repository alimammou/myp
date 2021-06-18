import CommiteesIcon from "grommet/components/icons/base/Cluster";
import ApplicationIcon from "grommet/components/icons/base/DocumentUser";
import PartyIcon from "grommet/components/icons/base/Flag";
import ParticipantsIcon from "grommet/components/icons/base/Group";
import HomeIcon from "grommet/components/icons/base/Home";
import UsersIcon from "grommet/components/icons/base/User";
import EndorsementIcon from "grommet/components/icons/base/Star";
import ScheduleIcon from "grommet/components/icons/base/Schedule";
import { computed } from "mobx";
import userStore, { roles } from "../../stores/user";
import CoachPartyScreen,{CommiteeScreen as CoachCommiteeScreen} from "./coach/manage";
import ApplicationsScreen from "./moderator/applications";
import ApplicationScreen from "./moderator/applicationScreen";
import CommiteesScreen, { CommityAdditor } from "./moderator/commitees";
import CommityScreen from "./moderator/commiteeScreen";
import ParticipantsScreen from "./moderator/participants";
import PartiesScreen, { PartyAdditor } from "./moderator/parties";
import PartyScreen from "./moderator/partyScreen";
import UsersScreen, { AdminAdditor } from "./moderator/users";
import UserCommiteeScreen from "./user/commiteeScreen";
import UserHome from "./user/home";
import UserParticipantsScreen from "./user/participant";
import UserPartyScreen from "./user/partyScreen";
import UserScheduleScreen from "./user/scheduleScreen";
import ProfileScreen from "./user/profile";
import EndorsementScreen from "./moderator/endorsements";
import coachStore from "../../stores/coach/coach";

export const modRoutes = [
  {
    path: "/dashboard",
    name: "Home",
    icon: HomeIcon,
    component: UserHome,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/",
    name: "Home",
    icon: HomeIcon,
    component: UserHome,
    exact: true,
    navable: false
  },
  {
    path: "/dashboard/schedule",
    name: "Schedule",
    icon: ScheduleIcon,
    component: UserScheduleScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/endorsements",
    name: "Rating",
    icon: EndorsementIcon,
    component: EndorsementScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/users",
    name: "Users",
    icon: UsersIcon,
    component: UsersScreen,
    addComponent: AdminAdditor,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/applications",
    name: "Applications",
    icon: ApplicationIcon,
    component: ApplicationsScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/participants",
    name: "Participants",
    icon: ParticipantsIcon,
    component: ParticipantsScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/parties",
    name: "Parties",
    icon: PartyIcon,
    component: PartiesScreen,
    addComponent: PartyAdditor,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/commitees",
    name: "Committees",
    icon: CommiteesIcon,
    component: CommiteesScreen,
    addComponent: CommityAdditor,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/applications/:appIndex",
    name: "Namco",
    component: ApplicationScreen,
    exact: true,
    navable: false
  },
  {
    path: "/dashboard/party/:appIndex",
    name: "Party",
    component: PartyScreen,
    exact: true,
    navable: false
  },
  {
    path: "/dashboard/commitee/:appIndex",
    name: "Commity",
    component: CommityScreen,
    exact: true,
    navable: false
  }
];

export const coachRoutes = [
  {
    path: "/dashboard",
    name: "Home",
    icon: HomeIcon,
    component: UserHome,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/schedule",
    name: "Schedule",
    icon: ScheduleIcon,
    component: UserScheduleScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/party",
    name: "Manage Party",
    icon: PartyIcon,
    component: CoachPartyScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/commitee",
    name: "Manage Committee",
    icon: CommiteesIcon,
    component: CoachCommiteeScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/applications/:appIndex",
    name: "Namco",
    component: ApplicationScreen,
    exact: true,
    navable: false
  }
];

export const partRoutes = [
  {
    path: "/dashboard",
    name: "Home",
    icon: HomeIcon,
    component: UserHome,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/schedule",
    name: "Schedule",
    icon: ScheduleIcon,
    component: UserScheduleScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/profile",
    name: "Profile",
    icon: UsersIcon,
    component: ProfileScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/party",
    name: "Party",
    icon: ParticipantsIcon,
    component: UserPartyScreen,
    exact: true,
    navable: true
  },
  {
    path: "/dashboard/commitee",
    name: "Committee",
    icon: CommiteesIcon,
    component: UserCommiteeScreen,
    exact: true,
    navable: true
  },
  // {
  //   path: "/dashboard/endorsement",
  //   name: "Endorsement",
  //   icon: ParticipantsIcon,
  //   component: UserParticipantsScreen,
  //   exact: true,
  //   navable: true
  // }
];

const routes = computed(
  () =>
    userStore.role === roles.moderator
      ? modRoutes
      : userStore.role === roles.coach
        ? []
        : userStore.role === roles.participant
          ? []
          : []
);

class DashboardRouter {
  @computed
  get routes() {
    return userStore.role === roles.moderator
      ? modRoutes
      : userStore.role === roles.coach
        ? coachRoutes
        : userStore.role === roles.participant
          ? partRoutes
          : [];
  }
}

const dashRouter = new DashboardRouter();

export default dashRouter;
