"use client";

import { supabase } from "@/supabaseClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { businesses } from "../helpers/businesses";

const Home = () => {

  const [purchases, setPurchases] = useState([{ id: 1, item: "", value: "" }]);
  const [sales, setSales] = useState({
    efectivo: "",
    datafono: "",
    nequi: "",
    daviplata: "",
  });

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const {business} = useParams();
  const [businessName, setBusinessName] = useState('')
  console.log("business: ", business);

  useEffect(() => {
    const businessData = businesses.find((b) => b.id === business);
    if (businessData) {
      setBusinessName(businessData.name);
    }
  }, [business]);
  


  const resetFields = () => {
    setPurchases([{ id: 1, item: "", value: "" }]);
    setSales({
      efectivo: "",
      datafono: "",
      nequi: "",
      daviplata: "",
    });
  };

  const handlePurchaseChange = (id: number, field: string, value: string) => {
    setPurchases((prev) =>
      prev.map((purchase) =>
        purchase.id === id ? { ...purchase, [field]: value } : purchase
      )
    );
  };

  const addPurchaseField = () => {
    setPurchases((prev) => [
      ...prev,
      { id: prev.length + 1, item: "", value: "" },
    ]);
  };

  const calculateTotals = () => {
    const totalPurchases = purchases.reduce(
      (sum, purchase) => sum + Number(purchase.value || 0),
      0
    );
    const totalSales =
      Number(sales.efectivo || 0) +
      Number(sales.datafono || 0) +
      Number(sales.nequi || 0) +
      Number(sales.daviplata || 0);
    const consignation = Number(sales.efectivo || 0) - totalPurchases;

    return { totalPurchases, totalSales, consignation };
  };

  const { totalPurchases, totalSales, consignation } = calculateTotals();

  const handleSubmit = async () => {
    try {
      if (totalPurchases === 0 || totalSales === 0) {
        throw new Error("Faltan campos");
      }

      const dataToInsert = {
        store_name: businessName,
        closing_date: date,
        purchases: purchases,
        total_purchases: totalPurchases,
        cash_sales: Number(sales.efectivo || 0),
        dataphone_sales: Number(sales.datafono || 0),
        nequi_sales: Number(sales.nequi || 0),
        daviplata_sales: Number(sales.daviplata || 0),
        total_sales: totalSales,
        consignation: consignation,
      };

      console.log("Datos a subir:", dataToInsert);

      const { error } = await supabase.from("sales_data").insert([dataToInsert]);
      if (error) throw error;

      resetFields();
    } catch (error) {
      console.error("Error al subir los datos:", error);
      alert("Hubo un error al subir los datos.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
        {business ? `Cigarrería: ${businessName}` : "Cargando..."}
      </h1>

      <div className="mb-6">
        <label htmlFor="date" className="block text-blue-300 font-medium mb-2">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-600 bg-gray-700 text-gray-100 rounded p-2 w-full"
        />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">Compras</h2>
        {purchases.map((purchase) => (
          <div key={purchase.id} className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Proveedor"
              value={purchase.item}
              onChange={(e) =>
                handlePurchaseChange(purchase.id, "item", e.target.value)
              }
              className="border border-gray-600 bg-gray-700 text-gray-100 rounded p-2 w-1/2"
            />
            <input
              type="number"
              placeholder="Valor"
              value={purchase.value}
              onChange={(e) =>
                handlePurchaseChange(purchase.id, "value", e.target.value)
              }
              className="border border-gray-600 bg-gray-700 text-gray-100 rounded p-2 w-1/3"
            />
          </div>
        ))}
        <button
          onClick={addPurchaseField}
          className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600"
        >
          Añadir Compra
        </button>

        <div className="mt-4 p-4 bg-gray-700 rounded text-center">
          <p className="text-lg font-semibold text-gray-300">Total de Compras</p>
          <p className="text-2xl font-bold text-blue-300">
            ${totalPurchases.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">Ventas</h2>
        {["efectivo", "datafono", "nequi", "daviplata"].map((type) => (
          <div key={type} className="mb-4">
            <label className="block text-blue-300 font-medium mb-2">
              {type === "efectivo"
                ? "Efectivo"
                : type === "datafono"
                ? "Datáfono"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
            <input
              type="number"
              placeholder={`Venta en ${type}`}
              value={sales[type as keyof typeof sales]}
              onChange={(e) =>
                setSales({ ...sales, [type]: e.target.value })
              }
              className="border border-gray-600 bg-gray-700 text-gray-100 rounded p-2 w-full"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <p className="text-sm font-semibold text-gray-300">Venta Total</p>
          <p className="text-2xl font-bold text-blue-300">
            ${totalSales.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <p className="text-sm font-semibold text-gray-300">Venta en Efectivo</p>
          <p className="text-2xl font-bold text-blue-300">
            ${sales.efectivo || 0}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
          <p className="text-sm font-semibold text-gray-300">Consignación</p>
          <p
            className={`text-2xl font-bold ${
              consignation < 0 ? "text-red-400" : "text-green-400"
            }`}
          >
            ${consignation.toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white py-3 px-6 rounded shadow hover:bg-green-600 w-full"
      >
        Subir Datos
      </button>

    </div>
  );
};

export default Home;
