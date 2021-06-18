import React from "react";
import { observer } from "mobx-react";
import FormField from "grommet/components/FormField";
import SearchInput from "grommet/components/SearchInput";
import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import CloseIcon from "grommet/components/icons/base/Close";
import styled from "styled-components";

@observer
export default class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
    this.contentName = props.contentName;
  }

  _handleSearch = e => {
    this.store.filterKeyword = e.target.value;
  };

  _clearSeach = () => {
    this.store.filterKeyword = "";
  };

  render() {
    return (
      <SearchBox direction="row" responsive={false}>
        <FormField direction="row">
          <SearchInput
            onDOMChange={this._handleSearch}
            placeHolder={`Search ${this.contentName}`}
            value={this.store.filterKeyword}
          />
        </FormField>
        {this.store.filterKeyword ? (
          <SearchAnchor icon={<CloseIcon />} onClick={this._clearSeach} />
        ) : null}
      </SearchBox>
    );
  }
}

const SearchAnchor = styled(Anchor)`
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-left: 0;
`;

const SearchBox = styled(Box)`
  & > .grommetux-form-field {
    width: 100%;
  }
`;
