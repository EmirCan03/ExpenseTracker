import React, { useEffect, useState } from 'react'
import { LuPlus } from "react-icons/lu";
import CustomLineChart from '../Charts/CustomLineChart';
import { prepareExpenseLineChartData } from '../../utils/helper';
const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return <div className='card'>
    <div className='flex items-center justify-between'>
        <div className=''>
            <h5 className='text-lg'>Gider Genel Bakış</h5>
            <p className='text-xs text-gray-400 mt-0.5'>Harcama eğilimlerinizi zaman içinde takip edin ve nereye gittiğine dair içgörüler edinin</p>
        </div>
        <button className='add-btn' onClick={onExpenseIncome}>
            <LuPlus className='text-lg' />
            Gider Ekle
        </button>
    </div>
    <div className='mt-10'>
        <CustomLineChart data={chartData} />
    </div>
  </div>
}

export default ExpenseOverview
