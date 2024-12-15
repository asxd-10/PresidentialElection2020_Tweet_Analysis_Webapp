import { useEffect, useState } from "react";
import AppNavbar from "../../Components/AppNavbar/AppNavbar";
import Download from "../../Components/Download/Download";
import Footer from "../../Components/Footer/Footer";

import { Chart } from 'react-google-charts';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TextField } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from "@mui/material/Box";

import './CountryCityAnalysis.css';

const config = require("../../config.json");

function CountryCityAnalysis() {
    const [geoChartData, setGeoChartData] = useState([]);
    const [geoChartDataFormat, setGeoChartDataFormat] = useState('map');

    const [groupedBarChartData, setGroupedBarChartData] = useState([]);
    const [groupedBarChartDataFormat, setGroupedBarChartDataFormat] = useState('chart');

    const [cityLimit, setCityLimit] = useState();
    const [sortMetric, setSortMetric] = useState('tweet_count');
    const [order, setOrder] = useState('desc');

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const geoChartColumns = [
        { field: 'country', headerName: 'Country', width: 250 },
        { field: 'tweet_count', headerName: 'Number of Tweets', type: 'number', width: 350 },
    ];

    const groupedBarChartColumns = [
        { field: 'city', headerName: 'City', width: 250 },
        { field: 'tweet_count', headerName: 'Number of Tweets', type: 'number', width: 350 },
        { field: 'retweets', headerName: 'Number of Retweets', type: 'number', width: 350 },
        { field: 'likes', headerName: 'Number of Likes', type: 'number', width: 350 }
    ];

    const geoChartPaginationModel = { page: 0, pageSize: 25 };
    const groupedBarChartPaginationModel = { page: 0, pageSize: 5 };

    useEffect(() => {
        fetch(`${config.api_url}/geographic-analysis/most-tweets-by-country`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => setGeoChartData(data))
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    // check all country names
    const finalGeoChartData = [
        ["Country", "Number of Tweets"],
        ...geoChartData.map((row) => [handleCountryNames(row.country), row.tweet_count])
    ];

    const geoChartOptions = {
        colorAxis: { minValue: 1, maxValue: 172473, colors: ["#E3F2FD", "#4CAF50"] },
        backgroundColor: "#FFFFFF",
        datalessRegionColor: "#cccccc",
        defaultColor: "#FFFFFF",
    };

    let groupedBarChart = {
        labels: groupedBarChartData.map((row) => row.city),
        datasets: [
            {
                label: "Number of Tweets",
                data: groupedBarChartData.map((row) => row.tweet_count),
                backgroundColor: "#1DA1F2"
            },
            {
                label: "Number of Retweets",
                data: groupedBarChartData.map((row) => row.retweets),
                backgroundColor: "#4CAF50"
            },
            {
                label: "Number of Likes",
                data: groupedBarChartData.map((row) => row.likes),
                backgroundColor: "#FF6F61"
            }
        ]
    };

    const groupedBarChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Number of Tweets, Likes, and Retweets by City",
            },
        },
    };

    // function to ensure country names abide by google charts naming conventions
    function handleCountryNames(country) {
        if (country === "United States of America") {
            return "United States";
        } else if (country === "The Netherlands") {
            return "Netherlands";
        } else {
            return country;
        }
    }

    useEffect(() => {
        fetch(`${config.api_url}/geographic-analysis/city-level-analysis?limit=${cityLimit}&sort_by=${sortMetric}&order=${order}`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => setGroupedBarChartData(data))
            .catch((err) => {
                console.log(err.message);
            });
    }, [cityLimit, sortMetric, order]);

    return (
        <div className="body">
            <AppNavbar />
            <h3>Number of Tweets By Country</h3>
            <ToggleButtonGroup
                color="primary"
                value={geoChartDataFormat}
                exclusive
                onChange={(event, newFormat) => setGeoChartDataFormat(newFormat)}
                aria-label="Data View"
                style={{ marginLeft: "2rem", marginBottom: "1rem" }}
            >
                <ToggleButton value="map">Map</ToggleButton>
                <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
            <div className="data">
                {geoChartDataFormat === "map" ? <Chart
                    chartType="GeoChart"
                    data={finalGeoChartData}
                    options={geoChartOptions}
                    width="90%"
                    height="500px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                /> : <Paper sx={{ height: 400, width: '45%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <DataGrid
                        rows={geoChartData}
                        getRowId={(row) => row.country}
                        columns={geoChartColumns}
                        initialState={{ pagination: { geoChartPaginationModel } }}
                        pageSizeOptions={[25, 50, 100]}
                        sx={{ border: 0 }}
                    />
                    <Download data={geoChartData} filename="number-of-tweets-by-country" />
                </Paper>}
            </div>
            <h3>Tweet Engagement By City</h3>
            <Box className="query-params">
                <TextField id="outlined-basic" label="Number of Cities" style={{ marginLeft: "2rem" }} onChange={(event) => setCityLimit(event.target.value)} variant="outlined" />
                <FormControl style={{ marginLeft: "2rem" }}>
                    <InputLabel id="engagement-metric-select-label">Sort Metric</InputLabel>
                    <Select
                        labelId="engagement-metric-select-label"
                        id="engagement-metric-simple-select"
                        label="Sort Metric"
                        sx={{ width: 150 }}
                        onChange={(event) => setSortMetric(event.target.value)}
                        defaultValue={sortMetric}
                    >
                        <MenuItem value="city">City</MenuItem>
                        <MenuItem value="tweet_count">Number of Tweets</MenuItem>
                        <MenuItem value="retweets">Number of Retweets</MenuItem>
                        <MenuItem value="likes">Number of Likes</MenuItem>
                    </Select>
                </FormControl>
                <FormControl style={{ marginLeft: "2rem" }}>
                    <FormLabel id="demo-radio-buttons-group-label">Sorting Order</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        defaultValue={order}
                    >
                        <FormControlLabel value="asc" onChange={(event) => setOrder(event.target.value)} control={<Radio />} label="Ascending" />
                        <FormControlLabel value="desc" onChange={(event) => setOrder(event.target.value)} control={<Radio />} label="Descending" />
                    </RadioGroup>
                </FormControl>
            </Box>
            <ToggleButtonGroup
                color="primary"
                value={groupedBarChartDataFormat}
                exclusive
                onChange={(event, newFormat) => setGroupedBarChartDataFormat(newFormat)}
                aria-label="Data View"
                style={{ marginLeft: "2rem", marginBottom: "1rem" }}
            >
                <ToggleButton value="chart">Chart</ToggleButton>
                <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
            <div className="data">
                {groupedBarChartDataFormat === "chart" ? <Bar data={groupedBarChart} options={groupedBarChartOptions} />
                    : <Paper sx={{ height: 400, width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <DataGrid
                            rows={groupedBarChartData}
                            getRowId={(row) => row.city}
                            columns={groupedBarChartColumns}
                            initialState={{ pagination: { groupedBarChartPaginationModel } }}
                            pageSizeOptions={[5, 10, 100]}
                            sx={{ border: 0 }}
                        />
                        <Download data={groupedBarChartData} filename="tweet-engagement-by-city" />
                    </Paper>}
            </div>
            <Footer />
        </div>
    );
}

export default CountryCityAnalysis;