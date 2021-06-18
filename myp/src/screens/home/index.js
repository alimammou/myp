import Anchor from "grommet/components/Anchor";
import Animate from "grommet/components/Animate";
import Article from "grommet/components/Article";
import Box from "grommet/components/Box";
import Footer from "grommet/components/Footer";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";
import Headline from "grommet/components/Headline";
import AnnounceIcon from "grommet/components/icons/base/Announce";
import CaretDownIcon from "grommet/components/icons/base/CaretDown";
import CaretUpIcon from "grommet/components/icons/base/CaretUp";
import ApplyIcon from "grommet/components/icons/base/Edit";
import ArrowDown from "grommet/components/icons/base/LinkDown";
import ArrowRight from "grommet/components/icons/base/LinkNext";
import ArrowLeft from "grommet/components/icons/base/LinkPrevious";
import DeployIcon from "grommet/components/icons/base/Services";
import LoginIcon from "grommet/components/icons/base/UserAdmin";
import GlobeIcon from "grommet/components/icons/base/Globe";
import Pulse from "grommet/components/icons/Pulse";
import Image from "grommet/components/Image";
import Section from "grommet/components/Section";
import Value from "grommet/components/Value";
import Label from "grommet/components/Label";
import Menu from "grommet/components/Menu";
import Responsive from "grommet/utils/Responsive";
import { observer } from "mobx-react";
import React from "react";
import { animateScroll as scroll } from "react-scroll";
import styled from "styled-components";
import Flag from "react-flags";
import { computed, observable, action } from "mobx";
// import "../../scss/rtl.css";

 class Localizer {
  @observable
  language = "en";

  languages = {
    en: "en",
    ar: "ar"
  };


  constructor(){
    const local = localStorage.getItem("local");
    local === "ar"? this.language = "ar":this.language = "en";  
  }

  @action
  selectLanguage = lang => () => {
    this.language = lang;
    localStorage.setItem("local",lang);
  };

  content = {
    en: {
      s1h1: "Ready to change your identity?",
      s1h2: "Ready to be a Member of Parliament?",
      whatIsMypTitle: "What is MYP?",
      whatIsMypContent:
        "MYP is a simulation of the organization and processes of political work in the Lebanese Parliament. 128 students can put themselves in the role of a member of parliament (MP) and experience the challenging reality of parliamentary work.",
      registration: "Registration",
      login: "Login",
      eventDuration: "Event Duration",
      scrollToContinue: "scroll down to continue",
      theProcessTitle: "The Process",
      negotiate: "Negotiate",
      vote: "Vote",
      debate: "Debate",
      changeIdentity: "Change Your Identity",
      deskS1:
        "After randomly picking your role, you go right into work with the other new MPs. In the numerous meetings, you get to know your party, your committee and your working group. These three bodies confront each participant with different challenges. In order to solve them, you have to master your topic as well as the diplomatic relations to the other parties.",
      deskS2:
        "Since all the factions (in MYP, they are called Parliamentary Party Groups – PPG) have the same size, you need to build alliances to shape the proposed draft laws in the committees and create majorities to pass the finalized laws in the general assembly. The big highlight of the MYP is the final debate in the plenary hall of the Lebanese Parliament, where each working group can present the results of their hard work.",
      deskS3:
        "During the whole duration of the 4-day intensive program you will be guided by representatives of the Lebanese parties and experts of the draft laws as well as coaches who will help you with content and procedure.",
      deskS4:
        "Depending on shown skills in leadership, work on content and engagement, selected participants will have the chance to visit Germany after the end of the program. FNF will organize a political visiting program, including a visit of the Reichstagsgebäude, the location of the German parliament in Berlin.",
      apply: "Apply Now",
      getInvolved: "and get involved",
      hosted: "Hosted By",
      feb: "FEB",
      march: "MAR",
      english: "English",
      arabic: "Arabic",
      one: "1",
      twentyFive: "25",
      four: "4"
    },
    ar: {
      s1h1: "هل أنت مستعد لتغير هويتك؟",
      s1h2: "هل أنت مستعد لتكون عضو في البرلمان؟",
      whatIsMypTitle: "ما هو برلمان الشباب؟",
      whatIsMypContent:
        "برلمان الشباب هو محاكاةٌ لتنظيم العمل السياسي في البرلمان اللبناني وإجراءاته. ۱٢٨ من الطلاّب يضعون أنفسهم مكان النوّاب ويختبرون واقع العمل البرلماني المليء بالتحدّيات.",
      registration: "التسجيل",
      login: "تسجيل الدخول",
      eventDuration: "مدة الحدث",
      scrollToContinue: "انتقل لأسفل للمتابعة",
      theProcessTitle: "العملية السياسية",
      negotiate: "تفاوض",
      vote: "اقترع",
      debate: "ناقش",
      changeIdentity: "غير هويتك",
      deskS1:
        "بعد اختيار دورك بطريقة عشوائية، وتتوجّه إلى العمل على الفور مع النوّاب الجدد الآخرين. وفي الاجتماعات الكثيرة التي تحضرها، تتعرّف على حزبك، ولجنتك ومجموعة العمل التي أنت مشارك فيها. وهذه الهيئات الثلاث تطرح تحدّيات مختلفة على كلّ مشارك. ولحلّ هذه التحدّيات، ينبغي عليك أن تتملّك موضوعك والعلاقات الدبلوماسية مع الأحزاب الأخرى.",
      deskS2:
        "وبما أنّ الفئات كلّها (في البرلمان الشبابي، تسمّى هذه الفئات مجموعات حزبية برلمانية - PPG) هي من الحجم نفسه، يجب بناء تحالفات لتصميم مشاريع القوانين في اللجان وتأمين أكثريّات لإقرار القوانين المنقّحة في الجمعية العامة. أمّا ميزة البرلمان الشبابي الأساسية فهي جلسة النقاش النهائية في القاعة العامة للبرلمان اللبناني، حيث بإمكان كلّ من مجموعات العمل عرض نتائج عملها الدؤوب.",
      deskS3:
        "وخلال فترة البرنامج المكثّف الذي يمتدّ على ٤ أيّام، تتلقّون الإرشاد من ممثّلين عن الأحزاب اللبنانية وخبراء بمشاريع القوانين ومرافقين يساعدونكم في المضمون والإجراءات.",
      deskS4:
        "ويحظى مشاركون يتمّ اختيارهم حسب المهارات القيادية التي يظهرونها وعملهم على المضمون ودرجة التزامهم، بفرصة زيارة ألمانيا بعد انتهاء البرنامج. وستنظّم مؤسسة فريدريش نويمان للحرية برنامج زيارات سياسية، بما فيها زيارة للـ  Reichstagsgebäude ، وهو مقرّ البرلمان الألماني في برلين.",
      apply: "سجل الآن",
      getInvolved: "وشارك",
      hosted: "برعاية",
      feb: "شباط",
      march: "آذار",
      english: "الإنجليزية",
      arabic: "العربية",
      one: "١",
      twentyFive: "٢٥",
      four: "٤"
    }
  };

  @computed
  get local() {
    const arContent = { ...this.content.en, ...this.content.ar };
    return this.language === this.languages.ar ? arContent : this.content.en;
  }


}

