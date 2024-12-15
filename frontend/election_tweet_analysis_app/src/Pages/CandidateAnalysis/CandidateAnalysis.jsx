import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import AppNavbar from "../../Components/AppNavbar/AppNavbar";
import Download from "../../Components/Download/Download";
import Footer from "../../Components/Footer/Footer";

import './CandidateAnalysis.css';

const config = require("../../config.json");

function CandidateAnalysis() {
    const [regionEngagement, setRegionEngagement] = useState([]);

    const [dailyTrendsData, setDailyTrendsData] = useState([]);
    const [candidate, setCandidate] = useState('Trump');
    const [dailyTrendsDataFormat, setDailyTrendsDataFormat] = useState('chart');

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const regionEngagementColumns = [
        { field: 'country', headerName: 'Country', width: 150 },
        { field: 'tweet_about', headerName: 'Candidate', width: 150 },
        { field: 'total_engagement', headerName: 'Total Engagement', type: 'number', width: 250 },
        { field: 'engagement_percentage', headerName: 'Engagement Percentage %', type: 'number', width: 250 }
    ];

    const dailyTrendsColumns = [
        { field: 'tweet_date', headerName: 'Tweet Date', width: 250 },
        { field: 'tweet_count', headerName: 'Number of Tweets', type: 'number', width: 150 },
        { field: 'total_engagement', headerName: 'Total Engagement', type: 'number', width: 250 },
        { field: 'rolling_avg', headerName: 'Rolling Average', type: 'number', width: 250 }
    ];

    const paginationModel = { page: 0, pageSize: 10 };

    // create chart labels by leaving out the time portion of tweet_date
    let dailyTrendsChartData = {
        labels: dailyTrendsData.map((row) => row.tweet_date.substring(0, row.tweet_date.indexOf(" 00:00:00"))),
        datasets: [
            {
                label: "Number of Tweets",
                data: dailyTrendsData.map((row) => row.tweet_count),
                backgroundColor: "#1DA1F2"
            },
            {
                label: "Total Engagement",
                data: dailyTrendsData.map((row) => row.total_engagement),
                backgroundColor: "#8BC34A"
            },
            {
                label: "Engagement (Rolling Average)",
                data: dailyTrendsData.map((row) => row.rolling_avg),
                backgroundColor: "#FFC107"
            }
        ]
    };

    const dailyTrendsChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Daily Engagement Trends By Candidate"
            },
        },
    };

    useEffect(() => {
        fetch(`${config.api_url}/candidate-analysis/region-wise-engagement`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => setRegionEngagement(data))
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    useEffect(() => {
        fetch(`${config.api_url}/candidate-analysis/daily-trends?candidate=${candidate}`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => setDailyTrendsData(data))
            .catch((err) => {
                console.log(err.message);
            })
    }, [candidate]);

    return (
        <div className="body">
            <AppNavbar />
            <h3>Candidate-Wise Engagement By Region</h3>
            <div className="data">
                <Paper sx={{ height: 400, width: '60%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <DataGrid
                        rows={regionEngagement}
                        getRowId={(row) => row.country + row.tweet_about}
                        columns={regionEngagementColumns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[10, 50, 100]}
                        sx={{ border: 0 }}
                    />
                    <Download data={regionEngagement} filename="candidate-region-engagement" />
                </Paper>
            </div>
            <h3>Daily Trends By Candidate</h3>
            <Box className="query-params">
                <FormControl style={{ marginLeft: "2rem" }}>
                    <InputLabel id="candidate-select-label">Candidate</InputLabel>
                    <Select
                        labelId="candidate-select-label"
                        id="candidate-simple-select"
                        label="Candidate"
                        sx={{ width: 150 }}
                        onChange={(event) => setCandidate(event.target.value)}
                        defaultValue={candidate}
                    >
                        <MenuItem value="Trump">Trump</MenuItem>
                        <MenuItem value="Biden">Biden</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <ToggleButtonGroup
                color="primary"
                value={dailyTrendsDataFormat}
                exclusive
                onChange={(event) => setDailyTrendsDataFormat(event.target.value)}
                aria-label="Data View"
                style={{ marginLeft: "2rem", marginBottom: "1rem" }}
            >
                <ToggleButton value="chart">Chart</ToggleButton>
                <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
            <div className="data">
                {dailyTrendsDataFormat === "chart" ? <Bar data={dailyTrendsChartData} options={dailyTrendsChartOptions} />
                    : <Paper sx={{ height: 400, width: '65%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <DataGrid
                            rows={dailyTrendsData}
                            getRowId={(row) => row.tweet_date}
                            columns={dailyTrendsColumns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[10, 50, 100]}
                            sx={{ border: 0 }}
                        />
                        <Download data={dailyTrendsData} filename="daily-trends-by-candidate" />
                    </Paper>}
            </div>
            <Footer />
        </div>
    );
}

export default CandidateAnalysis;