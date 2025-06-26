import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import Swal from "sweetalert2";

const SaveInvoice = () => {
  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [invoiceRows, setInvoiceRows] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchItems();
    fetchInvoices();
  }, []);

  const fetchClients = async () => {
    const res = await axios.get("/clients?active=true");
    setClients(res.data);
  };

  const fetchItems = async () => {
    const res = await axios.get("/gst-items?active=true");
    setItems(res.data);
  };

  const fetchInvoices = async () => {
    const res = await axios.get("/gst-invoices");
    setInvoices(res.data);
  };

  const handleSoftDelete = async (itemId) => {
    const confirmed = await Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.put(`/invoice-items/${itemId}/delete`);
        Swal.fire("Deleted!", "Item deleted successfully.", "success");
        fetchInvoices(); // Refresh list
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete item.", "error");
      }
    }
  };


  const calculateRow = (row) => {
    const baseAmount = row.quantity * row.price;
    const calc = (rate) => (rate / 100) * baseAmount;

    return {
      ...row,
      cgst_amt: calc(row.cgst_rate),
      sgst_amt: calc(row.sgst_rate),
      igst_amt: calc(row.igst_rate),
      total:
        baseAmount +
        calc(row.cgst_rate) +
        calc(row.sgst_rate) +
        calc(row.igst_rate),
    };
  };

  const handleItemAdd = () => {
    if (!selectedClient || !selectedItem) {
      Swal.fire("Error", "Please select both Client and GST Item", "error");
      return;
    }

    const item = items.find((i) => i.id === parseInt(selectedItem));
    if (!item) return;

    const existingIndex = invoiceRows.findIndex((row) => row.item_id === item.id);

    if (existingIndex !== -1) {
      // Increase quantity and recalculate
      const updated = [...invoiceRows];
      updated[existingIndex].quantity += 1;
      updated[existingIndex] = calculateRow(updated[existingIndex]);
      setInvoiceRows(updated);
    } else {
      const newRow = calculateRow({
        item_id: item.id,
        item_name: item.item_name,
        quantity: 1,
        price: 0,
        cgst_rate: item.cgst_rate,
        sgst_rate: item.sgst_rate,
        igst_rate: item.igst_rate,
      });

      setInvoiceRows([...invoiceRows, newRow]);
    }
  };
  const openInvoicePDF = (invoiceId) => {
    const url = `http://localhost:8000/api/invoices/${invoiceId}/pdf`;
    window.open(url, "_blank", "width=800,height=1000");
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...invoiceRows];
    updated[index][field] = parseFloat(value) || 0;
    updated[index] = calculateRow(updated[index]);
    setInvoiceRows(updated);
  };

  const handleReduceQty = (index) => {
    const updated = [...invoiceRows];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      updated[index] = calculateRow(updated[index]);
    } else {
      updated.splice(index, 1);
    }
    setInvoiceRows(updated);
  };

  const handleDeleteRow = (index) => {
    const updated = [...invoiceRows];
    updated.splice(index, 1);
    setInvoiceRows(updated);
  };

  const handleSave = async () => {
    if (!selectedClient || invoiceRows.length === 0) {
      Swal.fire("Error", "Please select client and add items", "error");
      return;
    }

    try {
      const payload = {
        client_id: selectedClient,  // from dropdown
        billing_date: new Date().toISOString().split("T")[0],  // or use a date picker
        items: invoiceRows.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity,
          rate_per_unit: item.price,
          cgst_amount: item.cgst_amt,
          sgst_amount: item.sgst_amt,
          igst_amount: item.igst_amt,
          total_amount: item.total
        }))
      };
      await axios.post("/invoices", payload);
      Swal.fire("Success", "Invoice saved", "success");
      setInvoiceRows([]);
      setSelectedItem("");
      fetchInvoices();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Save failed", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Generate GST Invoice</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
        <div>
          <label className="block font-semibold mb-1">Client <span className="text-red-600">*</span></label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">GST Item <span className="text-red-600">*</span></label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Select GST Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.item_name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleItemAdd}
          className="bg-blue-600 text-white rounded px-4 py-2 mt-1"
        >
          Add Item
        </button>
      </div>

      {/* Editable GST Table */}
      {invoiceRows.length > 0 && (
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-200 text-sm">
                <th className="p-2 border">Item Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border" colSpan="2">CGST</th>
                <th className="p-2 border" colSpan="2">SGST</th>
                <th className="p-2 border" colSpan="2">IGST</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Actions</th>
              </tr>
              <tr className="bg-gray-100 text-sm">
                <th></th>
                <th></th>
                <th></th>
                <th className="p-1 border">%</th>
                <th className="p-1 border">Amount</th>
                <th className="p-1 border">%</th>
                <th className="p-1 border">Amount</th>
                <th className="p-1 border">%</th>
                <th className="p-1 border">Amount</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoiceRows.map((row, i) => (
                <tr key={i} className="text-sm text-center">
                  <td className="border p-1">{row.item_name}</td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => handleRowChange(i, "price", e.target.value)}
                      className="w-20 border rounded px-1"
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleRowChange(i, "quantity", e.target.value)}
                      className="w-16 border rounded px-1"
                    />
                  </td>
                  <td className="border p-1">{row.cgst_rate}</td>
                  <td className="border p-1">{row.cgst_amt?.toFixed(2)}</td>
                  <td className="border p-1">{row.sgst_rate}</td>
                  <td className="border p-1">{row.sgst_amt?.toFixed(2)}</td>
                  <td className="border p-1">{row.igst_rate}</td>
                  <td className="border p-1">{row.igst_amt?.toFixed(2)}</td>
                  <td className="border p-1">{row.total?.toFixed(2)}</td>
                  <td className="border p-1 space-x-2">
                    <button
                      className="text-yellow-600 underline"
                      onClick={() => handleReduceQty(i)}
                    >
                      Reduce Qty
                    </button>
                    <button
                      className="text-red-600 underline"
                      onClick={() => handleDeleteRow(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invoiceRows.length > 0 && (
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded mb-6"
        >
          Save Invoice
        </button>
      )}

      {/* Invoices List */}
      {invoices.length > 0 ? (
        <>
          <h3 className="text-xl font-bold mb-2 mt-6">Saved Invoices</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-200 text-center">
                <tr>
                  <th className="p-2 border">Client Name</th>
                  <th className="p-2 border">Invoice #</th>
                  <th className="p-2 border">GST Item</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border" colSpan={2}>CGST</th>
                  <th className="p-2 border" colSpan={2}>SGST</th>
                  <th className="p-2 border" colSpan={2}>IGST</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Action</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className="p-1 border">%</th>
                  <th className="p-1 border">Amt</th>
                  <th className="p-1 border">%</th>
                  <th className="p-1 border">Amt</th>
                  <th className="p-1 border">%</th>
                  <th className="p-1 border">Amt</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => {
                  const validItems = inv.items.filter((item) => !item.is_deleted);

                  if (validItems.length === 0) return null; // Skip invoice if all items are deleted

                  let cgstTotal = 0, sgstTotal = 0, igstTotal = 0, grandTotal = 0;

                  validItems.forEach((item) => {
                    cgstTotal += item.cgst_amount;
                    sgstTotal += item.sgst_amount;
                    igstTotal += item.igst_amount;
                    grandTotal += item.total_amount;
                  });

                  return (
                    <React.Fragment key={inv.id}>
                      {validItems.map((item, j) => (
                        <tr key={`${inv.id}-${j}`} className="text-center">
                          <td className="border p-1">{inv.client.name}</td>
                          <td className="border p-1">{inv.invoice_number}</td>
                          <td className="border p-1">{item.item.item_name}</td>
                          <td className="border p-1">{item.rate_per_unit}</td>
                          <td className="border p-1">{item.quantity}</td>
                          <td className="border p-1">{item.item.cgst_rate}</td>
                          <td className="border p-1">{item.cgst_amount.toFixed(2)}</td>
                          <td className="border p-1">{item.item.sgst_rate}</td>
                          <td className="border p-1">{item.sgst_amount.toFixed(2)}</td>
                          <td className="border p-1">{item.item.igst_rate}</td>
                          <td className="border p-1">{item.igst_amount.toFixed(2)}</td>
                          <td className="border p-1">{item.total_amount.toFixed(2)}</td>
                          <td className="border p-1">
                            <button
                              className="text-red-600 underline"
                              onClick={() => {
                                console.log("Deleting item:", item);
                                handleSoftDelete(item.id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* Summary row */}
                      <tr className="bg-gray-100 font-semibold text-center">
                        <td className="border p-1 text-right" colSpan={5}>Invoice Totals:</td>
                        <td className="border p-1">{cgstTotal.toFixed(2)}</td>
                        <td className="border p-1"></td>
                        <td className="border p-1">{sgstTotal.toFixed(2)}</td>
                        <td className="border p-1"></td>
                        <td className="border p-1">{igstTotal.toFixed(2)}</td>
                        <td className="border p-1">{grandTotal.toFixed(2)}</td>
                        <td className="border p-1" colSpan={2}>
                          <button
                            className="text-red-600"
                            onClick={() => openInvoicePDF(inv.id)}
                            title="View PDF"
                          >
                            PDF
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>

            </table>
          </div>
        </>
      ) : (
        <p className="text-gray-600 italic text-center mt-6">No invoices found.</p>
      )}


    </div>
  );
};

export default SaveInvoice;
