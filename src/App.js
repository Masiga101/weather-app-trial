import "./styles.css";
import CloudIcon from "@mui/icons-material/Cloud";
import {
  Stack,
  Skeleton,
  Container,
  FormGroup,
  TextField,
  Typography,
  CardContent,
  Grid,
  Divider,
  CardMedia,
  Button,
  Box
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card } from "@material-ui/core";

export default function App() {
  const [data, setData] = useState();
  const [cityName, setCityName] = useState("Nairobi");
  const [inputValue, setInputValue] = useState("");
  const [coord, setCoord] = useState([]);

  //Get coordinates
  const getCoord = () => {
    if (!navigator.geolocation) {
      alert("Please allow website to access location");
    } else {
      navigator.geolocation.getCurrentPosition(
        successFunction,
        failureFunction
      );
    }
    //Get latitude and longitude;
    function successFunction(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      setCoord([lat, long]);
    }
    function failureFunction(position) {
      toast.error("Could Not get Location. Please reload", {
        position: toast.POSITION.TOP_LEFT
      });
    }
  };

  //Get Current City

  const getCurrentCity = () => {
    getCoord();
    fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=pk.6bca6d0285deaf9b096613eebfff9e93&lat=${coord[1]}&lon=${coord[2]}&format=json`
    )
      .then((res) => res.json())
      .then((json) => {
        const cityName = json.address.city;
        return setCityName(cityName);
      })
      .catch((err) => console.log(err.message));
  };

  //Fetch weather Data
  const fetchWeatherData = () => {
    getCurrentCity();
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName.toLowerCase()}&appid=e10d184c8db721edaa25dead64d7b0a5&units=metrick`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        return setData(json);
      })
      .catch((err) => {
        return setData(err);
      });
  };

  function CardComponent({ data }) {
    return data.main ? (
      <Card className="card">
        <CardContent className="content">
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography gutterBottom variant="h5" component="div">
                {cityName}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="h3">{`${(data.main.temp - 273.15).toFixed(
                2
              )}°`}</Typography>
            </Grid>
          </Grid>
          <Divider />

          <Grid
            style={{
              marginTop: "1.5rem"
            }}
            container
            spacing={2}
          >
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={4}>
                  <CloudIcon />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5">
                    Country: {data.sys.country}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xsw={6}>
                {data.weather[0].description}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ) : (
      <Typography
        style={{
          marginTop: "1.5rem"
        }}
        color="error"
        variant="h5"
        warning
      >
        {data.message}. Please key in a valid city Name
      </Typography>
    );
  }

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    setCityName(inputValue);

    setInputValue("");
  };

  useEffect(() => {
    fetchWeatherData();
  }, [cityName]);

  return (
    <Box
      className="app"
      paddingLeft={2}
      paddingRight={2}
      marginBottom={3}
      marginTop={3}
      sx={{ borderRadius: 1, boxShadow: 2 }}
    >
      <h1>Weather App</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <FormGroup>
          <TextField
            value={inputValue}
            variant="outlined"
            label="Enter city name"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            style={{
              marginTop: ".6rem"
            }}
            type="submit"
            variant="contained"
          >
            Submit
          </Button>
        </FormGroup>
      </form>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {data ? (
          <CardComponent data={data} />
        ) : (
          <Skeleton
            style={{
              marginTop: "1.5rem"
            }}
            variant="rectangular"
            width={220}
            height={168}
          />
        )}
      </Box>
    </Box>
  );
}
