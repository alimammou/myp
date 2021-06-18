import React from "react";
import { observer } from "mobx-react";
import FetchingLoader from "../components/FetchingLoader";
import Spinner from "grommet/components/icons/Spinning";
import Box from "grommet/components/Box";
import Headline from "grommet/components/Headline";

export default storeToWatch => WrappedComponent => {
  //   if (storeToWatch.didFetch) {
  //     console.log("done fetching");
  //     return WrappedComponent;
  //   } else {
  //     console.log("fetching");
  //     storeToWatch.fetch();
  //     const Loader = () => <FetchingLoader store={storeToWatch} />;
  //     return Loader;
  //   }

  // if (!storeToWatch.didFetch) {
  //   storeToWatch.fetch();
  // }
  const Reactive = observer(
    props =>
      storeToWatch.didFetch ? (
        <WrappedComponent {...props} />
      ) : (
        <PageLoader store={storeToWatch} />
      )
  );
  return Reactive;
};

class PageLoader extends React.Component {
  componentDidMount() {
    const { store, store2 } = this.props;
    if (!store.didFetch) {
      store.fetch();
    } else if (!store2.didFetch) {
      alert("test");
      store2.fetch();
    }
  }

  render() {
    return (
      <Box full="vertical" align="center" justify="center" colorIndex="light-2">
        <Headline align="center" size="small">
          Please wait...
        </Headline>
        <Headline align="center" size="small" strong>
          Loading Data
        </Headline>
        <Spinner size="large" />
      </Box>
    );
  }
}
export const asCompanionScreen = (
  storeToWatch,
  companianStore
) => WrappedComponent => {
  //   if (storeToWatch.didFetch) {
  //     console.log("done fetching");
  //     return WrappedComponent;
  //   } else {
  //     console.log("fetching");
  //     storeToWatch.fetch();
  //     const Loader = () => <FetchingLoader store={storeToWatch} />;
  //     return Loader;
  //   }

  // if (!storeToWatch.didFetch) {
  //   storeToWatch.fetch();
  // }
  const Reactive = observer(
    props =>
      companianStore && companianStore.didFetch ? (
        <WrappedComponent {...props} />
      ) : (
        <PageLoader store={storeToWatch} store2={companianStore} />
      )
  );
  return Reactive;
};
