import React from "react";
import Box from "grommet/components/Box";

import Title from "grommet/components/Title";
import Table from "grommet/components/Table";
import Tiles from "grommet/components/Tiles";
import DocumentIcon from "grommet/components/icons/base/DocumentDownload";
import { ActionTile } from "../../../components/MainActions";
import { endorsementsSheetBaseUrl } from "../../../api";
import endorsementsStore from "../../../stores/moderator/endorsements";
import { observer } from "mobx-react";

@observer
export default class EndorsementScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldDownload: false,
      iframekey: 0
    };
  }

  _toggleDownload = () => {
    this.setState({
      iframekey: this.state.iframekey + 1,
      shouldDownload: true
    });
  };

  componentDidMount(){
      if(!endorsementsStore.didFetch && !endorsementsStore.isFetching){
          endorsementsStore.fetch();
      }
  }

  render() {
    return (
      <Box flex>
        <Actions onDownload={this._toggleDownload} />
        <iframe
          key={this.state.iframekey}
          src={this.state.shouldDownload ? endorsementsSheetBaseUrl : null}
          style={{ display: "none" }}
        />
        <Box pad="medium">
          <Table selectable>
            <thead style={{backgroundColor:"#E5007D",color:"white",fontWeight:"800"}}>
              <tr>
                <th style={{fontWeight:"800"}}>Participant</th>
                <th style={{fontWeight:"800"}}>Content</th>
                <th style={{fontWeight:"800"}}>Leadership</th>
                <th style={{fontWeight:"800"}}>Engagement</th>
                <th style={{fontWeight:"800"}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {endorsementsStore.sortedData.map((d,index)=> (
                <tr key={d.userId} style={{backgroundColor:index%2?"rgba(229,0,125,0.5)":"#59CDFF"}}>
                  <td>{d.name}</td>
                  <td>{d.content}</td>
                  <td>{d.leadership}</td>
                  <td>{d.management}</td>
                  <td>{d.total}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </Box>
    );
  }
}

const Actions = ({ onDownload }) => (
  <React.Fragment>
    <Box separator="horizontal" pad={{ vertical: "medium" }}>
      <Box direction="row">
        <Box direction="column" flex>
          <Title pad={{ horizontal: "medium" }}>Actions</Title>
          <Tiles selectable flush={false}>
            <ActionTile
              Icon={DocumentIcon}
              label="Download Sheet"
              onClick={onDownload}
            />
          </Tiles>
        </Box>
      </Box>
    </Box>
  </React.Fragment>
);
