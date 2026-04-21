import React, { useState } from 'react';
import { default as api } from '../store/apiSlice';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Graph() {
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();
  const [groupBy, setGroupBy] = useState("transaction");

  if (isFetching) return <div>Loading chart...</div>;
  if (isError) return <div>Error loading chart</div>;

  if (isSuccess && data) {
    // ✅ Deduplicate by _id
    const uniqueData = [...new Map(data.map(item => [item._id, item])).values()];
    const amounts = uniqueData.map(item => Number(item.amount));
    const total = amounts.reduce((acc, val) => acc + val, 0);

    const labels =
      groupBy === "transaction"
        ? uniqueData.map(item => `${item.name} – ₹${item.amount}`)
        : uniqueData.map(item => item.type);

    const chartData = {
      labels,
      datasets: [
        {
          data: amounts,
          backgroundColor: uniqueData.map(item => item.color),
          borderWidth: 2,
        },
      ],
    };

    return (
      <div className="chart flex flex-col items-center gap-4">
        <h3 className="text-green-500 font-bold text-xl">Total ₹{total}</h3>

        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1 border rounded ${
              groupBy === "category" ? "bg-indigo-500 text-white" : ""
            }`}
            onClick={() => setGroupBy("category")}
          >
            Group by Category
          </button>
          <button
            className={`px-3 py-1 border rounded ${
              groupBy === "transaction" ? "bg-indigo-500 text-white" : ""
            }`}
            onClick={() => setGroupBy("transaction")}
          >
            Group by Transaction
          </button>
        </div>

        {/* Increased chart size */}
        <div className="w-96 h-96">
          <Doughnut data={chartData} />
        </div>

        <div className="w-full mt-4">
          <h4 className="font-bold mb-2">
            {groupBy === "transaction" ? "Transaction Details" : "Category Totals"}
          </h4>
          {uniqueData.map(item => {
            const overBudget =
              item.budget && Number(item.amount) > Number(item.budget);
            return (
              <div
                key={item._id}
                className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded"
              >
                {groupBy === "transaction"
                  ? `${item.name} – ₹${item.amount}`
                  : `${item.type}: ₹${item.amount}`}
                {item.budget && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Budget: ₹{item.budget})
                  </span>
                )}
                {overBudget && (
                  <span className="text-red-600 font-bold text-sm">⚠ Over Budget!</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <div>No data available</div>;
}