export const localizer = (window.localizer = new Localizer());

@observer
export default class HomeScreen extends React.Component {
  // @observable
  // scrollPercent = 0;
  constructor() {
    super();
    this._onResponsive = this._onResponsive.bind(this);

    this.state = {
      scrollPercent: 0,
      small: true
    };
  }

  componentWillUnmount() {
    this._responsive.stop();
  }

  componentDidMount() {
    window.addEventListener("scroll", event => this.handleScroll(event));

    this._responsive = Responsive.start(this._onResponsive);
  }

  _onResponsive(small) {
    this.setState({ small });
  }

  handleScroll(event) {
    var minPixel = event.srcElement.scrollingElement.offsetTop;
    var maxPixel =
      minPixel +
      event.srcElement.scrollingElement.scrollHeight -
      event.srcElement.scrollingElement.clientHeight;
    var value = event.srcElement.scrollingElement.scrollTop;

    var percent = (value - minPixel) / (maxPixel - minPixel);
    percent = Math.min(1, Math.max(percent, 0)) * 100;
    this.setState({ scrollPercent: percent });
  }

  loadStyle() {
    if (localizer.language === "ar") {
      return <link rel="stylesheet" type="text/css" href={"rtl.css"} />;
    }
    return;
  }
  renderLanguageSelector() {
    return (
      <Menu
        responsive={false}
        primary={false}
        icon={
          <Box direction="row" responsive={false} pad={{ between: "small" }}>
            <GlobeIcon />
            <Flag
              name={localizer.language === localizer.languages.ar ? "LB" : "GB"}
              format="png"
              pngSize={24}
              basePath="/img/flags"
              shiny={false}
            />
          </Box>
        }
        size="small"
      >
        <Anchor
          onClick={localizer.selectLanguage(localizer.languages.en)}
          className={localizer.language === "en" ? "active" : ""}
          icon={
            <Flag
              name="GB"
              format="png"
              pngSize={24}
              basePath="/img/flags"
              shiny={false}
            />
          }
        >
          {localizer.local.english}
        </Anchor>
        <Anchor
          onClick={localizer.selectLanguage(localizer.languages.ar)}
          className={localizer.language === "ar" ? "active" : ""}
          icon={
            <Flag
              name="LB"
              format="png"
              pngSize={24}
              basePath="/img/flags"
              shiny={false}
            />
          }
        >
          {localizer.local.arabic}
        </Anchor>
      </Menu>
    );
  }

