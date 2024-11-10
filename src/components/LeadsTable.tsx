import { Check, X, Edit } from "lucide-react"
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from '@/components/ui/input';
import { filterCountries } from "@/lib/helpers";
//@ts-ignore
import countryRegionData from "country-region-data/dist/data-umd";
import { CountryRegion } from "./ui/country-select";
import "../mock/api/mockApi";

type Lead = {
  name: string;
  submitted: string;
  status: string;
  country: string;
};

type Option = {
  label: string;
  value: string;
};

const TableCell = ({ getValue, row, column, table }: any) => {
  const initialValue = getValue();
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const onBlur = () => {
    tableMeta?.updateData(row.index, column.id, value);
  };
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    tableMeta?.updateData(row.index, column.id, e.target.value);
  };
  if (tableMeta?.editedRows[row.id]) {
    return columnMeta?.type === "select" ? (
      <select onChange={onSelectChange} value={initialValue} className="px-4 py-2 border rounded-md w-full max-w-xs">
        {columnMeta?.options?.map((option: Option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : (
      <Input
        className="px-4 py-2 border rounded-md w-full max-w-xs"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        type={columnMeta?.type || "text"}
      />
    );
  }
  return <span>{value}</span>;
};

const columnHelper = createColumnHelper<Lead>();

export const LeadsTable = () => {
  const [data, setData] = useState(() => []);
  // const [originalData, setOriginalData] = useState(() => [...defaultData]);
  const [editedRows, setEditedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [countries, setCountries] = useState<CountryRegion[]>([]);

  const fetchData = async () => {
    const response = await fetch('/api/leads');
    const result = await response.json();
    setData(result);
  };

  useEffect(() => {
    setCountries(
      filterCountries(countryRegionData, [], [], []),
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!searchQuery) {
      setData(data);
      return;
    }

    const filteredData = data.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setData(filteredData);
  }, [searchQuery]);

  const EditCell = ({ row, table }: any) => {
    const meta = table.options.meta;
    const setEditedRows = async (e: MouseEvent<HTMLButtonElement>) => {
      const elName = e.currentTarget.name;
      meta?.setEditedRows((old: any) => ({
        ...old,
        [row.id]: !old[row.id],
      }));
  
      if (elName === "done" && Object.keys(meta.editedRows).length > 0) {
        const response = await fetch(`/api/leads/${row.original.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(row.original),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update lead");
        }
        if (response.ok) {
          fetchData();
          const responseString = JSON.stringify(response, null, 2); 
          alert(responseString);
        }
      }
  
      if (elName !== "edit") {
        meta?.revertData(row.index, e.currentTarget?.name === "cancel");
      }
    };
    return (
      <div className="edit-cell-container">
        {meta?.editedRows[row.id] ? (
          <div className="edit-cell">
            <button onClick={setEditedRows} name="cancel">
              <X size="14" className="mr-2"></X>
            </button>
            <button onClick={setEditedRows} name="done">
              <Check size="14"></Check>
            </button>
          </div>
        ) : (
          <button onClick={setEditedRows} name="edit">
            <Edit size="14"></Edit>
          </button>
        )}
      </div>
    );
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: TableCell,
      meta: {
        type: "text",
      },
    }),
    columnHelper.accessor("submitted", {
      header: "Submitted",
      cell: (info) => <span>{new Date(info.getValue()).toLocaleString()}</span>, // Format as needed
      meta: {
        type: "date",
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: TableCell,
      meta: {
        type: "select",
        options: [{ value: 'Pending', label: 'Pending' }, { value: 'Reached Out', label: 'Reached Out' },],
      },
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: TableCell,
      meta: {
        type: "select",
        options: countries.map(({ countryName, countryShortCode }) => ({ value: countryName, label: countryName })),
      },
    }),
    columnHelper.display({
      id: "edit",
      cell: EditCell,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      editedRows,
      setEditedRows,
      revertData: (rowIndex: number, revert: boolean) => {
        if (revert) {
          setData((old) =>
            old.map((row, index) =>
              index === rowIndex ? data[rowIndex] : row
            )
          );
        } else {
          setData((old) =>
            old.map((row, index) => (index === rowIndex ? data[rowIndex] : row))
          );
        }
      },
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <>
      <div className="rounded-lg">
        <Input
          className="px-4 py-2 border rounded-md w-full max-w-xs"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {data.length ? <table className="w-full border-collapse border outline outline-1 outline-gray-200 overflow-hidden text-left rounded-lg mt-4">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-4 font-normal text-sm text-gray-400">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> :
        <div className="animate-pulse space-y-6 p-4 border rounded-md mt-4">
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-full"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="animate-pulse h-4 bg-gray-200 rounded w-5/6"></div>
        </div>}
    </>
  );
};

export default LeadsTable;
