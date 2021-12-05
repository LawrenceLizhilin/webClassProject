import React from 'react';
import {useState, useMemo, useEffect} from 'react';
import {Tabs, DatePicker, Space, Table} from 'antd';
import moment from 'moment';

const {TabPane} = Tabs;
const columns = [
    {
        title: '小組',
        dataIndex: 'group',
        key: 'group',
        width: 100
    }, {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100
    },
]

export default function Timetable() {
    let [date, setDate] = useState (moment().add(-10,'month'));
    let [pickValue, setPickValue] = useState(moment());
    function mGetDate(tempDate) {
        let year = moment(tempDate).toDate().getFullYear();
        let month = moment(tempDate).toDate().getMonth() + 1;
        let d = new Date(year, month, 0);
        return d.getDate();
    }
    // useEffect(() => {
        
    // }, [date]);

    const memorizedColumns = useMemo(() => {
        let clonedColumns = [... columns];
        for (let i = 1; i <= mGetDate(date); i++) {
            let num = i.toString();
            clonedColumns.push({key: num, title: num, width: 60, dataIndex: num});
        }
        clonedColumns.push({key: '加班總時長', title: '加班總時長', width: 160, dataIndex: 'totalHour'});
        return clonedColumns;
    }, [date]);

    return (
        <div>
            <div>
                <DatePicker id="datePicker" allowClear picker="month" placeholder="按年月查詢"
                    value={pickValue}
                    onSelect={
                        function (value) {
                            setPickValue(value);
                            setDate(value);
                        }
                    }/>
            </div>
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Tab 1" key="1">
                    <Table columns={memorizedColumns}/>
                </TabPane>
                <TabPane tab="Tab 2" key="2">
                    Content of Tab Pane 2
                </TabPane>

            </Tabs>
        </div>
    </div>

    )
}

