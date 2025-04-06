import { useEffect, useState } from 'react';
import './weatherapp.css';
import { getWeatherData, useWeatherAPIContext, WeatherContext } from './data';
import { CloseIcon, DirectionIcon, RainCloudIcon, SearchIcon } from "./icons";


function TempCheck({ degreeType }) {
  // const [selected, setSelected] = useState(check);
  // const weather = useWeatherAPIContext();
  return (
    <label>
      <input type={"radio"} name='temperatureDegreeType' className='temp-type'/>
      <span>°{degreeType}</span>
    </label>
  );
}

function WeatherCard({day, temp, min_temp}) {
  return (
    <div className='weatherCard'>
      <h3>{day}</h3>
      <div className='weather-icon' style={{height: "40px"}}>
        <img src='/icons/heavy-rain.png' height={"100%"} alt='heavy-rain' />
      </div>
      <p>{temp}° - <span className='wct'>{min_temp}°</span></p>
    </div>
  );
}

function WeatherHighLightCards({ children }) {
  return(
    <div className='Dayout'>
      { children }
    </div>
  )
}

function Avatar({src, onClick}) {
  return <div className='avatar' onClick={() => onClick()}>
    <img src={src} alt="Avatar" />
  </div>
}

// `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
//     mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`

function NavbarTabs({ tabs }) {

  const [active, setActive] = useState("today");

  return (
    <div className="navbar-tabs">
      {
      tabs.map((tab) =>
        <button key={tab.title} className={active === tab.id ? "active": ""} onClick={() => {setActive(tab.id); if (tab.callback) tab.callback(tab.id);}}>
          {tab.title}
        </button>)
      }
    </div>
  );
}


function Searchfield({ placeholder }) {
  
  return(
    <div className='searchButton'> 
      <img src={SearchIcon} alt= 'search' style={{ height: "60%" }}/>
      <input type="text" placeholder={placeholder} />

        <img src="https://img.icons8.com/ios/50/null/compass-west--v2.png" style={{ filter: "drop-shadow(0 0 12px blue)"}} alt='location'/>

    </div>
  );
}

function Divider() {
  return <hr style={{ width: "100%", height: "2px", background: "rgb(206 169 169 / 18%)", border: "none",  margin: "20px auto" }}/>
}


function GetWeatherIconImage({ temperature, description }) {
  let src = temperature <= 22 ? "cloudy_with_sun.png" : "sun.png";
  return (
    <div className='ImageContainer' style={{ width: "80%", position: "relative" }}>
      <img src={`/icons/${src}`} alt={description} style={{ width: "100%", zIndex: 1, filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.2))" }} />
    </div>
  );
}

/**
 * 
 * @param {{time: Date}} 
 * @returns 
 */
function FormatTime(time) {
  time = new Date(time*1000);
  
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const formatted = `${days[time.getDay()]}, ${time.getHours() < 10 ? ` 0${time.getHours()}`: ` 0${time.getHours()-12}`}:${time.getMinutes() < 10 ? `0${time.getMinutes()}`: time.getMinutes()} ${time.getHours()> 12 ? "PM" : "AM"}`;
  return formatted;
}

function AsideBar() {
  const {weatherData: WeatherData} = useWeatherAPIContext();

  useEffect(()=> {
    console.log(WeatherData);
  })

  return (
    <aside>
      <Searchfield placeholder={"Search for places..."} />
      <GetWeatherIconImage temperature={Math.round(WeatherData?.main.temp)} description={WeatherData?.weather[0].description} />
      {
        WeatherData ? 
        <>
          <p style={{ position: "relative", fontSize: "4rem", margin: "20px auto"}}>{Math.round(WeatherData?.main.temp)}°<span style={{position:"absolute", top: "10%", fontSize: "2.4rem"}}>C</span></p>
          
          <p style={{ margin: "20px auto"}}>
            {FormatTime(WeatherData?.dt)}
          </p>
          <Divider />
          <h3 style={{
            textTransform: "capitalize",
            display: 'flex',
            alignItems: "center", 
            height: "40px",
            fontSize: "1.2rem"
          }}>
            <img src="https://img.icons8.com/neon/96/null/experimental-cloud-neon.png" alt='cloud'/> {WeatherData?.weather[0].description}
          </h3>

          <h6 style={{
            textTransform: "capitalize",
            display: 'flex',
            alignItems: "center", 
            height: "40px",
            fontSize: "1.2rem"
          }}><img src={RainCloudIcon} alt='rain cloud' /> Rain -30%</h6> 
        </>: ""
      }

    </aside>
  );
}