  renderHeader() {
    return (
      <AnimatedHeader
        colorIndex="light-1"
        active={this.state.scrollPercent > 0 && this.state.scrollPercent < 93}
        size="large"
        pad={{ vertical: "small", horizontal: "medium" }}
        justify="between"
        float
        fixed
      >
        <Logo
          src={
            localizer.language === "ar"
              ? require("../../assets/images/logo-text-rtl.png")
              : require("../../assets/images/logo-text.png")
          }
        />
        <Box
          flex
          justify="end"
          align="center"
          direction="row"
          responsive={false}
          pad={{ between: "medium" }}
        >
          {this.renderLanguageSelector()}
          <Anchor
            icon={<LoginIcon />}
            label={localizer.local.login}
            primary
            path="/login"
          />
        </Box>
        <ProgressBar style={{ width: `${this.state.scrollPercent}%` }} />
      </AnimatedHeader>
    );
  }

  renderSubHero() {
    return (
      <Box
        full
        pad={{ horizontal: "medium" }}
        style={{ paddingTop: "96px" }}
        // align="center"
        justify="around"
      >
        <APImage
          ratio={16 / 9}
          size="large"
          src={require("../../assets/images/cover_mobile.png")}
        />
        <Box align="center" justify="center" pad={{ vertical: "medium" }}>
          <Animate enter={{ animation: "slide-up", duration: 500 }}>
            <Heading tag="h1" strong align="center">
              {localizer.local.s1h1}
            </Heading>
          </Animate>
          <Animate enter={{ animation: "slide-up", duration: 500, delay: 400 }}>
            <Anchor style={{ textDecoration: "underline" }} path="/apply">
              <PinkHeadline tag="h1" strong align="center">
                {localizer.local.s1h2}
              </PinkHeadline>
            </Anchor>
          </Animate>
        </Box>
        <Footer
          // backgroundColorIndex="dark"
          size="large"
          justifySelf="end"
          align="center"
          justify="center"
          direction="column"
        >
          <Box>{localizer.local.scrollToContinue}</Box>
          <CaretDownIcon />
        </Footer>
      </Box>
    );
  }

