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
                        <Menu.Item key="Word" disabled>欢迎,{employeeImformation.employee_name}!</Menu.Item>
                        <Menu.Item key="Dept" disabled>{employeeImformation.employee_dep}</Menu.Item>
                        <Menu.Item key="Card" icon={<DesktopOutlined />} onClick={function () {
                            setCardVisible(true);
                        }}>
                            上班打卡
                        </Menu.Item>
                        <Menu.Item key="Absence" icon={<AppstoreOutlined />} onClick={function () {
                            setAbsenceVisible(true);
                        }}>
                            申請休假
                        </Menu.Item>
                        <Menu.Item key="Update">
                            更新數據
                        </Menu.Item>
                        <Menu.Item key="Confirm">
                            確認數據
                        </Menu.Item>
                        <SubMenu key="check" icon={<PieChartOutlined />} title="篩選方式">
                            <Menu.Item key="MonthCheck" onClick={function () {
                                setMonthCheck(true);
                            }}>按月查詢</Menu.Item>
                            <Menu.Item key="clear" onClick={function () {
                                setMonthCheck(false);
                                setDate(moment());
                                setPickValue(moment());
                            }}>還原</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="Modals">
                    <Modal title="打卡上班" visible={cardVisible} footer={[
                        <Button onClick={function () {
                            setCardVisible(false);
                        }}>取消</Button>,
                        <Button type="primary" onClick={function () {
                            setCardVisible(false);
                            message.info("打卡成功!");
                        }}>確認打卡</Button>
                    ]}onCancel={function(){
                        setCardVisible(false);
                    }}>
                        <span>今天是</span><span>{moment().format("YYYY-MM-DD")}</span>
                        <div>是否確認打卡上班?</div>
                    </Modal>
                    <Modal title="休假申请" visible={absenceVisible} footer={[
                        <Button onClick={function () {
                            setAbsenceVisible(false);
                        }}>取消</Button>,
                        <Button type="primary" onClick={function () {
                            if(getDuration(startDay,endDay) < 0){
                                message.info("起始日期需小於結束日期!");
                            }
                            else{
                                setAbsenceVisible(false);
                            message.info("成功發送申請!");
                            }
                        }}>發送申請</Button>
                    ]}onCancel={function(){
                            setAbsenceVisible(false);
                    }}>
                        <Select className="selectPattern" placeholder="選擇休假模式" onSelect={function (value) {
                            setSelectPattern(value);
                        }}>
                            <Option value="singleDay">單日休假申請</Option>
                            <Option value="multiDays">多日休假申請</Option>
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
                            {chooseSingleDay != null && <div>您選擇的日期是<span>{chooseSingleDay.format("YYYY-MM-DD")}</span></div>}
                        </div>}
                        {selectPattern === "multiDays" && <div>
                            <span>選擇開始時間</span><span>{<DatePicker defaultValue={moment()} onChange={function(date){
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
                            <span>選擇結束時間</span><span>{<DatePicker defaultValue={moment()} onChange={function(date){
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
                                <div>您選擇的日期是<span>{startDay.format("YYYY-MM-DD")}</span><span>至</span><span>{endDay.format("YYYY-MM-DD")}</span></div>
                                <div>共計請假<span>{getDuration(startDay,endDay)}</span>天</div>
                            </div>}
                        </div>}

                    </Modal>
                </div>
                {monthCheck && <div className="datePicker" >
                    <DatePicker allowClear picker="month" placeholder="按年月查詢"
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
                    <TabPane tab="考勤日程表" key="1">
                        <Table columns={memorizedColumns} scroll={{ x: 'max-content', y: 800 }}
                            pagination={false}
                            bordered ={false}
                            dataSource={punchData}/>
                    </TabPane>
                    <TabPane tab="加勤日程表" key="2">
                        Content of Tab Pane 2
                    </TabPane>

                </Tabs>
            </div>
        </div>

    )
}

