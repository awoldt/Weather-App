import axios from "axios";
import { useState, useRef } from "react";
import WeatherDetails from "../interfaces/WeatherDetails";
import { Form } from "react-bootstrap";

interface coordinateSearch {
  lat: number;
  lon: number;
}

const X = ({
  setW,
  setIconOpacity,
  w,
  addCity,
  listOfCities,
}: {
  setW: React.Dispatch<React.SetStateAction<WeatherDetails[]>>;
  setIconOpacity: React.Dispatch<React.SetStateAction<number>>;
  w: WeatherDetails[];
  addCity: React.Dispatch<React.SetStateAction<string[]>>;
  listOfCities: string[];
}) => {
  const [query, setQuery] = useState<String>("");

  const inputBarRef = useRef<HTMLInputElement>(null);

  async function searchCity() {
    if (query == "") {
      alert("Enter city before searching");
    } else {
      setIconOpacity(0);

      const req = await axios.get(
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
          query.toLowerCase() +
          "&limit=1&appid=" +
          process.env.REACT_APP_API_KEY
      );
      if (req.status == 200) {
        //if user query actually returned weather data
        if (req.data.length !== 0) {
          //find weather by coordinates
          const c: coordinateSearch = {
            lat: req.data[0].lat,
            lon: req.data[0].lon,
          };

          const req2 = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
              c.lat +
              "&lon=" +
              c.lon +
              "&appid=" +
              process.env.REACT_APP_API_KEY
          );

          const obj = [...w];
          const d: WeatherDetails = {
            cityName: req2.data.name,
            stateName: req.data[0].state,
            mainWeather: req2.data.weather[0].main,
            weatherStats: {
              temp: req2.data.main.temp,
            },
            tempFormat: "F",
          };

          obj.push(d);

          //add city to list of cities displayed
          const q = [...listOfCities];
          q.push(req2.data.name);
          addCity(q);

          setW(obj);

          setIconOpacity(1);
          window.scrollTo(0, document.body.scrollHeight);
        } else {
          alert("Cannot find weather data for " + query);
          setIconOpacity(1);
        }
      } else {
        alert("There was an error processing your request");
      }
    }
  }

  return (
    <>
      <span
        style={{ display: "flex", marginTop: "50px", marginBottom: "50px" }}
      >
        <Form.Control
          ref={inputBarRef}
          style={{ maxWidth: "400px", border: "0px", fontSize: "30px" }}
          type="text"
          placeholder="Search any city"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              if (inputBarRef.current!) {
                inputBarRef.current.value = "";
              }

              searchCity();
            }
          }}
        />
      </span>
    </>
  );
};
export default X;
