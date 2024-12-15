import AppNavbar from "../../Components/AppNavbar/AppNavbar";
import Download from "../../Components/Download/Download";
import Footer from "../../Components/Footer/Footer";

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { TextField } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

import './TopUsers.css';

const config = require("../../config.json");

function TopUsers() {
    const [users, setUsers] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [limit, setLimit] = useState();
    const [order, setOrder] = useState('desc');

    const userColumns = [
        { field: 'user_id', headerName: 'User ID', width: 150 },
        { field: 'user_name', headerName: 'Username', width: 150 },
        { field: 'user_screen_name', headerName: 'User Screen Name', width: 150 },
        { field: 'total_engagement', headerName: 'Total Engagement', type: 'number', width: 250 },
        { field: 'followers', headerName: 'Follower Count', type: 'number', width: 250 },
        { field: 'engagement_to_followers_ratio', headerName: 'Engagement to Followers Ratio', type: 'number', width: 250 }
    ];

    const tweetColumns = [
        { field: 'tweet_id', headerName: 'Tweet ID', width: 150 },
        { field: 'user_name', headerName: 'Username', width: 150 },
        { field: 'user_screen_name', headerName: 'User Screen Name', width: 150 },
        { field: 'tweet', headerName: 'Tweet', width: 550 },
        { field: 'retweet_count', headerName: 'Retweets', type: 'number', width: 100 },
        { field: 'likes', headerName: 'Likes', type: 'number', width: 100 },
        { field: 'source', headerName: 'Source', width: 150 },
        { field: 'created_at', headerName: 'Created At', width: 150 }
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    useEffect(() => {
        fetch(`${config.api_url}/user-engagement/top-users?limit=${limit}&order=${order}`, { mode: 'cors' })
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((err) => {
                console.log(err.message);
            });
    }, [limit, order]);

    // POST API request
    useEffect(() => {
        fetch(`${config.api_url}/user-engagement/popular-tweets`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_ids: userIds
            }),
            mode: 'cors'
        })
            .then((response) => response.json())
            .then((data) => setTweets(data))
            .catch((err) => {
                console.log(err.message);
            })
    }, [userIds])

    return (
        <div className="body">
            <AppNavbar />
            <h3>Top Users by Engagement</h3>
            <Box className="query-params">
                <TextField id="outlined-basic" label="Number of Top Users" style={{ marginLeft: "2rem" }} onChange={(event) => setLimit(event.target.value)} variant="outlined" />
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
            <div className="data">
                <Paper sx={{ height: 400, width: '80%', marginLeft: 'auto', marginRight: 'auto' }}>
                    <DataGrid
                        rows={users}
                        getRowId={(row) => row.user_id}
                        onCellClick={(row) => setUserIds([...userIds, row.row.user_id])}
                        columns={userColumns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 100]}
                        sx={{ border: 0 }}
                    />
                    <Download data={users} filename="top-users-by-engagement" />
                </Paper>
            </div>
            <h3>Tweets by Top Users</h3>
            <div className="data">
                <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={tweets}
                        getRowId={(row) => row.tweet_id}
                        columns={tweetColumns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10, 100]}
                        sx={{ border: 0 }}
                    />
                    <Download data={tweets} filename="tweets-by-top-users" />
                </Paper>
            </div>
            <Footer />
        </div>
    );
}

export default TopUsers;