  renderWhatIsMYP() {
    const { small } = this.state;
    return (
      <ExpandableBox
        full="horizontal"
        justify="center"
        colorIndex="brand"
        pad="large"
      >
        <MainSection
          full="horizontal"
          direction="row"
          pad={{ vertical: "large" }}
          align={small ? "start" : "center"}
          justify="center"
          reverse={small}
        >
          <Box
            className={small ? "" : "wow slideInLeft"}
            align="start"
            pad="none"
          >
            <Headline size={small ? "small" : "medium"} strong>
              {localizer.local.whatIsMypTitle}
            </Headline>
            <Headline size="small" margin={{ bottom: "large" }}>
              {localizer.local.whatIsMypContent}
            </Headline>
            <Box
              className={small ? "" : "wow fadeInUp"}
              pad={{ vertical: "large" }}
            >
              <Heading tag="h4" margin="none" strong>
                {localizer.local.registration}
              </Heading>
              <Box direction="row" responsive={false}>
                <Value
                  colorIndex="light-1"
                  trendIcon={
                    localizer.language === "ar" ? (
                      <ArrowLeft colorIndex="light-1" />
                    ) : (
                      <ArrowRight colorIndex="light-1" />
                    )
                  }
                  value={localizer.local.one}
                  size="large"
                  align="start"
                  units={localizer.local.feb}
                  responsive
                />
                <Value
                  colorIndex="light-1"
                  value={localizer.local.twentyFive}
                  size="large"
                  align="start"
                  units={localizer.local.feb}
                  responsive
                />
              </Box>
            </Box>
            <Box className={small ? "" : "wow fadeInUp"}>
              <Heading tag="h4" margin="none" strong>
                {localizer.local.eventDuration}
              </Heading>
              <Box direction="row" responsive={false}>
                <Value
                  colorIndex="light-1"
                  trendIcon={
                    localizer.language === "ar" ? (
                      <ArrowLeft colorIndex="light-1" />
                    ) : (
                      <ArrowRight colorIndex="light-1" />
                    )
                  }
                  value={localizer.local.one}
                  size="large"
                  align={localizer.language === "ar" ? "end" : "start"}
                  units={localizer.local.march}
                  responsive
                />
                <Value
                  colorIndex="light-1"
                  value={localizer.local.four}
                  size="large"
                  align="start"
                  units={localizer.local.march}
                  responsive
                />
              </Box>
            </Box>
            <Box margin={{top:"medium"}}  responsive={false} className={small?"":"wow fadeInUp"}>
              <Heading margin="none" strong tag="h3">Opening 4:30 PM</Heading>
              <Heading margin="none" strong tag="h3">Medical Science Campus</Heading>
              <Heading margin="none" strong tag="h3">Amphithéâtre C</Heading>
            </Box>
          </Box>
          <Box pad={{ vertical: "medium" }}>
            <AnnounceIcon size="huge" colorIndex="light-1" />
          </Box>
        </MainSection>
      </ExpandableBox>
    );
  }

  renderTheProcess() {
    const { small } = this.state;
    return (
      <VoteBox full="horizontal" pad="none" >
        <MainSection full="horizontal" justify="center">
          <Box
            direction="row"
            align="center"
            justify="center"
            responsive={false}
            margin={{ bottom: "medium" }}
          >
            <Headline style={{color:"rgba(255,255,255,0.8)"}} strong margin="none">
              {localizer.local.theProcessTitle}
            </Headline>
            <DeployIcon size="large" responsive={false} colorIndex="brand" />
          </Box>
          <Box
            direction="row"
            pad={{ vertical: "medium", between: "large" }}
            justify="between"
            align="center"
          >
            <ProcessCard
              small={small}
              title={localizer.local.changeIdentity}
              direction="Left"
            />
            {small ? (
              <Box basis="1/3" align="center">
                <ArrowDown
                  className={small ? "" : "wow fadeIn"}
                  colorIndex="accent-2"
                  size="large"
                />
              </Box>
            ) : (
              <Box className={small ? "arrow" : "arrow wow fadeIn"}>
                {localizer.language === "ar" ? (
                  <ArrowLeft colorIndex="accent-2" size="large" />
                ) : (
                  <ArrowRight colorIndex="accent-2" size="large" />
                )}
              </Box>
            )}
            <ProcessCard
              small={small}
              title={localizer.local.debate}
              direction="Down"
            />
          </Box>
          <Box
            direction="row"
            justify="end"
            pad={{ vertical: "medium", horizontal: "large" }}
          >
            <Box
              className={small ? "" : "wow fadeIn"}
              basis="1/3"
              align="center"
            >
              <ArrowDown colorIndex="accent-2" size="large" />
            </Box>
          </Box>
          <Box
            direction="row"
            pad={{ vertical: "medium", between: "large" }}
            justify="between"
            align="center"
          >
            <ProcessCard
              small={small}
              title={localizer.local.vote}
              direction="Up"
            />
            {small ? (
              <Box
                className={small ? "" : "wow fadeIn"}
                basis="1/3"
                align="center"
              >
                <ArrowDown colorIndex="accent-2" size="large" />
              </Box>
            ) : (
              <Box className={small ? "arrow" : "arrow wow fadeIn"}>
                {localizer.language === "ar" ? (
                  <ArrowRight colorIndex="accent-2" size="large" />
                ) : (
                  <ArrowLeft colorIndex="accent-2" size="large" />
                )}
              </Box>
            )}
            <ProcessCard
              small={small}
              title={localizer.local.negotiate}
              direction="Right"
            />
          </Box>
        </MainSection>
      </VoteBox>
    );
  }

