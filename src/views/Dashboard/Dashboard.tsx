import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
import CheckIcon from "@material-ui/icons/Check";
// core components
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import Table from "../../components/Table/Table";
import Tasks from "../../components/Tasks/Tasks";
import CustomTabs from "../../components/CustomTabs/CustomTabs";
import Danger from "../../components/Typography/Danger";
import Card from "../../components/Card/Card";
import Button from "../../components/CustomButtons/Button";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";

import { bugs, website, server } from "../../variables/general";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "../../variables/charts";

import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle";
import CustomInput from "../../components/CustomInput/CustomInput";
import Success from "../../components/Typography/Success";

import TitleSection from "../../components/Title/Title";
import BlockData from "../../components/Block/Block";
import Moment from 'moment';

import "../../assets/css/otherComponents.css";

interface Props {
  classes: any;
}

interface State {
  value: number;
  creatingMessage: boolean;
  messageSuccess: boolean;
  messageFailed: boolean;
  apiResponse?: APIResponse;
  apiResponseGeneral?: APIResponseGeneral;
  totalDaysGeneral: number;
  
}

type APIResponse = {
  coord: {
    lon: number;
    lat: number;
  }
  weather: Array<{
    id: number;
    description: string;
  }>
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max:number;
    humidity:number
  }
}

type APIResponseGeneral = {
  list:{
    dt:number;
    main:{
      temp:number;
    }
  }[] 
}


