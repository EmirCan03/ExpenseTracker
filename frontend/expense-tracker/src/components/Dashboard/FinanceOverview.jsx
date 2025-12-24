import React from 'react';
import CustomPieChart from '../Charts/CustomPieChart';
const COLORS = ["#875CF5", "#FA2C37" , "#FF6900"];
const FinanceOverview = ({totalBalance,totalIncome,totalExpense}) => {
  const balanceData =[
    { name: "Toplam Bakiye", amount: totalBalance },
    { name: "Toplam Giderler", amount: totalExpense},
    { name: "Toplam Gelirler", amount: totalIncome},
  ];

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Finansal Genel Bakış</h5>
            </div>
            <CustomPieChart
            data={balanceData}
            label="Toplam Bakiye"
            totalAmount={`${totalBalance}₺`}
            colors={COLORS}
            showTextAnchor
            />
        </div>
    );
};

export default FinanceOverview