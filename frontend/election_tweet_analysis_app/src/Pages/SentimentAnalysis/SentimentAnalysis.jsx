import AppNavbar from "../../Components/AppNavbar/AppNavbar";
import Download from "../../Components/Download/Download";
import Footer from "../../Components/Footer/Footer";

import { useState, useEffect } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from "chart.js";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import './SentimentAnalysis.css';

const config = require("../../config.json");

function SentimentAnalysis() {

    const [trumpData, setTrumpData] = useState([]);
    const [trumpDataFormat, setTrumpDataFormat] = useState('chart');

    const [bidenData, setBidenData] = useState([]);
    const [bidenDataFormat, setBidenDataFormat] = useState('chart');

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
        PointElement,
        LineElement
    );

    const tableColumns = [
        { field: 'week_start', headerName: 'Week Start', width: 250 },
        { field: 'positive', headerName: 'Positive Tweets', type: 'number', width: 150 },
        { field: 'negative', headerName: 'Negative Tweets', type: 'number', width: 150 },
        { field: 'neutral', headerName: 'Neutral Tweets', type: 'number', width: 150 },
        { field: 'tweet_count', headerName: 'Total Tweets', type: 'number', width: 150 }
    ];

    let trumpChartData = {
        labels: trumpData.map((row) => row.week_start),
        datasets: [
            {
                label: "Positive",
                data: trumpData.map((row) => row.positive),
                backgroundColor: "#4CAF50"
            },
            {
                label: "Neutral",
                data: trumpData.map((row) => row.neutral),
                backgroundColor: "#BDBDBD"
            },
            {
                label: "Negative",
                data: trumpData.map((row) => row.negative),
                backgroundColor: "#F44336"
            }
        ]
    };

    let bidenChartData = {
        labels: bidenData.map((row) => row.week_start),
        datasets: [
            {
                label: "Positive",
                data: bidenData.map((row) => row.positive),
                backgroundColor: "#4CAF50"
            },
            {
                label: "Neutral",
                data: bidenData.map((row) => row.neutral),
                backgroundColor: "#BDBDBD"
            },
            {
                label: "Negative",
                data: bidenData.map((row) => row.negative),
                backgroundColor: "#F44336"
            }
        ]
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Weekly Tweet Sentiment Analysis",
            },
        },
        scales: {
            x: {
                stacked: true // stacked bar chart
            },
            y: {
                stacked: true, // stacked bar chart
                beginAtZero: true
            }
        }
    };

    useEffect(() => {
        // sentiment analysis of tweets made about Trump
        fetch(`${config.api_url}/engagement-trends/weekly-sentiment?candidate=Trump`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => setTrumpData(data))
            .catch((err) => {
                console.log(err.message);
            });
        
        // sentiment analysis of tweets made about Biden
        fetch(`${config.api_url}/engagement-trends/weekly-sentiment?candidate=Biden`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => setBidenData(data))
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <div className="body">
            <AppNavbar />
            <h3>Analysis of Tweets made about Trump</h3>
            <ToggleButtonGroup
                color="primary"
                value={trumpDataFormat}
                exclusive
                onChange={(event, newFormat) => setTrumpDataFormat(newFormat)}
                aria-label="Data View"
                style={{ marginLeft: "2rem", marginBottom: "1rem" }}
            >
                <ToggleButton value="chart">Chart</ToggleButton>
                <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
            <div className="data">
                {trumpDataFormat === "chart" ? <Bar data={trumpChartData} options={chartOptions} />
                    : <Paper sx={{ height: 400, width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <DataGrid
                            rows={trumpData}
                            getRowId={(row) => row.week_start}
                            columns={tableColumns}
                            sx={{ border: 0 }}
                        />
                        <Download data={trumpData} filename="analysis-tweets-trump" />
                    </Paper>}
            </div>
            <h3>Analysis of Tweets made about Biden</h3>
            <ToggleButtonGroup
                color="primary"
                value={bidenDataFormat}
                exclusive
                onChange={(event, newFormat) => setBidenDataFormat(newFormat)}
                aria-label="Data View"
                style={{ marginLeft: "2rem", marginBottom: "1rem" }}
            >
                <ToggleButton value="chart">Chart</ToggleButton>
                <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
            <div className="data">
                {bidenDataFormat === "chart" ? <Bar data={bidenChartData} options={chartOptions} />
                    : <Paper sx={{ height: 400, width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                        <DataGrid
                            rows={bidenData}
                            getRowId={(row) => row.week_start}
                            columns={tableColumns}
                            sx={{ border: 0 }}
                        />
                        <Download data={bidenData} filename="analysis-tweets-biden" />
                    </Paper>}
            </div>
            <Footer />
        </div>
    );
}

export default SentimentAnalysis;