function TodaysInfoCard() {
  return (
    <div className='todaysinfocard'>

    </div>
  );
}

function TodaysHighLight() {
  const { weatherData } = useWeatherAPIContext();
  if (!weatherData) return <div>No Internet Connection</div>
  const { wind } = weatherData;


  function WindDirection({ degree }) {

    const directionRange = { 
      "N": [348.75, 11.25 + 348.75], 
      "NNE":[11.25,33.75],
      "NE":[33.75,56.25], 
      "ENE":[56.25,78.75],
      "E":[78.75,101.25],
      "ESE":[101.25,123.75],
      "SE":[123.75,146.25],
      "SSE":[146.25,168.75],
      "S":[168.75,191.25],
      "SSW":[191.25,213.75],
      "SW":[213.75,236.25],
      "WSW":[236.25,258.75],
      "W":[258.75,281.25],
      "WNW":[281.25,303.75],
      "NW":[303.75,326.25],
      "NNW":[326.25,348.75]
    }

    let direction;

    for (const key in directionRange) {
      if (Object.hasOwnProperty.call(directionRange, key)) {
        const dir = directionRange[key];
        if (degree > dir[0] && degree < dir[1]) {
          direction = key
          break;
        }
      }
    }

    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "40px"
      }}>
        <img src={DirectionIcon} alt="Wind Direction" style={{ 
          marginRight: "8px",  
          width: "100%", 
          height: "100%", 
          transform: `rotate(${-45 + degree}deg)`
        }} title={`${degree} deg`} />
          <span>{direction}</span>
      </div>
    );
  }


  return (
  <div className='highlights'>
    <h1>Today's Highlight</h1>
    <div className='temperaturecards'>

      {wind ? <WeatherHighLightCards>
        <div className='cardHeading'>
          <h2>Wind Status</h2>
        </div>
        <div className='cardContent'>
          <p style={{fontSize: "2.7rem"}}>{wind?.speed} <span style={{fontSize: "1.1rem"}}>km/h</span></p>
          <WindDirection degree={wind?.deg} />
        </div>
      </WeatherHighLightCards>: ""}

      <WeatherHighLightCards>
        <div className='cardHeading'>
          <h2>Sunrise & Sunset</h2>
        </div>
        <div className='cardContent'>
          <img src='' alt='' />
          {FormatTime(weatherData?.sys?.sunrise)}
          <span style={{ color: "rgba(0, 0, 0, 0.4)", textAlign: "right"}}>Sunrise</span>
          <img src='' alt='' />
          {FormatTime(weatherData?.sys?.sunset)}
          <span style={{ color: "rgba(0, 0, 0, 0.4)", textAlign: "right"}}>Sunset</span>
        </div>
      </WeatherHighLightCards>
      <WeatherHighLightCards>
        <div className='cardHeading'>
          <h2>Humidity</h2>
        </div>
        <div className='cardContent' style={{ alignItems: "center"}}>
          <span style={{fontSize: "2.4rem", fontWeight: "500"}}>{weatherData?.main?.humidity}%</span>
        </div>
      </WeatherHighLightCards> 
        
      <WeatherHighLightCards>
        <div className='cardHeading'>
          <h2>visibility</h2>
        </div>
        <div className='cardContent'>
          <span>5.2 km</span>
          <span>Average</span>
        </div>
      </WeatherHighLightCards>

      <WeatherHighLightCards>
        <div className='cardHeading'>
          <h2>Air Quality</h2>
        </div>
        <div className='cardContent'>
          <span>105</span>
          <span>Unhealthy</span>
        </div>
      </WeatherHighLightCards>

      </div>
    </div>
  );
}

