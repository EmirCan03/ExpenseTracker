import React, { useEffect, useState } from 'react'
import CustomPieCharts from '../Charts/CustomPieChart'

const COLORS = ["#875CF5","#FA2C37", "#FF6900", "#4f39f6"]
export const RecentIncomeWithChart = ({data, totalIncome}) => {
    const [chartData, setChartData] = useState([]);

    const prepareChartData = () => {
        const dataArr = data?.map((item) => ({
           name: item?.source,
           amount: item?.amount, 
        }));

        setChartData(dataArr);
    };
    useEffect(() => {
        prepareChartData();
        return () => {};
    }, [data]);

  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Son 60 Günlük Gelir</h5>
        </div>
    <CustomPieCharts
        data={chartData}
        label="Total Income"
        totalAmount={`${totalIncome}₺`}   
        showTextAnchor
        colors={COLORS}
    />
    </div>     
  )
}
