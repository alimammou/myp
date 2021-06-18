import React from "react";
import { observer } from "mobx-react";
import Box from "grommet/components/Box";
import DocIcon from "grommet/components/icons/base/DocumentDownload";
import Anchor from "grommet/components/Anchor";
import Headline from "grommet/components/Headline";
import Heading from "grommet/components/Heading";

@observer
export default class HomeScreen extends React.Component {
  render() {
    return (
      <Box pad={{ horizontal: "large" }} flex justify="between">
        <Box>
          <Box justify="center" align="start">
            <img
              src={require("../../../assets/images/cover_main.png")}
              style={{ height: "auto", width: "20%" }}
            />
          </Box>
          <Box pad={{"between":"medium"}}>
          <Headline strong>Welcome to the Model Youth Parliament!</Headline>
          <Heading tag="h2">
            The program starts on March 1st at USJ Medical Science Campus,
            Amphithéâtre C. Registration is open at 4:00 pm – the opening starts
            4:30 pm, please be on time.
          </Heading>
          <Heading tag="h2">
            During the first day you will be assigned to a party and committee
            after which you will have access to more features on this website.
          </Heading>
          <Heading tag="h2">
            Before the start, please prepare yourself by downloading the
            following preparatory material and read it.
          </Heading>
          <Heading tag="h2">
            For any additional question you can reach Lea Choueifaty from the
            USJ student life department at:{" "}
            <a href="tel:71762922">71 762 922</a>
          </Heading>
          <Heading tag="h2">We hope you will enjoy the program!</Heading>
          </Box>
        </Box>
        <Box pad={{ vertical: "large" }}>
          <Anchor
            icon={<DocIcon />}
            primary
            label="MYP Information & Rules"
            target="_blank"
            href="https://endpoints.myplebanon.com/media/Information_MYP_2019.pdf"
          />
        </Box>
      </Box>
    );
  }
}
