import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import CloseIcon from "grommet/components/icons/base/Close";
import {
  default as NormalDocumentIcon,
  default as UploadedDocumentIcon
} from "grommet/components/icons/base/Document";
import DocumentIcon from "grommet/components/icons/base/DocumentUpload";
import DocumentDownloadIcon from "grommet/components/icons/base/DocumentDownload";
import MailIcon from "grommet/components/icons/base/Mail";
import ViewIcon from "grommet/components/icons/base/View";
import Pulse from "grommet/components/icons/Pulse";
import Label from "grommet/components/Label";
import Layer from "grommet/components/Layer";
import Meter from "grommet/components/Meter";
import Tile from "grommet/components/Tile";
import Tiles from "grommet/components/Tiles";
import Button from "grommet/components/Button";
import Title from "grommet/components/Title";
import Heading from "grommet/components/Heading";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";

import { action, computed, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import ReactDropzone from "react-dropzone";
import { parseMedia, postFile, applicationsSheetBaseUrl } from "../api";
import appStore from "../stores/app";
import docStore from "../stores/moderator/documents";
import userStore from "../stores/user";
import FetchingLoader from "./FetchingLoader";
import LoadingOverlay from "./LoadingOverlay";

@observer
export default class Actions extends React.Component {
  @observable
  files = [];

  @observable
  uploaderOpen = false;

  @observable
  extraLayersOpen = false;

  documentData;

  dataType;
  dataId;

  _toggleUploader = () => {
    this.uploaderOpen = !this.uploaderOpen;
  };

  _toggleExtraLayer = () => {
    this.extraLayersOpen = !this.extraLayersOpen;
  };

  constructor(props) {
    super(props);
    this.documentData = props.documentData;
    this.dataType = props.dataType;
    this.dataId = props.dataId;

    this.state = {
      shouldDownload: false,
      iframekey: 0
    };
  }

  _onDrop = afiles => {
    afiles.forEach(file => {
      const data = new FormData();
      data.append("file", file);

      this.files.push(new FileUploading(file.name));
      const fileT = this.files[this.files.length - 1];

      const dataToInject =
        this.dataType === DataTypes.party
          ? {
              party: `/parties/${this.dataId}`
            }
          : this.dataType === DataTypes.commity
          ? {
              commity: `/commities/${this.dataId}`
            }
          : {};

      postFile({
        data,
        onUploadProgress: progressEvent => {
          fileT.progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
      }).then(resp => {
        docStore.post(
          {
            sender: `/users/${userStore.user.id}`,
            file: `/media_objects/${resp.data.id}`,
            isGeneric: this.dataType === DataTypes.generic,
            ...dataToInject
          },
          () => {
            this.files.remove(fileT);
            appStore.notify({
              status: "ok",
              message: `${fileT.name} have been uploaded successfully.`
            });
          }
        );
      });
    });
  };

  _toggleDownload = () => {
    this.setState({
      iframekey: this.state.iframekey + 1,
      shouldDownload: true
    });
  };

  render() {
    const { withExport, minimal } = this.props;
    if (minimal)
      return (
        <Box
          direction="horizontal"
          pad={{ horizontal: "medium", vertical: "medium", between: "medium" }}
          align="center"
        >
          <Tiles selectable>
            <ActionTile
              Icon={DocumentDownloadIcon}
              label="Export Sheet"
              onClick={this._toggleDownload}
            />
          </Tiles>
          <iframe
            key={this.state.iframekey}
            src={this.state.shouldDownload ? applicationsSheetBaseUrl : null}
            style={{ display: "none" }}
          />
        </Box>
      );
    return (
      <React.Fragment>
        <Box>
          <Box separator="bottom" pad={{ vertical: "medium" }}>
            <Box direction="row">
              <Box direction="column" flex>
                <Title pad={{ horizontal: "medium" }}>Actions</Title>
                <Tiles selectable flush={false}>
                  <ActionTile
                    Icon={DocumentIcon}
                    label="Send Documents"
                    onClick={() => {
                      this.uploaderOpen = true;
                    }}
                  />
                  {/* <ActionTile
                    Icon={MailIcon}
                    label="Send Email"
                    onClick={() => {
                      this.uploaderOpen = true;
                    }}
                  /> */}
                  {withExport ? (
                    <React.Fragment>
                      <ActionTile
                        Icon={DocumentDownloadIcon}
                        label="Export Sheet"
                        onClick={this._toggleDownload}
                      />
                      <iframe
                        key={this.state.iframekey}
                        src={
                          this.state.shouldDownload
                            ? applicationsSheetBaseUrl
                            : null
                        }
                        style={{ display: "none" }}
                      />
                    </React.Fragment>
                  ) : null}
                </Tiles>
              </Box>
              {/* <Box pad="medium" justify="center">
                {this.extraLayersOpen ? null : (
                  <Pulse icon={<ViewIcon />} onClick={this._toggleExtraLayer} />
                )}
              </Box> */}
            </Box>
            <DocumentLayer
              uploaderOpen={this.uploaderOpen}
              onDrop={this._onDrop}
              files={this.files}
              onClose={this._toggleUploader}
            />
          </Box>
          <ActionDocuments
            dataType={this.dataType}
            dataId={this.dataId}
            // open={this.extraLayersOpen}
            // onClose={this._toggleExtraLayer}
          />
        </Box>
      </React.Fragment>
    );
  }
}

const DocumentLayer = observer(({ uploaderOpen, onDrop, files, onClose }) =>
  uploaderOpen ? (
    <Layer
      align="center"
      closer={true}
      pad="none"
      flush={false}
      justify="center"
      onClose={onClose}
    >
      <Box
        pad={{
          // horizontal: "medium",
          vertical: "medium",
          between: "medium"
        }}
        colorIndex="light-1"
        size="large"
        direction="row"
      >
        <ReactDropzone
          className="dropper"
          activeClassName="dropper-active"
          acceptClassName="dropper-accept"
          rejectClassName="dropper-reject"
          onDrop={onDrop}
        >
          <Box align="center" justify="center" pad="medium">
            <UploadedDocumentIcon />
            <Label align="center">Drop files to upload</Label>
          </Box>
        </ReactDropzone>
        <Box direction="column">
          {files.map(file => (
            <Box key={file.name}>
              <Meter
                label={file.name}
                size="medium"
                value={file.progress}
                colorIndex={file.color}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Layer>
  ) : null
);

export const ActionTile = ({ onClick, Icon, label,isLoading }) => (
  <Tile onClick={onClick} align="start">
    <Box
      direction="row"
      pad={{
        horizontal: "small",
        vertical: "small",
        between: "small"
      }}
      responsive={false}
      style={{position:"relative"}}
    >
      <Icon />
      <Label strong margin="none">
        {label}
      </Label>
    <LoadingOverlay loading={isLoading} />
    </Box>
  </Tile>
);

class FileUploading {
  @observable
  name;

  @observable
  progress;

  color;

  constructor(name) {
    this.name = name;
    this.progress = 0;
    this.color = this.colors[Math.floor(Math.random() * 4)];
  }

  @action
  setProgress(value) {
    this.progress = value;
  }

  colors = ["neutral-1", "neutral-3", "accent-2", "brand", "critical"];
}

@observer
class ActionDocuments extends React.Component {
  @computed
  get data() {
    switch (this.props.dataType) {
      case DataTypes.generic:
        return docStore.genericDocuments;
      case DataTypes.party:
        return docStore.partyDocuments(this.props.dataId);
      case DataTypes.commity:
        return docStore.commityDocuments(this.props.dataId);
      default:
        return [];
    }
  }

  @observable
  showAlert= false;

  @observable
  selectedDoc = null;

  componentDidUpdate() {
    if (!docStore.didFetch) docStore.fetch();
  }

  _fetchDocs = () => {
    if (!docStore.didFetch) {
      docStore.fetch();
    }
  };

  _showAlert = (doc)=>() =>{
    this.showAlert=true;
    this.selectedDoc = doc;
  }

  _hideAlert = () =>{
    this.showAlert = false;
    this.selectedDoc=null;
  }

  _deleteDoc = () =>{
    this.selectedDoc.delete();
    this._hideAlert();
  }

  render() {
    return (
      <Accordion onActive={this._fetchDocs}>
        <AccordionPanel heading="Documents">
          {this.data.length > 0 ? (
            <Tiles selectable flush={false}>
              {this.data.map(doc => (
                <DocTile key={doc.id} doc={doc} onClick={this._showAlert(doc)} />
              ))}
            </Tiles>
          ) : (
            <Box align="center" justify="center" pad="large">
              <Heading tag="h3" uppercase>
                There is no documents yet
              </Heading>
            </Box>
          )}
          <FetchingLoader store={docStore} />
        </AccordionPanel>
        {this.showAlert?<Layer align="center" overlayClose={true} closer={true} onClose={this._hideAlert}>
          <Box pad={{vertical:"medium"}}>
            <Title>Document Actions</Title>
            <Box direction="row" margin={{top:"medium"}} pad={{between:"medium"}}>
              <Button label="View" icon={<ViewIcon/>} primary onClick={()=>{window.open(this.selectedDoc.url);}}/>
              <Button label="Delete" icon={<CloseIcon/>} critical onClick={this._deleteDoc}/>
            </Box>
          </Box>
        </Layer>:null}
      </Accordion>
    );
  }
}

@observer
export class ParticipantDocuments extends React.Component {
  render() {
    return (
      <Accordion onActive={this._fetchDocs}>
        <AccordionPanel heading={<Box direction="row"
          pad={{ between: "small" }} responsive={false}><NormalDocumentIcon colorIndex="accent-2" /><Title>Documents {` (${this.props.documents.length})`}</Title></Box>}>
          {this.props.documents.length > 0 ? (
            <Tiles selectable flush={false}>
              {this.props.documents.map(doc => (
                <ParticipantDocTile key={doc.id} doc={doc} />
              ))}
            </Tiles>
          ) : (
            <Box align="center" justify="center" pad="large">
              <Heading tag="h3" uppercase>
                There is no documents yet
              </Heading>
            </Box>
          )}
          <FetchingLoader store={docStore} />
        </AccordionPanel>
        </Accordion>
      
    );
  }
}

const DocTile = observer(({ doc,onClick }) => (
  <ActionTile
    Icon={NormalDocumentIcon}
    label={doc.file}
    onClick={doc.isSyncing?null:onClick}
    isLoading={doc.isSyncing}
    // onClick={() => {
    //   window.open(doc.url);
    // }}
  />
));

const ParticipantDocTile = observer(({ doc }) => (
  <ActionTile
    Icon={NormalDocumentIcon}
    label={doc.file}
    onClick={() => {
      window.open(parseMedia(doc.file));
    }}
  />
));

export const DataTypes = {
  generic: "GENERIC",
  party: "PARTY",
  commity: "COMMITY",
  user: "USER"
};
