import * as XLSX from "xlsx";

import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaDownload } from "react-icons/fa";

export default function App() {
  const initialData = {
    name: "",
    qty: "",
    cost: "",
    totalCost: "",
  };

  const [data, setData] = useState(initialData);

  const [total, setTotal] = useState(0);

  const [list, setList] = useState([]);

  useEffect(() => {
    let val = 0;
    list.map((item) => {
      val += Number(item.cost) * Number(item.qty);
    });
    setTotal(val);
  }, [list]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="navbar bg-base-100 shadow-xl">
        <a className="btn btn-ghost text-xl">EXPENSE CALCULATOR</a>
      </div>

      {/* List */}
      {list.length > 0 && (
        <table className="mt-10">
          <thead className="p-10 bg-black">
            <tr>
              <th>Item Name</th>
              <th>Quantity / Per Kilogram</th>
              <th>Cost</th>
              <th>Total Item Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, i) => {
              return (
                <tr key={i} className="bg-slate-800">
                  <td>{item?.name}</td>
                  <td>{item?.qty}</td>
                  <td>{item?.cost}</td>
                  <td>{item?.totalCost}</td>
                  <td>
                    <button
                      className="bg-red-600 p-1 rounded-full text-white hover:bg-red-800 duration-200"
                      type="button"
                      onClick={() => {
                        setList(
                          list.filter((item, innerIndex) => i !== innerIndex)
                        );
                      }}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              );
            })}

            <tr className="bg-slate-800">
              <td></td>
              <td></td>
              <td className="font-bold">Total</td>
              <td className="font-bold">{total}</td>
              <td>
                <button
                  className="btn flex gap-2 items-center"
                  type="button"
                  onClick={() => {
                    let finalData = [];

                    const columns = [
                      "#",
                      "Item Name",
                      "Quantity / Per Kilogram",
                      "Cost",
                      "Total Item Cost",
                    ];
                    let rows = [];

                    list.forEach((item, i) => {
                      rows.push([
                        i + 1,
                        item.name,
                        item.qty,
                        item.cost,
                        item.totalCost,
                      ]);
                    });

                    finalData.push(columns);
                    finalData.push(...rows);

                    finalData.push([null, null, null, "Total", total]);

                    const worksheet = XLSX.utils.aoa_to_sheet(finalData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                    XLSX.writeFile(workbook, `Expenses.xlsx`);
                  }}
                >
                  <FaDownload />
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Add */}
      {/* Submit Text */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let val = data;
          val.totalCost = val.cost * val.qty;
          setList([...list, val]);
          setData(initialData);
        }}
        className="mt-10 flex justify-center items-center gap-5"
      >
        <input
          type="text"
          placeholder="Item Name"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setData({ ...data, name: e.target.value })}
          value={data.name}
          required
        />
        <input
          type="number"
          placeholder="Quantity / Per Kilogram"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setData({ ...data, qty: e.target.value })}
          value={data.qty}
          required
        />
        <input
          type="number"
          placeholder="Cost"
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setData({ ...data, cost: e.target.value })}
          value={data.cost}
          required
        />
        <button type="submit" className="btn btn-outline btn-success">
          Add
        </button>
      </form>
    </div>
  );
}
