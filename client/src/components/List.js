import React, { useState } from 'react';
import 'boxicons';
import { default as api } from '../store/apiSlice';

export default function List() {
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();
  const [deleteTransaction] = api.useDeleteTransactionMutation();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handlerClick = (e) => {
    if (!e.target.dataset.id) return;
    deleteTransaction({ _id: e.target.dataset.id });
  };

  if (isFetching) return <div>Loading history...</div>;
  if (isError) return <div>Error loading history</div>;

  let sourceData = isSuccess ? data : [];

  // ✅ Deduplicate by _id
  let uniqueData = [...new Map(sourceData.map(item => [item._id, item])).values()];

  // Apply filters
  uniqueData = uniqueData.filter(
    item => selectedCategory === 'All' || item.type === selectedCategory
  );

  uniqueData = uniqueData.filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Transactions = uniqueData.map((v) => (
    <Transaction key={v._id} category={v} handler={handlerClick} />
  ));

  return (
    <div className="flex flex-col py-6 gap-3">
      <h1 className="py-4 font-bold text-xl">History</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['All', 'Investment', 'Expense', 'Savings', 'Healthcare', 'Education','Travel','Entertainment'].map(cat => (
          <button
            key={cat}
            className={`px-3 py-1 border rounded ${
              selectedCategory === cat ? 'bg-indigo-500 text-white' : ''
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        className="form-input mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {Transactions}
    </div>
  );
}

function Transaction({ category, handler }) {
  if (!category) return null;

  const dateStr = category.date
    ? new Date(category.date).toLocaleDateString()
    : "No date";

  return (
    <div
      className="item flex justify-between items-center bg-gray-50 py-2 px-3 rounded-r"
      style={{ borderRight: `8px solid ${category.color ?? "#e5e5e5"}` }}
    >
      <span>
        {category.name ?? ''} – ₹{category.amount} ({dateStr})
      </span>
      <button onClick={handler}>
        <box-icon
          data-id={category._id ?? ''}
          color={category.color ?? "#e5e5e5"}
          size="15px"
          name="trash"
        ></box-icon>
      </button>
    </div>
  );
}
