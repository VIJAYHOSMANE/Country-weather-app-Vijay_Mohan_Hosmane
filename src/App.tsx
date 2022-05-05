import React, { useState } from 'react';
import './App.css';


function getData(countryName:string): Promise<any> {
  return fetch(`https://restcountries.com/v3.1/name/${countryName}`)
          .then(res => res.json())
          .then(res => {
                  return res as any
          })
}

function getWeather(city:string): Promise<any> {
  return fetch(`http://api.weatherstack.com/current?access_key=238adc13c0f757a1550ff6c8b6fc84e9&query=${city}`)
          .then(res => res.json())
          .then(res => {
                  return res as any
          })
}
function App() {
  const [values, setValues] = useState({
    country: "",
  });
  const [conVal, setConVal] = useState({
    population:"",
    flg:"",
    lat:"",
    capital:"",
  });
  const [capVal, setCapVal] = useState({
    temp:"",
    icon:"",
    wind:"",
    tz:"",
  });
  const [showCap, setShowCap] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleCountryInput = (event: React.FormEvent<HTMLInputElement>) => {
    setValues({...values, country:event.currentTarget.value});
  }
  const [submitted, setSubmitted] = useState(false);
  const submitHandler = (e : React.SyntheticEvent) => {
    e.preventDefault();
    console.log("submit called with ", values.country)
    setSubmitted(true);
    getData(values.country).then(res => {
      console.log(res[0])
      setConVal({
        population : res[0]['population'],
        lat : res[0]['latlng'],
        flg : res[0]['flag'],
        capital : res[0]["capital"][0]
      })
      setShowResults(true)
      setShowCap(false)
      console.log(conVal)
    })
    
  }
  const handleCapitalClick = (e: any) =>{
    console.log(e.target.innerText);
    getWeather(e.target.innerText).then(res => {console.log(res)
    setCapVal({
      tz : res['location']['timezone_id'],
      temp : res['current']['temperature'],
      wind : res['current']['wind_speed'],
      icon : res['current']['weather_icons'][0],
    });
    setShowCap(true)
    setShowResults(false)

    console.log(capVal);
    });
  }

  return (
    <div className="App">
      <form className='main_form' action="" onSubmit={ submitHandler } method="get">
        <input type="text" onChange={handleCountryInput} value={values.country} className="main_input" name="" placeholder='Country Name' id="main_input" />
        <button className="submit_btn" type='submit'>GO</button>
        {submitted && !values.country ? <div className='no_input_error'>No input detected</div> : null}
      </form>
      
      {showCap ? 
      <section className='capital_section'>
        
        <div className="temp">Temperature : {capVal.temp}</div>
        <div className="icon">Weather Icon : <img src={capVal.icon}  width="30px" /></div>
        <div className="wind">Wind Speed : {capVal.wind}</div>
        <div className="tz">Timezone Id : {capVal.tz}</div>
       
      </section> : null}
      { showResults ?
      <section className='results_section'>
        <div className="population">Population : {conVal.population}</div>
        <div className="capital">Capital : <button onClick={ handleCapitalClick }>{conVal.capital}</button></div>
        <div className="lat">Lat/Lang : {conVal.lat}</div>
        <div className="flg">Flag : {conVal.flg}</div>
      </section>: null}
      
    </div>

  );
}

export default App;
