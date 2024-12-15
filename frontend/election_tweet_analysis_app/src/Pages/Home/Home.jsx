import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import AppNavbar from '../../Components/AppNavbar/AppNavbar';
import Footer from '../../Components/Footer/Footer';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import trump_img from '../../Assets/trump.png';
import biden_img from '../../Assets/biden.png';

const config = require("../../config.json");

function Home() {
    const [trumpStats, setTrumpStats] = useState({});
    const [bidenStats, setBidenStats] = useState({});

    const [startDate, setStartDate] = useState(dayjs('2020-10-15'));
    const [endDate, setEndDate] = useState(dayjs('2020-11-08'));

    const [totalTweets, setTotalTweets] = useState();
    const [uniqueUsers, setUniqueUsers] = useState();

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const data = {
        labels: ['Total Tweets', 'Total Retweets', 'Total Likes'],
        datasets: [
            {
                label: 'Trump',
                data: [trumpStats.total_tweets, trumpStats.total_retweets, trumpStats.total_likes],
                backgroundColor: 'rgba(255, 0, 0)',
            },
            {
                label: 'Biden',
                data: [bidenStats.total_tweets, bidenStats.total_retweets, bidenStats.total_likes],
                backgroundColor: 'rgba(0, 21, 188)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Trump vs Biden Statistics',
                color: 'black',
                font: {
                    size: 24,
                    family: 'Segoe UI'
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Metrics',
                    font: {
                        size: 15
                    }
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        fetch(`${config.api_url}/homepage/tweet-stats-by-candidate`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => {
                for (let i in data) {
                    if (data[i].tweet_about === 'Trump') {
                        setTrumpStats(data[i]);
                    } else {
                        setBidenStats(data[i]);
                    }
                }
            })
            .catch((err) => {
                console.log(err.message);
            })
    }, []);

    // make API call when the date range is changed
    useEffect(() => {
        fetch(`${config.api_url}/homepage/overview?start_date=${dayjs(startDate).format('YYYY-MM-DD')}&end_date=${dayjs(endDate).format('YYYY-MM-DD')}`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => {
                setTotalTweets(data.total_tweets);
                setUniqueUsers(data.unique_users);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [startDate, endDate]);

    return (
        <>
            <AppNavbar />
            <h3 style={{ textAlign: "center" }}>Welcome to PollPulse!</h3>

            <div className='intro'>
                <p className='para-text'>The 2020 US Presidential Election generated immense discussion on Twitter, with users sharing their thoughts on both candidates, Joe Biden and Donald Trump. This application provides insights into key trends, user behaviors, and geographic patterns by utilizing complex SQL queries on structured tweet data. The application can be used by political analysts, researchers, and data scientists to derive meaningful information from the election conversation.</p>
            </div>

            <div className="trump-container">
                <div className="trump-thumb"><img src={trump_img} alt="Donald Trump" /></div>
                <div className="candidate-content">
                    <p className="candidate-title">Here are some statistics of tweets made about Donald Trump</p>
                    <Row>
                        <Col xs={6} md={4}>
                            Total Tweets <br /> {trumpStats.total_tweets}
                        </Col>
                        <Col xs={6} md={4}>
                            Total Retweets <br /> {trumpStats.total_retweets}
                        </Col>
                        <Col xs={6} md={4}>
                            Total Likes <br /> {trumpStats.total_likes}
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="biden-container">
                <div className="candidate-content">
                    <p className="candidate-title">Here are some statistics of tweets made about Joe Biden</p>
                    <Row>
                        <Col xs={6} md={4}>
                            Total Tweets <br /> {bidenStats.total_tweets}
                        </Col>
                        <Col xs={6} md={4}>
                            Total Retweets <br /> {bidenStats.total_retweets}
                        </Col>
                        <Col xs={6} md={4}>
                            Total Likes <br /> {bidenStats.total_likes}
                        </Col>
                    </Row>
                </div>
                <div className="biden-thumb"><img src={biden_img} alt="Joe Biden" /></div>
            </div>

            <div className='chart-box'>
                <Bar options={options} data={data} />
            </div>
            <div className='overview'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <p className='overview-stats' style={{ marginRight: '0.5rem' }}>Between</p>
                    <DatePicker label="Start Date" defaultValue={startDate} minDate={dayjs('2020-10-15')} maxDate={endDate} onChange={(newValue) => setStartDate(newValue)} />
                    <p className='overview-stats' style={{ marginRight: '0.5rem', marginLeft: '0.5rem' }}> and </p>
                    <DatePicker label="End Date" defaultValue={endDate} minDate={startDate} maxDate={dayjs('2020-11-08')} onChange={(newValue) => setEndDate(newValue)} />
                    <p className='overview-stats' style={{ marginLeft: '0.5rem' }}>,there have been <strong>{totalTweets}</strong> tweets by <strong>{uniqueUsers}</strong> unique users.</p>
                </LocalizationProvider>
            </div>
            <Footer />
        </>
    );
}

export default Home;