import React from "react";
import Box from "grommet/components/Box";
import Tabs from "grommet/components/Tabs";
import Tab from "grommet/components/Tab";
import Table from "grommet/components/Table";
import TableRow from "grommet/components/TableRow";
import Heading from "grommet/components/Heading";
import Timestamp from "grommet/components/Timestamp";
import Status from "grommet/components/icons/Status";
import moment from "moment";

export default class ScheduleScreen extends React.Component {
  render() {
    return (
      <Box separator="top" pad={{ vertical: "medium" }}>
        <Tabs>
          {schedule.map(d => (
            <Tab key={d.name} title={moment(d.name).format("Do of MMMM")}>
              <Box pad="medium">
                <Heading align="center" margin="medium">
                  {moment(d.name).format("dddd Do of MMMM")}
                </Heading>
                <Table>
                  <thead
                    style={{
                      backgroundColor: "#E5007D",
                      color: "white",
                      fontWeight: "800"
                    }}
                  >
                    <tr>
                      <th style={{ fontWeight: "800" }}>Time</th>
                      <th style={{ fontWeight: "800" }}>Task</th>
                      <th style={{ fontWeight: "800" }}>Location</th>
                      <th style={{ fontWeight: "800" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.dailySched.map((ds,index) => (
                      <tr
                        style={
                          moment(ds.time).isSameOrBefore() ? { backgroundColor: "#59CDFF" } : null
                        }
                        className={
                          moment(ds.time).isSameOrBefore() ? "grommetux-table-row--selected" : ""
                        }
                      >
                        <td>
                          <Timestamp fields="time" value={ds.time} />
                        </td>
                        <td>{ds.task}</td>
                        <td>{ds.location}</td>
                        <td>
                          {d.dailySched[index+1]?moment(d.dailySched[index+1].time).isBefore()?<Status value="ok" />:null:null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            </Tab>
          ))}
        </Tabs>
      </Box>
    );
  }
}

const schedule = [
  {
    name: "2019-03-01",
    dailySched: [
      {
        time: "2019-03-01 16:00",
        task: "Registration",
        location: "Amphitheatre"
      },
      {
        time: "2019-03-01 16:30",
        task: "Opening speeches by USJ & FNF ",
        location: "Amphitheatre"
      },
          {
        time: "2019-03-01 16:45",
        task: "Explanation of the Model Youth Parliament",
        location: "Amphitheatre"
      },
      {
        time: "2019-03-01 17:30",
        task: "Allocation of roles with the identity changer",
        location: "Amphitheatre"
      },
      {
        time: "2019-03-01 18:00",
        task: "Gathering within the PPG with representatives of Lebanese Parties",
        location: "PPG rooms"
      },
      {
        time: "2019-03-01 19:00",
        task:
          "Introduction to the history and role of the Parliament by Simon Mouawad",
          location: "Amphitheatre"
      },
      {
        time: "2019-03-01 20:00",
        task: "First Reading of the draft bills",
        location: "Amphitheatre"
      }
    ]
  },
  {
    name: "2019-03-02",
    dailySched: [
      {
        time: "2019-03-02 9:00",
        task: "Morning briefing: Current state of affairs",
        location: "Amphitheatre"
      },
      {
        time: "2019-03-02 9:30",
        task: "PPG meeting: Getting to know each other, discussion of expectations",
        location: "PPG rooms"
      },
      {
        time: "2019-03-02 10:30",
        task: "Coffee Break",
        location: ""
      },
      {
        time: "2019-03-02 11:00",
        task: "PPG meeting: Setting the PPG’s aims",
        location: "PPG rooms"
      },
      {
        time: "2019-03-02 12:00",
        task: "PPG: Nomination & Election of PPG chairperson",
        location: "PPG rooms"
      },
      {
        time: "2019-03-02 13:00",
        task: "Lunch",
        location: ""
      },
      {
        time: "2019-03-02 14:00",
        task:
          "Committees: Input presentation and Q&A about topics",
          location: "Committee rooms"
      },
      {
        time: "2019-03-02 15:00",
        task: "Committees: Election of Heads of Committee",
        location: "Committee rooms"
      },
      {
        time: "2019-03-02 16:00",
        task: "Coffee Break",
        location: ""
      },
      {
        time: "2019-03-02 16:30",
        task: "Working Groups: Drafting 1 or 2 amendments",
        location:""
      },
      {
        time: "2019-03-02 18:00",
        task: "PPG: Updates, discussion and confirmation of amendments",
        location:"PPG rooms"
      },
      {
        time: "2019-03-02 19:30",
        task: "Deadline for handing over draft amendments to the mentors",
        location:""
      }
    ]
  },
  {
    name: "2019-03-03",
    dailySched: [
      {
        time: "2019-03-03 9:00",
        task: "Morning briefing: Current state of affairs",
        location: "Amphitheatre"
      },
      {
        time: "2019-03-03 9:30",
        task: "Committees: Presentation and discussion of the amendments",
        location: "Committee Rooms"
      },
      {
        time: "2019-03-03 11:00",
        task: "Coffee Break",
        location: ""
      },
      {
        time: "2019-03-03 11:30",
        task: "Working Groups: Finalizing amendments",
        location: ""
      },
      {
        time: "2019-03-03 12:30",
        task: "Lunch",
        location:""
      },
      {
        time: "2019-03-03 13:30",
        task: "PPG: Discussion about decisions & alliances",
        location:"PPG rooms"
      },
      {
        time: "2019-03-03 15:00",
        task: "Coffee Break",
        location:""
      },
      {
        time: "2019-03-03 15:00",
        task: "Deadline for handing over draft amendments to the mentors",
        location:""
      },
      {
        time: "2019-03-03 15:30",
        task: "Committee: Final votes on amendments, finalizing draft bills",
        location:"Committee rooms"
      },
      {
        time: "2019-03-03 17:00",
        task: "PPG: Discussion about committee amendments, approving alliances",
        location:"PPG rooms"
      },
      {
        time: "2019-03-03 20:00",
        task: "Gala Dinner",
        location:""
      },

    ]
  },{
    name: "2019-03-04",
    dailySched: [
      {
        time: "2019-03-04 9:00",
        task: "Arrival at Parliament",
        location:""
      },
      {
        time: "2019-03-04 9:30",
        task: "Debate + voting over draft bills",
        location:"Plenary Hall of the Parliament"
      },
      {
        time: "2019-03-04 11:45",
        task: "Press conference",
        location:"Press conference room of the Parliament"
      },
      {
        time: "2019-03-04 12:30",
        task: "Lunch",
        location:"Library of the Parliament"
      },
      {
        time: "2019-03-04 13:00",
        task: "Evaluation in PPG: Lessons learned from MYP",
        location:"Library of the Parliament"
      },
      {
        time: "2019-03-04 14:00",
        task: "Coffee Break",
        location:""
      },
      {
        time: "2019-03-04 14:30",
        task: "Distribution of certificates, announcement of Winners",
        location:"Library of the Parliament"
      },
    ]
  }
];
