import React from "react";
import { Button, Input,message} from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandPage.css';

export default function LandPage() {
    const navigate = useNavigate();

    let [postName, setPostName] = useState("");
    let [postPassword, setPostPassWord] = useState("");


    function handleLanding(link) {
        if (postName === "lawrence" && postPassword === "1234") {
            navigate(link);
        }
        else {
            message.info("用戶名或密碼錯誤!")
        }
    }

    return (
        <div className='All'>
            <div className='Header'>
                工時系統
            </div>
            <div className='LandPlace'>
                <div className='LandWord'>登錄</div>
                <div style={{ width: 200 }}>
                    <Input placeholder="請輸入用戶名" size='middle' onChange={function (event) {
                        setPostName(event.target.value);
                    }}></Input>
                    <Input.Password placeholder="請輸入密碼" size='middle' onChange={function (event) {
                        setPostPassWord(event.target.value);
                    }}></Input.Password>
                    <Button onClick={() => handleLanding("/Timetable")}>登錄</Button>
                </div>
            </div>
        </div>
    )
}