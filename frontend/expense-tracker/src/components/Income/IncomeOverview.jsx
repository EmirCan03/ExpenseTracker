import React, { useEffect, useState } from 'react'
import { LuPlus } from "react-icons/lu";
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareIncomeBarChartData } from '../../utils/helper';

const IncomeOverview = ({transactions, onAddIncome}) => {
    const [chartData,setChartData] = useState([])

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setChartData(result);

        return () =>{};
    }, [transactions]);
  return (
  <div className="card">
    <div className="flex item-center justify-between">
      <div className="">
        <h5 className="text-lg">Gelir Genel Bakışı</h5>
        <p className="text-xs text-gray-400 mt-0.5">
          Kazançlarınızı zaman içinde takip edin ve gelirinizi analiz edin
        </p>
      </div>

      <button className="add-btn" onClick={onAddIncome}>
        <LuPlus className="text-lg" />
        Gelir Ekle
      </button>
    </div>

    <div className="mt-10">
        <CustomBarChart data={chartData}/>
    </div>
  </div>
);

}

export default IncomeOverview