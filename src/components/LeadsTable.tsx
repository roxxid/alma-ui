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

const defaultData: Lead[] = [
  {
      "name": "Jorge Ruiz",
      "submitted": "02/02/2024, 2:45 PM",
      "status": "Pending",
      "country": "Mexico"
  },
  {
      "name": "Bahar Zamir",
      "submitted": "02/02/2024, 2:45 PM",
      "status": "Pending",
      "country": "Mexico"
  },
  {
      "name": "Mary Lopez",
      "submitted": "02/02/2024, 2:45 PM",
      "status": "Pending",
      "country": "Brazil"
  },
  {
      "name": "Li Zijin",
      "submitted": "02/02/2024, 2:45 PM",
      "status": "Pending",
      "country": "South Korea"
  },
  {
      "name": "Mark Antonov",
      "submitted": "02/02/2024, 2:45 PM",
      "status": "Pending",
      "country": "Russia"
  },
  {
      "name": "Jane Ma",
      "submitted": "02/02/2024, 2:45 PM",
      "status": "Pending",
      "country": "Mexico"
  },
  {
      "name": "Anand Jain",
      "submitted": "02/02/2024, 2:45 PM",
      "status": "Reached Out",
      "country": "Mexico"
  },
  {
      "name": "Anna Voronova",
      "submitted": "02/02/2024, 2:45 PM",
      "status": "Pending",
      "country": "France"
  }
];

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

const EditCell = ({ row, table }: any) => {
  const meta = table.options.meta;
  const setEditedRows = (e: MouseEvent<HTMLButtonElement>) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old: any) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    if (elName !== "edit") {
      meta?.revertData(row.index, e.currentTarget.name === "cancel");
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

const columnHelper = createColumnHelper<Lead>();

export const LeadsTable = () => {
  const [data, setData] = useState(() => [...defaultData]);
  const [originalData, setOriginalData] = useState(() => [...defaultData]);
  const [editedRows, setEditedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [countries, setCountries] = useState<CountryRegion[]>([]);

  useEffect(() => {
      setCountries(
          filterCountries(countryRegionData, [], [], []),
      );
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!searchQuery) {
      setData(originalData);
      return;
    }

    const filteredData = defaultData.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setData(filteredData);
  }, [searchQuery]);

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
      cell: TableCell,
      meta: {
        type: "date",
      },
    }),
    columnHelper.accessor("status", {
      header: "Date Of Birth",
      cell: TableCell,
      meta: {
        type: "string",
      },
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: TableCell,
      meta: {
        type: "select",
        options: countries.map(({ countryName, countryShortCode }) => ( { value: countryName, label: countryName } )),
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
              index === rowIndex ? originalData[rowIndex] : row
            )
          );
        } else {
          setOriginalData((old) =>
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
      <table className="w-full border-collapse border outline outline-1 outline-gray-200 overflow-hidden text-left rounded-lg mt-4">
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
      </table>
    </>
  );
};

export default LeadsTable;