  render() {
    const { small } = this.state;
    return (
      <Article>
        {this.loadStyle()}
        {this.renderHeader()}
        {this.renderSubHero()}
        {this.renderWhatIsMYP()}
        {this.renderTheProcess()}
        <ExpandableBox full="horizontal" colorIndex="neutral-2">
          <DescriptiveSection small={small} />
        </ExpandableBox>

        {/* <Box full appCentered>
          <MainSection
            flex
            className="title-section"
            pad={{ vertical: "large" }}
            align="center"
            justify="center"
          >
            <Box
              direction="row"
              align="center"
              responsive={false}
              margin={{ bottom: "large" }}
            >
              <PrizeIcon
                size="large"
                colorIndex="neutral-1"
                responsive={false}
              />
              <Headline strong margin="none">
                The Prize
              </Headline>
            </Box>
            <Box align="center" reverse={small}>
              <Headline align="center" className={small ? "" : "wow zoomIn"}>
                Participants will have a chance to win a visiting tour to the
                German Parliament in Berlin!
              </Headline>

              <Box
                margin={{ vertical: "medium" }}
                className={small ? "" : "wow jackInTheBox"}
              >
                <Image
                  style={{ width: "100%" }}
                  src="https://images.adsttc.com/media/images/5624/75d3/e58e/cec3/c400/0352/newsletter/Berlin_reichstag_west_panorama_2.jpg?1445230008"
                />
              </Box>
            </Box>
          </MainSection>
        </Box> */}
        <ExpandableBox full="horizontal" colorIndex="light-2" pad="large">
          <MainSection
            flex
            className="title-section"
            pad={{ vertical: "large" }}
            align="center"
            justify="center"
          >
            <SectionHeadline strong align="center">
              {localizer.local.hosted}
            </SectionHeadline>
            <Box
              // flex
              full="horizontal"
              direction="row"
              justify="center"
              align="center"
              wrap={true}
              responsive={false}
            >
              <BorderedBox
                pad="medium"
                full="horizontal"
                margin={{ bottom: "large", top: "large" }}
                align="center"
                justify="center"
                className={small ? "" : "wow bounceIn"}
                onClick={this._openInNewTab("https://fnst.org/")}
              >
                <Image
                  full="horizontal"
                  src={require("../../assets/images/fnf_logo.png")}
                />
              </BorderedBox>
              <BorderedBox
                flex
                color="orange"
                margin={{ right: "large" }}
                align="center"
                justify="center"
                className={small ? "" : "wow bounceInLeft"}
                onClick={this._openInNewTab("https://www.lp.gov.lb/")}
              >
                <Image
                  full="horizontal"
                  src={require("../../assets/images/mp_logo.png")}
                />
              </BorderedBox>

              <BorderedBox
                flex
                pad="medium"
                color="violet"
                align="center"
                justify="center"
                className={small ? "" : "wow bounceInRight"}
                onClick={this._openInNewTab("https://www.usj.edu.lb/")}
              >
                <Image
                  full="vertical"
                  src={require("../../assets/images/usj_logo.png")}
                />
              </BorderedBox>
            </Box>
          </MainSection>
          <Footer align="center" justify="center">
            <Anchor
              onClick={() => {
                scroll.scrollToTop();
              }}
            >
              <PulseButton icon={<CaretUpIcon />} />
            </Anchor>
          </Footer>
        </ExpandableBox>
      </Article>
    );
  }

  _openInNewTab = url => () => {
    window.open(url, "_blank");
  };
}

const SectionHeadline = styled(Headline)`
  width: 100%;
  padding: 30px;
  margin: 0 24px;
  border: 8px #dc2878 solid;
`;

