import React from "react";
import { Button, Input,message} from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useLocation } from 'react-router';
import 'axios';
import './LandPage.css';
import axios from "axios";
;

export default function LandPage() {
    const navigate = useNavigate();
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

    let [postName, setPostName] = useState("");
    let [postPassword, setPostPassWord] = useState("");

    async function handleLanding(link) {
        const account = postName;
        const url = "http://localhost:8080/employee/"+account.toString();
        const result = await axios.get(url);
        await sleep(1000);
        navigate("/Timetable",{state:result.data});
    }

    return (
        <div className='All'>
            <div className='Header'>
                工時系統
            </div>
            <div className='LandPlace'>
                <div className='LandWord'>登入</div>
                <div style={{ width: 200 }}>
                    <Input placeholder="請輸入用戶名" size='middle' onChange={function (event) {
                        setPostName(event.target.value);
                    }}></Input>
                    <Input.Password placeholder="請輸入密碼" size='middle' onChange={function (event) {
                        setPostPassWord(event.target.value);
                    }}></Input.Password>
                    <Button onClick={() => handleLanding("/Timetable")}>登入</Button>
                </div>
            </div>
        </div>
    )
}