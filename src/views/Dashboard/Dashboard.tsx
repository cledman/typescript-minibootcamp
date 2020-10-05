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
import InputBase from '@material-ui/core/InputBase';
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
  apiResponseRegions?: APIResponseGeneral;
  totalDaysGeneral: number;
  currentCity: string;
  currentLon:number;
  currentLat:number;
  currentLang:string;
  currentSearch:string;
  currentCountry:string;
  mainMessage:string;
  
}

type APIResponse = {
  coord: {
    lon: number;
    lat: number;
  }
  weather: Array<{
    id: number;
    description: string;
    icon:string;
  }>
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max:number;
      humidity:number
  }
  sys:{
    country:string
  }
}

type APIResponseGeneral = {
  list:{
    dt:number;
    id:number;
    name:string;
    main:{
      temp:number;
    };
    weather: Array<{
      id: number;
      description: string;
    }>
    sys:{
      country:string
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
      totalDaysGeneral:5,
      currentCity: "Juiz de Fora",
      currentLon:-43.35,
      currentLat:-21.76,
      currentLang:"pt",
      currentSearch:"",
      currentCountry:"Br",
      mainMessage:"O clima em Juiz de Fora hoje:"
      
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

  }



  componentDidMount = async () => {
    const APPID="c4d9c71fbfaf3e54583129ce84241182";
    
    const URL_CURRENT =`https://api.openweathermap.org/data/2.5/weather?q=${this.state.currentCity}&appid=${APPID}&lang=${this.state.currentLang}&units=metric`;
    const URL_DAYSJF=`https://api.openweathermap.org/data/2.5/forecast?q=${this.state.currentCity}&appid=${APPID}&lang=${this.state.currentLang}&units=metric`;
    const URL_REGION= `https://api.openweathermap.org/data/2.5/find?lat=${this.state.currentLat}&lon=${this.state.currentLon}&cnt=10&appid=${APPID}&lang=pt&units=metric`;

    await fetch(URL_CURRENT)    
    .then((response) => response.json())
    .then((response: APIResponse) => this.setState({ apiResponse: response }));

    await fetch(URL_DAYSJF)    
    .then((response) => response.json())
    .then((response: APIResponseGeneral) => this.setState({ apiResponseGeneral: response }));

    await fetch(URL_REGION)    
    .then((response) => response.json())
    .then((response: APIResponseGeneral) => this.setState({ apiResponseRegions: response }));    
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

  onChange = (e:any) => {
    this.setState({ currentCity: e.target.value} )
  }

  onSubmit = (e:any) => {
    e.preventDefault();

    const APPID="c4d9c71fbfaf3e54583129ce84241182";
    const URL_CURRENT =`https://api.openweathermap.org/data/2.5/weather?q=${this.state.currentCity}&appid=${APPID}&lang=${this.state.currentLang}&units=metric`;
    
    fetch(URL_CURRENT).then((response) => 
    {
      if(response.status == 200){           
        this.setState({mainMessage: `o clima em ${this.state.currentCity} hoje:` })
       fetch(URL_CURRENT)    
       .then((response) => response.json())
       .then((response: APIResponse) => this.setState({ apiResponse: response }));
            
        const URL_REGION= `https://api.openweathermap.org/data/2.5/find?lat=${this.state.apiResponse?.coord.lat}&lon=${this.state.apiResponse?.coord.lon}&cnt=10&appid=${APPID}&lang=pt&units=metric`;
        const URL_DAYSJF=`https://api.openweathermap.org/data/2.5/forecast?q=${this.state.currentCity}&appid=${APPID}&lang=${this.state.currentLang}&units=metric`;

         fetch(URL_REGION)    
         .then((response) => response.json())
         .then((response: APIResponseGeneral) => this.setState({ apiResponseRegions: response }));             

         fetch(URL_DAYSJF)    
         .then((response) => response.json())
         .then((response: APIResponseGeneral) => this.setState({ apiResponseGeneral: response }));        
       }
       else
       {
        this.setState({mainMessage: `Nenhuma cidade encontrada com esse nome.` })
        setTimeout(() => {
          this.setState({mainMessage: `Digite outra cidade` })
        }, 2000);

       } 
        
      })   
      
  }



    handleSearch = (value:string) =>{
        const APPID="c4d9c71fbfaf3e54583129ce84241182";
        this.setState({currentCity: value});    

        const URL_CURRENT =`https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${APPID}&lang=${this.state.currentLang}&units=metric`;


    fetch(URL_CURRENT).then((response) => {
     if(response.status == 200){           
       
      fetch(URL_CURRENT)    
      .then((response) => response.json())
      .then((response: APIResponse) => this.setState({ apiResponse: response }));
      
      
    
       const URL_REGION= `https://api.openweathermap.org/data/2.5/find?lat=${this.state.apiResponse?.coord.lat}&lon=${this.state.apiResponse?.coord.lon}&cnt=10&appid=${APPID}&lang=pt&units=metric`;
       
        fetch(URL_REGION)    
        .then((response) => response.json())
        .then((response: APIResponseGeneral) => this.setState({ apiResponseRegions: response }));             

      } 
       
       }) 

 }



      
      
  render() {
    const { classes } = this.props;
    const { creatingMessage, messageFailed, messageSuccess, apiResponseGeneral, apiResponseRegions, currentCity } = this.state;
    const currentHour = Moment().format('HH'); 
  


    let tempChart: {labels: string[], series: number[][]}  ={
      labels:[],
      series:[]
    }

    let dataChart: {tabledata: string[][]}  ={
      tabledata:[]
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

    if (apiResponseRegions){
     
      const list = apiResponseRegions.list
      
      .slice(3, 8)

      .map((item) => 
      {        
        return [
          item.name ,
          item.main.temp.toFixed(1).toString()+"ºc",
         item.weather[0].description
        ];
      })
      dataChart.tabledata = list;

    }


    return (
      <div>
        <br></br>
        <div id="mainbar">
          <form  onSubmit={this.onSubmit}     >
          <label>Informe uma cidade: </label>
          <input
              placeholder="Informe uma cidade:"
              onChange={this.onChange}
              value={currentCity}
            />

         
            <button type="submit">Procurar</button>
          </form>        
          <TitleSection title={this.state.mainMessage} />
          <div id="mainImage">
            <img className="iconWeather" src={"http://openweathermap.org/img/wn/"+this.state.apiResponse?.weather[0].icon+"@2x.png" }/> <br />
            {this.state.apiResponse?.weather[0].description}
          </div>

          </div>          

        <GridContainer>
          <BlockData
            classes={classes}
            color={"success"}
            content={this.state.apiResponse?.main.temp_min+"ºC"}
            icon={<Accessibility />}
            iconFooter={<Danger />}
            textHeader="Temperatura Máxima"
            textFooter=""
            xs={12}
            sm={3}
            md={3}
          />
          <BlockData
            classes={classes}
            color={"warning"}
            content={this.state.apiResponse?.main.temp_max+"ºC"}
            icon={<Accessibility />}
            iconFooter={<Danger />}
            textHeader="Temperatura Máxima"
            textFooter=""
            xs={12}
            sm={3}
            md={3}
          />
          <BlockData
            classes={classes}
            color={"danger"}
            content={this.state.apiResponse?.main.feels_like+"ºC"}
            icon={<Accessibility />}
            iconFooter={<Danger />}
            textHeader="Sensação términa"
            textFooter=""
            xs={12}
            sm={3}
            md={3}
          />

          <BlockData
            classes={classes}
            color={"info"}
            content={this.state.apiResponse?.main.temp+"ºC"}
            icon={<Accessibility />}
            iconFooter={<Danger />}
            textHeader="Temperatura atual"
            textFooter=""
            xs={12}
            sm={3}
            md={3}
          />
        </GridContainer>
        <TitleSection title="Previsões" />
        
        
        <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
        <input className="slider" type="range" min="5" max="23" defaultValue={currentHour} step="1" onChange={(e) => this.handleChangeDaysResponse(e.target.value)}/>
            <Card chart={true}>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={tempChart}
                  type="Line"
                />
              </CardHeader>

              <CardBody>
                <h4 className={classes.cardTitle}>Temperaturas nas próximas horas</h4>

              </CardBody>
              <CardFooter chart={true}>
                <div className={classes.stats}>
                  <AccessTime /> atualizado às {Moment().format('HH[h]mm') }
                </div>
              </CardFooter>
            </Card>
          </GridItem>          
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>Temperatura em outras cidades</h4>

              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["Cidade", "Temperatura", "Condição"]}
                  tableData={dataChart.tabledata}
                />
              </CardBody>
            </Card>

          </GridItem>
          </GridContainer>
       
    
      
      </div>
    );
  }
}

export default withStyles(dashboardStyle)(Dashboard);
