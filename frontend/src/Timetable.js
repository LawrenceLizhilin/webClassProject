import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Tabs, DatePicker, Table, Menu, Button, Modal, message, Select, Divider, TimePicker } from 'antd';
import { useLocation } from 'react-router';
import {
    AppstoreOutlined,
    PieChartOutlined,
    DesktopOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import './Timetable.css';
import axios from 'axios';

const { SubMenu } = Menu;
const { TabPane } = Tabs;
const { Option } = Select;
const columns = [
]


export default function Timetable() {
    let [date, setDate] = useState(moment());
    let [pickValue, setPickValue] = useState(moment());
    let [monthCheck, setMonthCheck] = useState(false);
    let [cardVisible, setCardVisible] = useState(false);
    let [absenceVisible, setAbsenceVisible] = useState(false);
    let [selectPattern, setSelectPattern] = useState("");
    let [chooseSingleDay, setChooseSingleDay] = useState(moment());
    let [startDay,setStartDay] = useState(moment());
    let [endDay,setEndDay] = useState(moment());
    let [punchData,setPunchData] = useState([{}]);

    const location = useLocation();
    const employeeImformation = location.state;


    useEffect(()=>{
        async function getPunchData(){
            const result = await axios.get("http://localhost:8080/employee/overtime");
            const filterData = result.data.filter((item) =>  item.employee_id === employeeImformation.employee_id && moment(item.in).format("YYYY-MM") === date.format("YYYY-MM"));
            const resultData = filterData.map((item,index)=>{
                let sign = [item.in];
                sign.forEach(inner => {
                    let day = moment(inner).format("DD");
                    let searchDate = moment(inner).format("YYYY-MM");
                    if(item.employee_id === employeeImformation.employee_id && searchDate === date.format("YYYY-MM")){
                        item[day+''] = item.time_diff;     
                    }           
                })
                return item;
            })
            setPunchData(resultData);
        }
        getPunchData();
    },[date])


    function mGetDate(tempDate) {
        let year = moment(tempDate).toDate().getFullYear();
        let month = moment(tempDate).toDate().getMonth() + 1;
        let d = new Date(year, month, 0);
        return d.getDate();
    }

    function getDuration(startDay,endDay){
        let begin = moment(startDay);
        let over = moment(endDay);
        let duration = over.diff(begin,'days');
        return duration;
    }

    const memorizedColumns = useMemo(() => {
        let clonedColumns = [...columns];
        for (let i = 1; i <= mGetDate(date); i++) {
            let num = i.toString();
            clonedColumns.push({
                key: num, title: num, width: 60,dataIndex: num
            });
        }
        return clonedColumns;
    }, [date]);

    return (
        <div>
            <div>
                <div className='Menu'>
                    <Menu mode="horizontal" theme='dark'>
                        <Menu.Item key="Word" disabled>??????,{employeeImformation.employee_name}!</Menu.Item>
                        <Menu.Item key="Dept" disabled>{employeeImformation.employee_dep}</Menu.Item>
                        <Menu.Item key="Card" icon={<DesktopOutlined />} onClick={function () {
                            setCardVisible(true);
                        }}>
                            ????????????
                        </Menu.Item>
                        <Menu.Item key="Absence" icon={<AppstoreOutlined />} onClick={function () {
                            setAbsenceVisible(true);
                        }}>
                            ????????????
                        </Menu.Item>
                        <Menu.Item key="Update">
                            ????????????
                        </Menu.Item>
                        <Menu.Item key="Confirm">
                            ????????????
                        </Menu.Item>
                        <SubMenu key="check" icon={<PieChartOutlined />} title="????????????">
                            <Menu.Item key="MonthCheck" onClick={function () {
                                setMonthCheck(true);
                            }}>????????????</Menu.Item>
                            <Menu.Item key="clear" onClick={function () {
                                setMonthCheck(false);
                                setDate(moment());
                                setPickValue(moment());
                            }}>??????</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="Modals">
                    <Modal title="????????????" visible={cardVisible} footer={[
                        <Button onClick={function () {
                            setCardVisible(false);
                        }}>??????</Button>,
                        <Button type="primary" onClick={function () {
                            setCardVisible(false);
                            message.info("????????????!");
                        }}>????????????</Button>
                    ]}onCancel={function(){
                        setCardVisible(false);
                    }}>
                        <span>?????????</span><span>{moment().format("YYYY-MM-DD")}</span>
                        <div>?????????????????????????</div>
                    </Modal>
                    <Modal title="????????????" visible={absenceVisible} footer={[
                        <Button onClick={function () {
                            setAbsenceVisible(false);
                        }}>??????</Button>,
                        <Button type="primary" onClick={function () {
                            if(getDuration(startDay,endDay) < 0){
                                message.info("?????????????????????????????????!");
                            }
                            else{
                                setAbsenceVisible(false);
                            message.info("??????????????????!");
                            }
                        }}>????????????</Button>
                    ]}onCancel={function(){
                            setAbsenceVisible(false);
                    }}>
                        <Select className="selectPattern" placeholder="??????????????????" onSelect={function (value) {
                            setSelectPattern(value);
                        }}>
                            <Option value="singleDay">??????????????????</Option>
                            <Option value="multiDays">??????????????????</Option>
                        </Select>
                        <Divider></Divider>
                        {selectPattern === "singleDay" && <div>
                            <DatePicker defaultValue={moment()} onChange={function (date) {
                                setChooseSingleDay(date);
                            }} disabledDate={function (date) {
                                let currentMonth = moment();
                                let calYear = date.toDate().getFullYear();
                                let calMonth = date.toDate().getMonth();
                                let year = currentMonth.toDate().getFullYear();
                                let month = currentMonth.toDate().getMonth();
                                if (calYear === year && calMonth === month) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }} />
                            {chooseSingleDay != null && <div>?????????????????????<span>{chooseSingleDay.format("YYYY-MM-DD")}</span></div>}
                        </div>}
                        {selectPattern === "multiDays" && <div>
                            <span>??????????????????</span><span>{<DatePicker defaultValue={moment()} onChange={function(date){
                                setStartDay(date);
                            }} disabledDate={function(date){
                                let currentMonth = moment();
                                let calYear = date.toDate().getFullYear();
                                let calMonth = date.toDate().getMonth();
                                let year = currentMonth.toDate().getFullYear();
                                let month = currentMonth.toDate().getMonth();
                                if (calYear === year && calMonth === month) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }}></DatePicker>}</span>
                            <span>??????????????????</span><span>{<DatePicker defaultValue={moment()} onChange={function(date){
                                setEndDay(date);
                            }} disabledDate={function(date){
                                let currentMonth = moment();
                                let calYear = date.toDate().getFullYear();
                                let calMonth = date.toDate().getMonth();
                                let year = currentMonth.toDate().getFullYear();
                                let month = currentMonth.toDate().getMonth();
                                if (calYear === year && calMonth === month) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }}></DatePicker>}</span>
                            {startDay != null && endDay!= null && <div>
                                <div>?????????????????????<span>{startDay.format("YYYY-MM-DD")}</span><span>???</span><span>{endDay.format("YYYY-MM-DD")}</span></div>
                                <div>????????????<span>{getDuration(startDay,endDay)}</span>???</div>
                            </div>}
                        </div>}

                    </Modal>
                </div>
                {monthCheck && <div className="datePicker" >
                    <DatePicker allowClear picker="month" placeholder="???????????????"
                        value={pickValue}
                        onSelect={
                            function (value) {
                                setPickValue(value);
                                setDate(value);
                            }
                        } />
                </div>}
            </div>
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="???????????????" key="1">
                        <Table columns={memorizedColumns} scroll={{ x: 'max-content', y: 800 }}
                            pagination={false}
                            bordered ={false}
                            dataSource={punchData}/>
                    </TabPane>
                    <TabPane tab="???????????????" key="2">
                        Content of Tab Pane 2
                    </TabPane>

                </Tabs>
            </div>
        </div>

    )
}

