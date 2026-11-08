import React,{lazy,Suspense}from"react";
import{createRoot}from"react-dom/client";
import Store from"./Store.jsx";
import"./styles.css";
const Admin=lazy(()=>import("./Admin.jsx"));
const isAdmin=window.location.pathname==="/admin"||window.location.pathname==="/admin/";
function App(){return isAdmin?<Suspense fallback={<div className="loading">Opening secure admin…</div>}><Admin/></Suspense>:<Store/>}
createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