class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: 0,
      creatingMessage: false,
      messageSuccess: true,
      messageFailed: true,
      totalDaysGeneral:5
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
  }



  componentDidMount(){
    const APPID="c4d9c71fbfaf3e54583129ce84241182";
    const URL_BRASIL ="https://api.openweathermap.org/data/2.5/weather?q=brasil&appid=c4d9c71fbfaf3e54583129ce84241182&units=metric";
    const URL_5DAYS="https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=-10&lon=-55&dt=1601596800&appid=c4d9c71fbfaf3e54583129ce84241182&units=metric"
    const URL_5DAYSJF="https://api.openweathermap.org/data/2.5/forecast?q=juiz%20de%20fora&appid=c4d9c71fbfaf3e54583129ce84241182&lang=pt&units=metric";
    
    fetch(URL_BRASIL)    
    .then((response) => response.json())
    .then((response: APIResponse) => this.setState({ apiResponse: response }));


     fetch(URL_5DAYSJF)    
    .then((response) => response.json())
    .then((response: APIResponseGeneral) => this.setState({ apiResponseGeneral: response }));

  }


  handleChange = (event: any, value: number) => {
    this.setState({ value });
  };

  handleChangeIndex = (index: number) => {
    this.setState({ value: index });
  };

  handleChangeDaysResponse = (value:string) =>{
    let idx = parseInt(value);
    this.setState({totalDaysGeneral:idx });
  }



  render() {
    const { classes } = this.props;
    const { creatingMessage, messageFailed, messageSuccess, apiResponseGeneral } = this.state;


    let tempChart: {labels: string[], series: number[][]}  ={
      labels:[],
      series:[]
    }
    
    if (apiResponseGeneral){
      
      const list = apiResponseGeneral.list.slice(0, this.state.totalDaysGeneral)
      tempChart = {
        labels : list.map((item) => 
        Moment(item.dt * 1000).format("HH[h]MM")
        ),
        series:[
          list.map((item)=>{
            return item.main.temp
          })
        ],
      }      
    }
    return (
      <div>
        <TitleSection title="O clima no Brasil hoje" />
        <GridContainer>
          <BlockData
            classes={classes}
            color={"success"}
            content={this.state.apiResponse?.main.temp_min}
            icon={<Accessibility />}
            iconFooter={<DateRange />}
            textHeader="Temperatura Mínima"
            textFooter="Rodapé"
            xs={12}
            sm={3}
            md={3}
          />
          <BlockData
            classes={classes}
            color={"warning"}
            content={this.state.apiResponse?.main.temp_max}
            icon={<Accessibility />}
            iconFooter={<Danger />}
            textHeader="Temperatura Máxima"
            textFooter="Rodapé"
            xs={12}
            sm={3}
            md={3}
          />
          <BlockData
            classes={classes}
            color={"danger"}
            content={this.state.apiResponse?.main.feels_like}
            icon={<Accessibility />}
            iconFooter={<Danger />}
            textHeader="Sensação términa"
            textFooter="Rodapé"
            xs={12}
            sm={3}
            md={3}
          />

          <BlockData
            classes={classes}
            color={"info"}
            content={this.state.apiResponse?.main.humidity}
            icon={<Accessibility />}
            iconFooter={<Danger />}
            textHeader="Umidade"
            textFooter={"Atualizado"}
            xs={12}
            sm={3}
            md={3}
          />
        </GridContainer>
        <TitleSection title="Parte 2" />
        
        
        
        <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
        <input className="slider" type="range" min="5" max="23" defaultValue="7" step="1" onChange={(e) => this.handleChangeDaysResponse(e.target.value)}/>
            <Card chart={true}>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={tempChart}
                  type="Line"
                />
              </CardHeader>

              <CardBody>
                <h4 className={classes.cardTitle}>Temperaturas nas últimas horas</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in today sales.
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> updated 4 minutes ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>          
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
                <p className={classes.cardCategoryWhite}>
                  New employees on 15th September, 2016
                </p>
              </CardHeader>
              <CardBody>
                {
                 //this.state.apiResponseGeneral?.hourly.map((item) =>{
                 //  return item.temp
                // })
                 
                //console.log(this.state.apiResponseGeneral?.hourly)                  
                }
                <Table
                  tableHeaderColor="warning"
                  tableHead={["ID", "Name", "Salary", "Country"]}
                  tableData={[
                    ["1", "Dakota Rice", "$36,738", "Niger"],
                    ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                    ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                    ["4", "Philip Chaney", "$38,735", "Korea, South"],
                  ]}
                />
              </CardBody>
            </Card>
          </GridItem>
          </GridContainer>
        <TitleSection title="Parte 3" />
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart={true}>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={dailySalesChart.data}
                  type="Line"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Daily Sales</h4>
                <p className={classes.cardCategory}>
                  <span className={classes.successText}>
                    <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                  </span>{" "}
                  increase in today sales.
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> updated 4 minutes ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart={true}>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={emailsSubscriptionChart.data}
                  type="Bar"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Email Subscriptions</h4>
                <p className={classes.cardCategory}>
                  Last Campaign Performance
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <Card chart={true}>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={completedTasksChart.data}
                  type="Line"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Completed Tasks</h4>
                <p className={classes.cardCategory}>
                  Last Campaign Performance
                </p>
              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> campaign sent 2 days ago
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
    
        <GridContainer>
          <GridItem xs={12}>
            <Card>
              <CardHeader color="success">
                <div className={classes.messages}>
                  <h4 className={classes.cardTitleWhite}>
                    Mensagens Positivas
                  </h4>
                  {!creatingMessage && (
                    <Button
                      color="transparent"
                      variant="outlined"
                      onClick={() => this.setState({ creatingMessage: true })}
                    >
                      Enviar Mensagem
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {!creatingMessage ? (
                  <React.Fragment>
                    <h5 className={classes.cardTitle}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Cras ac est pulvinar, tempor turpis id, vehicula magna.
                    </h5>
                    <p className={classes.cardCategory}>Jane Doe</p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <GridContainer>
                      <GridItem xs={12}>
                        <CustomInput
                          labelText="Nome"
                          id="name"
                          color="success"
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12}>
                        <CustomInput
                          labelText="Mensagem"
                          id="message"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 5,
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </React.Fragment>
                )}
              </CardBody>
              {creatingMessage && (
                <CardFooter>
                  <Button
                    color="danger"
                    onClick={() => this.setState({ creatingMessage: false })}
                  >
                    Cancelar
                  </Button>
                  <Button color="success">Enviar Mensagem</Button>
                </CardFooter>
              )}
              {messageFailed && (
                <CardFooter>
                  <div className={classes.stats}>
                    <Danger>
                      <Warning />
                      Falha ao enviar mensagem
                    </Danger>
                  </div>
                </CardFooter>
              )}
              {messageSuccess && (
                <CardFooter>
                  <div className={classes.stats}>
                    <Success>
                      <CheckIcon />
                      Mensagem enviada com sucesso
                    </Success>
                  </div>
                </CardFooter>
              )}
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(dashboardStyle)(Dashboard);