function Popup({children, open, onClose}) {

  return (
    <div className='popup-container' style={{ display: open ? "flex" : "none" }}>
      <div style={{ 
        position: "absolute", 
        top: "0", 
        left: "0", 
        width: "100%", 
        height: "100%" 
      }} onClick={() => {onClose()}}></div>
      <div className='popup-contents'>
        <button className='close-btn' onClick={() => onClose()}>
          <img alt='close-btn-icon' src={CloseIcon} />
        </button>
        {children}
      </div>
    </div>
  );
}

function WeeklyForecast({ active }) {

  const { weekdays } = useWeatherAPIContext();
  let component;

  switch (active) {
    case "today":
      component = <TodaysInfoCard />;
      break;
    case "week":
      component = <>
        {weekdays.map((week) => <WeatherCard day={week.weekday} temp={week.temperature} min_temp={week.min_temp} key={week.weekday} />)}
      </>;
      break;
    case "indore":
      component = <div className='todaysinfocard'>
        Indore
      </div>;
      break;
    default:
      break;
  }

  return (
    <div className='forecast'>
      {component}
    </div>
  );
}


function App() {
  // const [value, setValue] = useState("212")
  const { setWeatherData } = useWeatherAPIContext();
  const [active, setActive] = useState("today");
  
  const [popupContents, setPopupContents] = useState(<></>);
  const [popupState, setPopupState] = useState(false);


  const tabs = [
    {
      title: "Today", id: "today", 
      callback: (id) => {
        setActive("today");
      }
    },
    {
      title: "Week", id: "week",
      callback: (id) => {
        setActive("week");
      }
    },
    {
      title: "Indore", id: "indore",
      callback: (id) => {
        setActive("indore");
      }
    }
  ];
  
  
  useEffect(() => { 
    getWeatherData()
    .then(result => {
      setWeatherData(result);
    });
  }, []);

  return (
    <>
      <Popup open={popupState} onClose={() => { setPopupContents(<></> ); setPopupState(false) }}>
        {popupContents}
      </Popup>
      <div className='app-container'>
      <AsideBar />
      <main>
        <div className='navbar'>
          <nav>
            <div className='navbar-container'>
              <NavbarTabs tabs={tabs} />
              <div className='navbar-controls-avatar'>
                <TempCheck degreeType="C" checked={true} />
                <TempCheck degreeType="F" />
                {/* <input type={"text"} value={value} /> */}
                <Avatar onClick={() => {
                  setPopupContents(
                    <h1>Avatar</h1>
                  );
                  setPopupState(true);
                }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgBhcplevwUKGRs1P-Ps8Mwf2wOwnW_R_JIA&usqp=CAU" />
              </div>
            </div>
          </nav>
        </div>

        {/* WeaklyForecast */}
        <WeeklyForecast active={active} />
        
        <TodaysHighLight />
      </main>
    </div>
    </>
  );
}


function WeatherDataProvider({children}) {
  const [weatherData, setWeatherData] = useState();
  const weekdays = [{weekday: "Sun", temperature: "13", min_temp: 4}, {weekday: "Mon", temperature: "12"},
  {weekday: "Tue", temperature: "12"},{weekday: "Wed", temperature: "12"},
  {weekday: "Thu", temperature: "12"},{weekday: "Fri", temperature: "12"},
  {weekday: "Sat", temperature: "12"}];
  
  return (
    <WeatherContext.Provider value={{weatherData, setWeatherData, weekdays}}>
      <App />
    </WeatherContext.Provider>
  );
}

export default WeatherDataProvider;