const BorderedBox = styled(Box)`
  position: relative;
  transition: 200ms all;

  cursor: pointer;

  @media only screen and (min-width: 720px) {
    height: 204px;
  }
  @media only screen and (max-width: 719px) {
    height: 100px;
  }

  &:hover > * {
    transform: scale(0.97);
    transition: 200ms all;
  }

  & > * {
    z-index: 2;
    transition: 200ms all;
  }

  &::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: #b0e5fc;
    z-index: 1;
    transition: 200ms all;
  }

  &::after {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 0 solid
      ${({ color }) =>
        color === "purple"
          ? "#dc2878"
          : color === "orange"
          ? "#ff7d28"
          : color === "violet"
          ? "#0a64a0"
          : "#009ee3"};
    z-index: 1;
    box-sizing: border-box;
    transition: 200ms all;
  }

  &:hover::after {
    border: 8px solid
      ${({ color }) =>
        color === "purple"
          ? "#dc2878"
          : color === "orange"
          ? "#ff7d28"
          : color === "violet"
          ? "#0a64a0"
          : "#009ee3"};
  }
`;

const MainSection = styled(Section)`
  max-width: 960px !important;
  width: 100% !important;
  margin: 0 auto !important;
  overflow: hidden !important;
`;


const WideSection = styled(MainSection)`
  max-width: 1250px !important;
`;

const AnimatedHeader = styled(Header)`
  height: 96px;
  transition: 300ms transform;
  position: fixed !important;
  ${({ active }) => (active ? `transform: translateY(-96px);` : "")};
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: -4px;
  left: 0;
  background-color: #dc2878;
  ${"" /* width: ${({ value }) => value}%; */} height: 4px;
`;

const PulseButton = styled(Pulse)`
  & > .grommetux-pulse__icon > svg {
    fill: white;
    stroke: white;
    background-color: #dc2878;
  }
  & > .grommetux-pulse__icon-anim {
    border-color: #dc2878;
  }
`;

const PinkHeadline = styled(Heading)`
  color: #dc2878;
`;

const Logo = styled.img`
  height: 72px;
`;

const ExpandableBox = styled(Box)`
  @media only screen and (min-width: 720px) {
    min-height: 100vh;
  }
`;

const VoteBox = styled(ExpandableBox)`
background-image: url(${require("../../assets/images/vote.jpg")});
`

const ProcessBox = styled(Box)`
  position: relative;
  transition: 500ms all;
  box-sizing: border-box;
  color: black;
  overflow: hidden;
  background-color:rgba(255,255,255,0.3);

  @media only screen and (min-width: 720px) {
    min-height: 204px;
  }

  & > * {
    z-index: 2;
  }

  ::before {
    content: " ";
    width: 0;
    height: 0;
    background: #dc2878;
    position: absolute;
    transition: 500ms all;
    z-index: 1;
    overflow: hidden;
  }
  ::after {
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    border: 8px solid #dc2878;
    transition: 500ms all;
    z-index: 1;
    box-sizing: border-box;
    overflow: hidden;
  }

  &:hover {
    color: white;
  }
  &:hover::after {
    border-width: 0px;
  }

  &:hover::before {
    width: 100%;
    height: 100%;
    transition-delay: 100ms;
  }
`;

export const APImage = ({ ratio, src }) => (
  <div style={{ "--aspect-ratio": ratio, backgroundImage: `url(${src})` }} />
);

const ProcessCard = ({ title, direction, small }) => (
  <ProcessBox
    flex
    pad="large"
    align="center"
    justify="center"
    onClick={() => {}}
    className={small ? "" : `wow slideIn${direction}`}
  >
    <Heading margin="none" strong align="center" colorIndex="grey-1">
      {title}
    </Heading>
  </ProcessBox>
);

const DescriptiveSection = observer(({ small }) => (
  <WideSection
    full="horizontal"
    className="title-section"
    pad={{ vertical: "large", horizontal: "large" }}
    justify="center"
    direction="column"
  >
    <Box>
      <Headline size="small" className={small ? "" : "wow fadeInUp"}>
        {localizer.local.deskS1}
      </Headline>
      <Headline size="small" className={small ? "" : "wow fadeInUp"}>
        {localizer.local.deskS2}
      </Headline>
      <Headline size="small" className={small ? "" : "wow fadeInUp"}>
        {localizer.local.deskS3}
      </Headline>
      <Headline size="small" className={small ? "" : "wow fadeInUp"}>
        {localizer.local.deskS4}
      </Headline>
    </Box>
    <Box className={small ? "" : "wow zoomIn"}>
      <Anchor path="/apply" icon={<ApplyIcon size="large" />} align="center">
        <Headline size="small" margin="none">
          {localizer.local.apply}
        </Headline>
        {localizer.local.getInvolved}
      </Anchor>
    </Box>
  </WideSection>
));

