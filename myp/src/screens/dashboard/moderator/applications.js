import AnnotatedMeter from "grommet-addons/components/AnnotatedMeter";
import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Spinner from "grommet/components/icons/Spinning";
import Status from "grommet/components/icons/Status";
import Label from "grommet/components/Label";
import Meter from "grommet/components/Meter";
import Section from "grommet/components/Section";
import Tiles from "grommet/components/Tiles";
import Value from "grommet/components/Value";
import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import Observer from "../../../components/LazyObserver";
import SearchComponent from "../../../components/SearchComponent";
import applicationStore from "../../../stores/moderator/applications";
import router from "../../../stores/router";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Actions, { DataTypes } from "../../../components/MainActions";

/**
 *
 *
 * @export
 * @class ApplicationsScreen
 * @extends {React.Component}
 */
@observer
export default class ApplicationsScreen extends React.Component {
  componentDidMount() {
    if (!applicationStore.didFetch) applicationStore.fetch();
  }

  render() {
    return (
      <Box>
        <SearchComponent store={applicationStore} contentName="Applications" />
        <Actions withExport minimal />
        <MetersSection />
        <FetchingLoader />
      </Box>
    );
  }
}


/**
 * @class ApplicationTilesContainer
 * @param {String} type [description]
 * @extends {React.Component}
 */
@observer
class ApplicationTilesContainer extends React.Component {
  @computed
  get filteredApplications() {
    return applicationStore.filteredData.filter(
      app => app.status === this.props.type
    );
  }

  render() {
    const title =
      this.props.type === "accepted"
        ? "Accepted"
        : this.props.type === "rejected"
          ? "Rejected"
          : "Pending";
    const value =
      this.props.type === "accepted"
        ? "ok"
        : this.props.type === "rejected"
          ? "critical"
          : "unknown";

    return this.filteredApplications.length > 0 ? (
      <Section separator="top" pad={{ vertical: "none" }}>
        <Header pad={{ horizontal: "small" }} size="small">
          <Label size="small">
            <Status size="small" value={value} /> {title}
          </Label>
        </Header>
        <Tiles selectable={true} flush={false} fill={true} size="large">
          {this.filteredApplications.map((app, index) => (
            <ApplicationTile key={app.id} application={app} index={index} />
          ))}
        </Tiles>
      </Section>
    ) : null;
  }
}

const MetersSection = observer(() => (
  <Section
    separator="bottom"
    direction="row"
    responsive={false}
    pad={{ vertical: "medium", horizontal: "medium", between: "medium" }}
  >
    <Box responsive={false} align="center">
      <AnnotatedMeter
        legend={false}
        type="circle"
        max={applicationStore.applications.length}
        series={[
          {
            label: "Accepted",
            value: applicationStore.acceptedApplications.length,
            colorIndex: "ok"
          },
          {
            label: "Rejected",
            value: applicationStore.rejectedApplications.length,
            colorIndex: "critical"
          },
          {
            label: "Pending",
            value: applicationStore.pendingApplications.length,
            colorIndex: "unknown"
          }
        ]}
      />
      <Label>Total Applications</Label>
    </Box>
    <Box responsive={false} align="center">
      <Meter
        max={128}
        type="arc"
        value={applicationStore.acceptedApplications.length}
        colorIndex="brand"
        onActive={() => {}}
      />
      <Value value={applicationStore.acceptedApplications.length} />
      <Label>Accepted Applications</Label>
    </Box>
    {/* <Box responsive={false} align="center">
      <Meter
        max={applicationStore.acceptedApplications.length}
        type="arc"
        value={applicationStore.didVerify.length}
        colorIndex="accent-2"
        onActive={() => {}}
      />
      <Value value={applicationStore.didVerify.length} />
      <Label>Did Verify</Label>
    </Box> */}
  </Section>
));

const ApplicationTile = observer(({ application, index }) => {
  let status = null;
  if (application.status === "accepted") {
    let needParty = application.user && !application.user.party;
    const needCommity = application.user && !application.user.commity;
    // const needCommity = null;
    status = (
      <Box align="start">
        {needParty ? (
          <Box direction="row" justify="start" responsive={false}>
            <Status size="small" value="warning" />
            Party not assigned
          </Box>
        ) : null}
        {needCommity ? (
          <Box direction="row" justify="start" responsive={false}>
            <Status size="small" value="warning" />
            Commity not assigned
          </Box>
        ) : null}
      </Box>
    );
  }

  return (
    <Observer
      once
      onClick={() => application.isSyncing?{}:router.push(`/dashboard/applications/${application.id}`)}
      className="grommetux-box grommetux-box--direction-column grommetux-box--align-start grommetux-box--responsive grommetux-box--pad-none grommetux-background-color-index-light-2 grommetux-background-color-index--light grommetux-box--clickable grommetux-tile grommetux-tile--selectable grommetux-none-hover-color-index-disabled grommetux-tile--hover-border-small"
      style={{ minHeight: status ? 120 : 72,position:"relative" }}
    >
      {isVisible => (
        <Box pad="medium" style={{ minWidth: 230}} className="wow fadeIn">
          {isVisible ? (
            <React.Fragment>
              <Box direction="row" responsive={false}>
                {application.isVerified ? (
                  <Status size="small" value="ok" />
                ) : <Status size="small" value="ok" />}{" "}
                <strong>{application.name}</strong>
              </Box>
              {status}{" "}
            </React.Fragment>
          ) : null}
          <Box>
          <LoadingOverlay loading={application.isSyncing} />
          </Box>  
        </Box>
      )}
    </Observer>
  );
});


const FetchingLoader = observer(() => {
  return applicationStore.isFetching ? (
    <Box flex pad="medium" align="center" justify="center">
      <Spinner size="large" />
    </Box>
  ) : (
    <React.Fragment>
      <ApplicationTilesContainer type="unknown" />

      <ApplicationTilesContainer type="accepted" />

      <ApplicationTilesContainer type="rejected" />
    </React.Fragment>
  );
});
